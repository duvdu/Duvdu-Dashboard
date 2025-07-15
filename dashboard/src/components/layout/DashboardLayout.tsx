import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PageLoader } from "../ui/page-loader";
import { SiteHeader } from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  children,
  className,
  title,
  loading,
}: {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  title?: string;
}) {
  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full overflow-hidden`}>
        <DashboardSidebar />
        <div className="flex-1  flex flex-col w-full min-w-0">
          <SiteHeader title={title} />
          <main
            className={cn(
              "flex-1 py-6 px-6 relative bg-muted overflow-hidden",
              className
            )}
          >
            {loading ? (
              <PageLoader />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(" z-10")}
              >
                {children}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
