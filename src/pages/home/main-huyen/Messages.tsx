import { IconButton, TextField } from "@mui/material"
import { Box } from "@mui/system"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import GifBoxRoundedIcon from '@mui/icons-material/GifBoxRounded';
import SendIcon from '@mui/icons-material/Send';
import SingleMessage from "./SingleMessage";
import { FormEvent, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/firestore";
import { selectAllMessagesWithUser, selectShow, sendMessageToUser, subscribeToMessages } from "../../../redux-slices/messagesSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "../../../types";
import { selectCurrentUser } from "../../../redux-slices/currentUserSlice";
import { CircularProgress } from "@material-ui/core";
import styles from './../Home.module.css';
import { AppDispatch } from "../../../main";
import { darkTheme } from "../../../theme";


const Messages = () => {
    const dispatch: AppDispatch = useDispatch();
    const [message, setMessage] = useState('');
    const messages = useSelector(selectAllMessagesWithUser);
    const show = useSelector(selectShow);

    // currentUser (sender) & targeted user (receiver)
    const currentUser = useSelector(selectCurrentUser);
    const { username } = useParams();

    useEffect(() => {
        const subscribe = async () => {
            const usernames = {
                username1: currentUser.username,
                username2: username,
            };
            const unsubscriber = await dispatch(subscribeToMessages(usernames));
            return unsubscriber as Unsubscribe;
        };

        const unsubscriberPromise = subscribe();

        return () => {
            unsubscriberPromise.then(unsubscriber => unsubscriber());
        };
    }, [currentUser, username]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (message.trim() === '') {
            return;
        }
        if (currentUser) {
            const from = currentUser.username;
            const to = username;
            const content = message;
            dispatch(sendMessageToUser({ from, to, content }));
        }
        setMessage('');
    }


    return (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
            padding="20px"
            paddingRight="0"
        >
            {/* Show Previous Messages */}
            <Box id="messages" sx={{
                flexGrow: "1",
                overflowY: "scroll",
                mb: "15px",
            }}
                className={styles.customScroll}
            >
                {show && <CircularProgress />}
                {messages.map((message: Message) => {
                    let sender = message.from;
                    // if (message.from !== user?.uid && uid) {
                    //     sender = uid;
                    // }
                    return (
                        <SingleMessage
                            key={message.id}
                            from={sender}
                            createdAt={message.createdAt}
                            content={message.content}
                        />
                    );
                })}
            </Box>

            {/* Message Input */}
            <Box
                id="input"
                width="100%"
                display="flex"
                borderRadius="8px"
                padding="10px"
                sx={{ backgroundColor: darkTheme.palette.background.paper }}
            >
                {/* File Sharing Button */}
                <IconButton>
                    <AddCircleRoundedIcon />
                </IconButton>

                {/* Input */}
                <form
                    style={{ width: "100%", marginRight: "5px" }}
                    onSubmit={e => { handleSubmit(e) }}
                >
                    <TextField
                        id="messageInput"
                        name="messageInput"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Enter message"
                        variant="standard"
                        fullWidth
                    />
                </form>

                {/* Sent Button */}
                <IconButton onClick={e => { handleSubmit(e) }}>
                    <SendIcon />
                </IconButton>
                <IconButton>
                    <GifBoxRoundedIcon />
                </IconButton>
                <IconButton>
                    <AddReactionRoundedIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Messages