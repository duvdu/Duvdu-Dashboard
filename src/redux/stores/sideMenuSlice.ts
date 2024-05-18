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
      title: "categories",
      subMenu: [
        {
          icon: "Activity",
          title: "Categories",
          pathname: "/categories",
        },
        {
          icon: "Activity",
          pathname: "/category-form",
          title: "Add Category",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "portfolio",
      subMenu: [
        {
          icon: "Activity",
          title: "grid",
          pathname: "/portfolio-post",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "copy rights",
      subMenu: [
        {
          icon: "Activity",
          title: "grid",
          pathname: "/copy-rights",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "studios",
      subMenu: [
        {
          icon: "Activity",
          title: "grid",
          pathname: "/studio-booking",
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "producer",
      subMenu: [
        {
          icon: "Activity",
          title: "grid",
          pathname: "/producer",
        },
      ],
    },

    // {
    //   icon: "Inbox",
    //   pathname: "/inbox",
    //   title: "Inbox",
    // },
    // {
    //   icon: "HardDrive",
    //   pathname: "/file-manager",
    //   title: "File Manager",
    // },
    // {
    //   icon: "CreditCard",
    //   pathname: "/point-of-sale",
    //   title: "Point of Sale",
    // },
    // {
    //   icon: "MessageSquare",
    //   pathname: "/chat",
    //   title: "Chat",
    // },
    // {
    //   icon: "FileText",
    //   pathname: "/post",
    //   title: "Post",
    // },
    // {
    //   icon: "Calendar",
    //   pathname: "/calendar",
    //   title: "Calendar",
    // },
    // "divider",
    // {
    //   icon: "Edit",
    //   title: "Crud",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       pathname: "/crud-data-list",
    //       title: "Data List",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/crud-form",
    //       title: "Form",
    //     },
    //   ],
    // },
    // {
    //   icon: "Users",
    //   title: "Users",
    //   pathname: "/users-layout-2",
    // },
    // {
    //   icon: "Trello",
    //   title: "Profile",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       pathname: "/profile-overview-1",
    //       title: "Overview 1",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/profile-overview-2",
    //       title: "Overview 2",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/profile-overview-3",
    //       title: "Overview 3",
    //     },
    //   ],
    // },
    // {
    //   icon: "Layout",
    //   title: "Pages",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       title: "Wizards",
    //       subMenu: [
    //         {
    //           icon: "Zap",
    //           pathname: "/wizard-layout-1",
    //           title: "Layout 1",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/wizard-layout-2",
    //           title: "Layout 2",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/wizard-layout-3",
    //           title: "Layout 3",
    //         },
    //       ],
    //     },
    //     {
    //       icon: "Activity",
    //       title: "Blog",
    //       subMenu: [
    //         {
    //           icon: "Zap",
    //           pathname: "/blog-layout-1",
    //           title: "Layout 1",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/blog-layout-2",
    //           title: "Layout 2",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/blog-layout-3",
    //           title: "Layout 3",
    //         },
    //       ],
    //     },
    //     {
    //       icon: "Activity",
    //       title: "Pricing",
    //       subMenu: [
    //         {
    //           icon: "Zap",
    //           pathname: "/pricing-layout-1",
    //           title: "Layout 1",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/pricing-layout-2",
    //           title: "Layout 2",
    //         },
    //       ],
    //     },
    //     {
    //       icon: "Activity",
    //       title: "Invoice",
    //       subMenu: [
    //         {
    //           icon: "Zap",
    //           pathname: "/invoice-layout-1",
    //           title: "Layout 1",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/invoice-layout-2",
    //           title: "Layout 2",
    //         },
    //       ],
    //     },
    //     {
    //       icon: "Activity",
    //       title: "FAQ",
    //       subMenu: [
    //         {
    //           icon: "Zap",
    //           pathname: "/faq-layout-1",
    //           title: "Layout 1",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/faq-layout-2",
    //           title: "Layout 2",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/faq-layout-3",
    //           title: "Layout 3",
    //         },
    //       ],
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "login",
    //       title: "Login",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "register",
    //       title: "Register",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "error-page",
    //       title: "Error Page",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/update-profile",
    //       title: "Update profile",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/change-password",
    //       title: "Change Password",
    //     },
    //   ],
    // },
    // "divider",
    // {
    //   icon: "Inbox",
    //   title: "Components",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       title: "Table",
    //       subMenu: [
    //         {
    //           icon: "Zap",
    //           pathname: "/regular-table",
    //           title: "Regular Table",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/tabulator",
    //           title: "Tabulator",
    //         },
    //       ],
    //     },
    //     {
    //       icon: "Activity",
    //       title: "Overlay",
    //       subMenu: [
    //         {
    //           icon: "Zap",
    //           pathname: "/modal",
    //           title: "Modal",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/slideover",
    //           title: "Slide Over",
    //         },
    //         {
    //           icon: "Zap",
    //           pathname: "/notification",
    //           title: "Notification",
    //         },
    //       ],
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/tab",
    //       title: "Tab",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/accordion",
    //       title: "Accordion",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/button",
    //       title: "Button",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/alert",
    //       title: "Alert",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/progress-bar",
    //       title: "Progress Bar",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/tooltip",
    //       title: "Tooltip",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/dropdown",
    //       title: "Dropdown",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/typography",
    //       title: "Typography",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/icon",
    //       title: "Icon",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/loading-icon",
    //       title: "Loading Icon",
    //     },
    //   ],
    // },
    // {
    //   icon: "Sidebar",
    //   title: "Forms",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       pathname: "/regular-form",
    //       title: "Regular Form",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/datepicker",
    //       title: "Datepicker",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/tom-select",
    //       title: "Tom Select",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/file-upload",
    //       title: "File Upload",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/wysiwyg-editor",
    //       title: "Wysiwyg Editor",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/validation",
    //       title: "Validation",
    //     },
    //   ],
    // },
    // {
    //   icon: "HardDrive",
    //   title: "Widgets",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       pathname: "/chart",
    //       title: "Chart",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/slider",
    //       title: "Slider",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/image-zoom",
    //       title: "Image Zoom",
    //     },
    //   ],
    // },
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
