import React from "react";
import { FolderOpen, Users, BarChart } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
    { icon: BarChart, label: "Statistics", path: "/admin/statistics" },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-pink-50 to-white">
      <div>
        <div className="flex items-center space-x-3"></div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link href={item.path} key={index}>
            <div className="px-6 py-4 cursor-pointer hover:bg-pink-50/80 transition-all duration-300 group">
              <div className="flex items-center space-x-3">
                <item.icon
                  size={20}
                  className="text-rose-700 group-hover:text-rose-500 transition-colors duration-200"
                />
                <span className="text-rose-900 group-hover:text-rose-700 transition-colors duration-200 font-medium">
                  {item.label}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
        <div className="mt-6 flex items-center space-x-3"></div>
      </div>
    </div>
  );
};

export default Sidebar;
