import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import sideMenuReducer from "./sideMenuSlice";
import simpleMenuReducer from "./simpleMenuSlice";
import topMenuReducer from "./topMenuSlice";
import form from "./form";
import auth from "./api/auth/auth";
import messages from "./api/messages";
import notification from "./api/notification";
import myprofile from "./api/profile/myprofile";

import studios from "./api/cycles/studioBooking";
import portfolioPost from "./api/cycles/portfolioPost";
import producer from "./api/cycles/producer";
import copyRights from "./api/cycles/copyRights";
import apisErrors from "./apis_errors";
import category from "./api/category/category";
import createcategory from "./api/category/create";
import terms from "./api/terms";
import ticket from "./api/ticket";
import users from "./api/users";
import chat from "./api/chat/one";
import allchat from "./api/chat/all";
import sendmessage from "./api/chat/sendMsg";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    simpleMenu: simpleMenuReducer,
    topMenu: topMenuReducer,
    form,
    auth,
    apisErrors,
    messages,
    notification,
    myprofile,
    studios,
    portfolioPost,
    producer,
    category,
    createcategory,
    copyRights,
    ticket,
    users,
    chat,
    allchat,
    sendmessage,
    terms
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
