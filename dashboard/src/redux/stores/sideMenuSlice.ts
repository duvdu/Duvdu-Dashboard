import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/",
    },
    {
      icon: "ShoppingBag",
      title: "Categories",
      subMenu: [
        {
          icon: "Activity",
          title: "Categories",
          pathname: "/categories",
        },
        {
          icon: "Activity",
          pathname: "/add-category",
          title: "Add Category",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "Projects",
      subMenu: [
        {
          icon: "Activity",
          title: "Get All Projects",
          pathname: "/projects",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "Copyrights",
      subMenu: [
        {
          icon: "Activity",
          title: "Get All Copyrights",
          pathname: "/copy-rights",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "Rentals",
      subMenu: [
        {
          icon: "Activity",
          title: "Get All Rentals",
          pathname: "/rentals",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "Producers",
      subMenu: [
        {
          icon: "Activity",
          title: "Get All Producers",
          pathname: "/producer",
        },
      ],
    },
    {
      icon: "HardDrive",
      pathname: "/terms",
      title: "Terms",
    },
    {
      icon: "Users",
      pathname: "/users",
      title: "Users",
    },
    {
      icon: "BellPlus",
      pathname: "/notifications",
      title: "Notifications",
    },
    {
      icon: "MessageSquare",
      pathname: "/allchats",
      title: "Chats",
    },
    {
      icon: "MessageSquare",
      pathname: "/ticket",
      title: "Tickets",
    },
    {
      icon: "HardDrive",
      pathname: "/roles",
      title: "Roles",
    },
    {
      icon: "HardDrive",
      pathname: "/plans",
      title: "Plans",
    },
    {
      icon: "HardDrive",
      pathname: "/ranks",
      title: "Ranks",
    },

    "divider",
    {
      icon: "Edit",
      title: "app tabs",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/crud-data-list",
          title: "Data List",
        },
        {
          icon: "Activity",
          pathname: "/crud-form",
          title: "Form",
        },
        {
          icon: "Inbox",
          pathname: "/inbox",
          title: "Inbox",
        },
        {
          icon: "HardDrive",
          pathname: "/file-manager",
          title: "File Manager",
        },
        {
          icon: "CreditCard",
          pathname: "/point-of-sale",
          title: "Point of Sale",
        },
        {
          icon: "MessageSquare",
          pathname: "/chat",
          title: "Chat",
        },
        {
          icon: "FileText",
          pathname: "/post",
          title: "Post",
        },
        {
          icon: "Calendar",
          pathname: "/calendar",
          title: "Calendar",
        },
        {
          icon: "Users",
          title: "Users",
          pathname: "/users-layout-2",
        },
        {
          icon: "Activity",
          pathname: "/profile-overview-1",
          title: "Overview 1",
        },
        {
          icon: "Activity",
          pathname: "/profile-overview-2",
          title: "Overview 2",
        },
        {
          icon: "Activity",
          pathname: "/profile-overview-3",
          title: "Overview 3",
        },
        {
          icon: "Zap",
          pathname: "/wizard-layout-1",
          title: "Layout 1",
        },
        {
          icon: "Zap",
          pathname: "/wizard-layout-2",
          title: "Layout 2",
        },
        {
          icon: "Zap",
          pathname: "/wizard-layout-3",
          title: "Layout 3",
        },
        {
          icon: "Zap",
          pathname: "/blog-layout-1",
          title: "Layout 1",
        },
        {
          icon: "Zap",
          pathname: "/blog-layout-2",
          title: "Layout 2",
        },
        {
          icon: "Zap",
          pathname: "/blog-layout-3",
          title: "Layout 3",
        },
        {
          icon: "Zap",
          pathname: "/pricing-layout-1",
          title: "Layout 1",
        },
        {
          icon: "Zap",
          pathname: "/pricing-layout-2",
          title: "Layout 2",
        },
        {
          icon: "Zap",
          pathname: "/invoice-layout-1",
          title: "Layout 1",
        },
        {
          icon: "Zap",
          pathname: "/invoice-layout-2",
          title: "Layout 2",
        },
        {
          icon: "Zap",
          pathname: "/faq-layout-1",
          title: "Layout 1",
        },
        {
          icon: "Zap",
          pathname: "/faq-layout-2",
          title: "Layout 2",
        },
        {
          icon: "Zap",
          pathname: "/faq-layout-3",
          title: "Layout 3",
        },
        {
          icon: "Activity",
          pathname: "login",
          title: "Login",
        },
        {
          icon: "Activity",
          pathname: "register",
          title: "Register",
        },
        {
          icon: "Activity",
          pathname: "error-page",
          title: "Error Page",
        },
        {
          icon: "Activity",
          pathname: "/update-profile",
          title: "Update profile",
        },
        {
          icon: "Activity",
          pathname: "/change-password",
          title: "Change Password",
        },
        {
          icon: "Zap",
          pathname: "/regular-table",
          title: "Regular Table",
        },
        {
          icon: "Zap",
          pathname: "/tabulator",
          title: "Tabulator",
        },
        {
          icon: "Zap",
          pathname: "/modal",
          title: "Modal",
        },
        {
          icon: "Zap",
          pathname: "/slideover",
          title: "Slide Over",
        },
        {
          icon: "Zap",
          pathname: "/notification",
          title: "Notification",
        },
        {
           icon: "Activity",
           pathname: "/tab",
           title: "Tab",
         },
         {
           icon: "Activity",
           pathname: "/accordion",
           title: "Accordion",
         },
         {
           icon: "Activity",
           pathname: "/button",
           title: "Button",
         },
         {
           icon: "Activity",
           pathname: "/alert",
           title: "Alert",
         },
         {
           icon: "Activity",
           pathname: "/progress-bar",
           title: "Progress Bar",
         },
         {
           icon: "Activity",
           pathname: "/tooltip",
           title: "Tooltip",
         },
         {
           icon: "Activity",
           pathname: "/dropdown",
           title: "Dropdown",
         },
         {
           icon: "Activity",
           pathname: "/typography",
           title: "Typography",
         },
         {
           icon: "Activity",
           pathname: "/icon",
           title: "Icon",
         },
         {
           icon: "Activity",
           pathname: "/loading-icon",
           title: "Loading Icon",
         },
         {
           icon: "Activity",
           pathname: "/regular-form",
           title: "Regular Form",
         },
         {
           icon: "Activity",
           pathname: "/datepicker",
           title: "Datepicker",
         },
         {
           icon: "Activity",
           pathname: "/tom-select",
           title: "Tom Select",
         },
         {
           icon: "Activity",
           pathname: "/file-upload",
           title: "File Upload",
         },
         {
           icon: "Activity",
           pathname: "/wysiwyg-editor",
           title: "Wysiwyg Editor",
         },
         {
           icon: "Activity",
           pathname: "/validation",
           title: "Validation",
         },
         {
           icon: "Activity",
           pathname: "/chart",
           title: "Chart",
         },
         {
           icon: "Activity",
           pathname: "/slider",
           title: "Slider",
         },
         {
           icon: "Activity",
           pathname: "/image-zoom",
           title: "Image Zoom",
         },
      ]
    },

  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
