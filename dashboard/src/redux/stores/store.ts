import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import sideMenuReducer from "./sideMenuSlice";
import simpleMenuReducer from "./simpleMenuSlice";
import topMenuReducer from "./topMenuSlice";
import form from "./form";
import auth from "./api/auth/auth";
import logout from "./api/auth/logout";
import messages from "./api/messages";
import notification from "./api/notifications/notification";
import sendNotificationsToAllUsers from "./api/notifications/sendToAllUsers";
import sendNotificationsToSelectedUsers from "./api/notifications/sendToSelectedUsers";
import myprofile from "./api/profile/myprofile";
import updateProfile from "./api/settings/profile/update";
import studios from "./api/cycles/rental";
import portfolioPost from "./api/cycles/project";
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
///////////////// platform
import updatePlatform from "./api/platform/update";
import getPlatformById from "./api/platform/getById";
import getAllPlatforms from "./api/platform/getAll";
import deletePlatform from "./api/platform/delete";
import createPlatform from "./api/platform/create";
///////////////// copoun
import updateCoupon from "./api/coupon/update";
import getCouponById from "./api/coupon/getById";
import getAllCoupons from "./api/coupon/getAll";
import createCoupon from "./api/coupon/create";
///////////////// complaint
import getComplaintById from "./api/complaint/getById";
import getAllComplaints from "./api/complaint/getAll";
import updateComplaint from "./api/complaint/update";
//////////////// Analysis
import copyRightsAnalysis from "./api/analysis/copyright";
import projectAnalysis from "./api/analysis/project";
import producerAnalysis from "./api/analysis/producer";
import rentalAnalysis from "./api/analysis/rental";
import contractAnalysis from "./api/analysis/contracts";
//////////////// reviews
import reviews from "./api/reviews/reviews";
//////////////// Admin
import createAdmin from "./api/Admin/create";
import blockAdmin from "./api/Admin/block";
import unBlockAdmin from "./api/Admin/unblock";
import editAdmin from './api/Admin/edit'
export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    simpleMenu: simpleMenuReducer,
    topMenu: topMenuReducer,
    form,
    auth,
    logout,
    apisErrors,
    messages,
    notification,
    sendNotificationsToAllUsers,
    sendNotificationsToSelectedUsers,
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
    updateProfile,
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
    createRank,
    //////////////// Platform
    updatePlatform,
    getPlatformById,
    getAllPlatforms,
    deletePlatform,
    createPlatform,
    //////////////// Coupons
    updateCoupon,
    getCouponById,
    getAllCoupons,
    createCoupon,
    //////////////// Complaints
    getAllComplaints,
    getComplaintById,
    updateComplaint,
    //////////////// Analysis
    projectAnalysis,
    rentalAnalysis,
    copyRightsAnalysis,
    producerAnalysis,
    contractAnalysis,
    //////////////// reviews
    reviews,
    createAdmin,
    blockAdmin,
    unBlockAdmin,
    editAdmin,
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
