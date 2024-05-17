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

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    form: form,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    simpleMenu: simpleMenuReducer,
    topMenu: topMenuReducer,
    auth: auth,
    messages: messages,
    notification: notification,
    myprofile: myprofile,
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
