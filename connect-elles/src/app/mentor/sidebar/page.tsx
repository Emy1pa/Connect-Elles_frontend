import React from "react";
import { Book, Briefcase, Brain, Ticket } from "lucide-react";
import Link from "next/link";

const MentorSideBar = () => {
  const menuItems = [
    { icon: Brain, label: "Skills", path: "/mentor/skills" },
    { icon: Book, label: "Articles", path: "/mentor/blogs" },
    { icon: Briefcase, label: "Services", path: "/mentor/services" },
    { icon: Ticket, label: "Reservations", path: "/mentor/reservations" },
    { icon: Briefcase, label: "Statistics", path: "/mentor/statistics" },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-pink-50/80 to-white">
      <div>
        <div className="flex items-center space-x-3"></div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link href={item.path} key={index}>
            <div className="px-6 py-4 cursor-pointer hover:bg-pink-50/50 transition-all duration-300 group">
              <div className="flex items-center space-x-3">
                <item.icon
                  size={20}
                  className="text-rose-700 group-hover:text-rose-400 transition-colors duration-200"
                />
                <span className="text-rose-800 group-hover:text-rose-500 transition-colors duration-200 font-medium">
                  {item.label}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-100 to-transparent" />
        <div className="mt-6 flex items-center space-x-3"></div>
      </div>
    </div>
  );
};

export default MentorSideBar;
