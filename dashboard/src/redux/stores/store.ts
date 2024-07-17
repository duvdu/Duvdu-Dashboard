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
import deleteCategory from "./api/category/delete";
import createcategory from "./api/category/create";
import terms from "./api/terms";
import ticket from "./api/ticket";
import users from "./api/users";
import chat from "./api/chat/one";
import allchat from "./api/chat/all";
import sendmessage from "./api/chat/sendMsg";
//////////////// roles
import updateRole from "./api/roles/update";
import getRoleById from "./api/roles/getById";
import getAllRole from "./api/roles/getAll";
import deleteRole from "./api/roles/delete";
import createRole from "./api/roles/create";
//////////////// roles
import updatePlan from "./api/plan/update";
import getPlanById from "./api/plan/getById";
import getAllPlan from "./api/plan/getAll";
import deletePlan from "./api/plan/delete";
import createPlan from "./api/plan/create";
///////////////// ranks
import updateRank from "./api/rank/update";
import getRankById from "./api/rank/getById";
import getAllRanks from "./api/rank/getAll";
import deleteRank from "./api/rank/delete";
import createRank from "./api/rank/create";

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
    deleteCategory,
    createcategory,
    copyRights,
    ticket,
    users,
    chat,
    allchat,
    sendmessage,
    terms,
    //////////////// roles
    updateRole,
    getRoleById,
    getAllRole,
    deleteRole,
    createRole,
    //////////////// plans
    updatePlan,
    getPlanById,
    getAllPlan,
    deletePlan,
    createPlan,
    //////////////// Ranks
    updateRank,
    getRankById,
    getAllRanks,
    deleteRank,
    createRank
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
