import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LogoutButton from "@/features/auth/components/logout-button";

export function SiteHeader({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="flex h-[60px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* <div className="flex items-center gap-2 hover:bg-secondary rounded-md p-2">
            <h2 className="text-sm">Dark Mode</h2>
            <ThemeToggle />
          </div> */}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
