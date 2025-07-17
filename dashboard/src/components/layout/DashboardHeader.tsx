import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import LogoutButton from "@/features/auth/components/logout-button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DashboardHeader({
  title = "Dashboard",
  className,
}: {
  title?: string;
  className?: string;
}) {
  const { open, isMobile } = useSidebar();
  const isOpen = open && !isMobile;

  return (
    <motion.header
      animate={{
        left: isOpen ? "256px" : "0",
        width: isOpen ? "calc(100% - 256px)" : "100%",
      }}
      initial={{
        left: isOpen ? "256px" : "0",
        width: isOpen ? "calc(100% - 256px)" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className={cn(
        "fixed top-0 h-[60px] shrink-0 z-50 bg-background items-center gap-2 border-b",
        className
      )}
    >
      <div className="flex  h-full  w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 hover:bg-secondary rounded-md p-2">
            <h2 className="text-sm">Dark Mode</h2>
            <ThemeToggle />
          </div>
          <LogoutButton />
        </div>
      </div>
    </motion.header>
  );
}
