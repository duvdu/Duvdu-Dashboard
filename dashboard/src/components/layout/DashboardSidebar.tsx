import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  ChevronRight,
  Home,
  MessageCircleMore,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function DashboardSidebar() {
  const sidebarLinks = [
    {
      path: "/dashboard/home",
      icon: Home,
      label: "Home",
      iconColor: "text-green-600",
      items: [],
    },

    {
      path: "/dashboard/projects",
      icon: Calendar,
      label: "Cycles",
      iconColor: "text-gray-600",
      items: [
        {
          path: "/dashboard/projects",
          label: "Projects",
        },
      ],
    },
    {
      path: "/dashboard/users",
      icon: User,
      label: "Users",
      iconColor: "text-gray-600",
      items: [],
    },
    {
      path: "/dashboard/chat",
      icon: MessageCircleMore,
      label: "Chat",
      iconColor: "text-blue-600",
      items: [],
    },
    {
      path: "/dashboard/categories",
      icon: Settings,
      label: "Categories",
      iconColor: "text-gray-600",
      items: [],
    },
    {
      path: "/dashboard/roles",
      icon: Shield,
      label: "Roles",
      iconColor: "text-gray-600",
      items: [],
    },
    {
      path: "/dashboard/admins",
      icon: Users,
      label: "Admins",
      iconColor: "text-gray-600",
      items: [],
    },
    // {
    //   path: "/dashboard/partners",
    //   icon: UserCircle,
    //   label: "Partners",
    //   iconColor: "text-gray-600",
    //   items: [],
    // },
    // {
    //   path: "/dashboard/suppliers",
    //   icon: Users,
    //   label: "Suppliers",
    //   iconColor: "text-gray-600",
    //   items: [],
    // },
  ];

  const { pathname } = useLocation();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <Sidebar side={"left"} className="bg-background border-r-0">
      <SidebarContent className="gap-8 bg-background border-none py-4">
        <div className="p-4 px-8">
          <Link to={`/dashboard`} className="z-10">
            <img src="/logo.svg" alt="logo" />
          </Link>
        </div>
        <SidebarMenu className="px-4">
          {sidebarLinks.map((link, index) => (
            <SidebarMenuItem key={index}>
              {link.items && link.items.length > 0 ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      className={`selection:bg-black w-full text-left flex items-center justify-between ${
                        isActive(link.path)
                          ? `bg-secondary font-bold text-primary hover:bg-secondary`
                          : ``
                      }`}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center h-12 w-full ${isActive(
                          link.path
                        )}`}
                        tabIndex={0}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 mr-1 ${
                            isActive(link.path) ? "bg-secondary" : ""
                          }`}
                        >
                          <link.icon className="h-6 w-6" />
                        </div>
                        <span className="text-base">{link.label}</span>
                        <span className="ml-auto text-xs">
                          <ChevronRight />
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    side="right"
                    className="p-0 w-48"
                  >
                    <ul className="flex flex-col gap-1">
                      {link.items.map((child, childIdx) => (
                        <li key={childIdx}>
                          <Link
                            to={child.path}
                            className={`block text-sm py-2 px-4 rounded hover:bg-muted transition-colors ${
                              isActive(child.path)
                                ? "bg-muted font-semibold"
                                : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              ) : (
                <SidebarMenuButton
                  asChild
                  className={`selection:bg-black w-full text-left flex items-center justify-start ${
                    isActive(link.path)
                      ? `bg-secondary font-bold text-primary hover:bg-secondary`
                      : ``
                  }`}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center h-12 w-full ${isActive(
                      link.path
                    )}`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 mr-1 ${
                        isActive(link.path) ? "bg-secondary" : ""
                      }`}
                    >
                      <link.icon className="h-6 w-6" />
                    </div>
                    <span className="text-base">{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="flex items-center w-full gap-3 px-4 mt-10 border-t pt-4">
          {/* <div className="flex-shrink-0">
            <img src="/icons/sharia-icon.svg" alt="sharia-icon" />
          </div> */}
          {/* <div className="text-xs text-muted-foreground">
            <p>Sharia Approved</p>
          </div> */}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default DashboardSidebar;
