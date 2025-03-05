"use client";
import UserSideBar from "./sidebar/page";
import { usePathname } from "next/navigation";
export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebarPaths = ["/user/favorites", "/user/blogs", "/user/services", "/user/mentors"];
  const shouldShowSidebar = !noSidebarPaths.some((path) => pathname?.startsWith(path));

  return (
    <div className="flex">
      {shouldShowSidebar && <UserSideBar />}
      <main className={`flex-1 ${shouldShowSidebar ? "ml-0" : "ml-0"}`}>{children}</main>
    </div>
  );
}
