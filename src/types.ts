import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "./main";

export type AppThunk<ReturnType> = ThunkAction<
    Promise<ReturnType>, // Specify the return type of the thunk as a Promise
    RootState,
    unknown,
    UnknownAction
>;

import { Theme } from "@mui/material/styles";
import { Palette } from "@mui/material/styles/createPalette";

// Define the structure of your theme object
export interface MyTheme extends Theme {
    palette: Palette;
    // You can add additional custom properties if needed
}

import { Timestamp } from "firebase/firestore";

export interface User {
    uid: string,
    email: string,
    username: string,
    displayName: string | null | undefined,
    photoURL: string | null | undefined,
    createdAt: string,
    bannerColor: string,
    bannerURL: string,
    aboutMe: string,
    metadata: {
        creationTime: Timestamp
    }
}

export interface Channel {
    type: "text" | "voice",
    name: string,
    id: string,
}

export interface Message {
    id: string,
    from: string,
    createdAt: Timestamp,
    content: string,
}

export interface Server {
    id: string,
    name: string,
    photoURL: string,
    members: string[],
    messages: Message[],
}

export interface ServerListItem {
    serverName: string;
    photoURL: string | undefined;
}