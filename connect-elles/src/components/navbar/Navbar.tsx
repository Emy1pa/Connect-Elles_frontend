"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      setIsLoggedIn(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const navItems = [
    { label: "Community", href: "/community" },
    { label: "Support Groups", href: "/groups" },
    { label: "Blogs", href: "/user/blogs" },
    { label: "Success Stories", href: "/stories" },
    { label: "Services", href: "/user/services" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl group-hover:from-pink-200 group-hover:to-rose-200 transition-all duration-300">
                <svg
                  className="h-8 w-8 text-pink-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Together
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-slate-700 hover:text-pink-600 rounded-lg hover:bg-pink-50 
                         transition-all duration-300 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <Link
                href="/register"
                className="px-6 py-2 text-white font-medium rounded-lg
                      bg-gradient-to-r from-pink-500 to-rose-500
                      shadow-lg shadow-pink-500/25
                      hover:shadow-pink-500/40
                      transform hover:-translate-y-0.5
                      transition-all duration-300 
                      active:scale-95"
              >
                Join Circle
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/register"
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg
               shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.35)]
                          hover:bg-red-700
                transform hover:-translate-y-0.5
                transition-all duration-300 
                active:scale-95"
              >
                <button onClick={handleLogout}>Log out</button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-pink-600 hover:bg-pink-50 
                       transition-all duration-300"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-pink-100">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-slate-700 hover:text-pink-600 rounded-lg 
                         hover:bg-pink-50 transition-all duration-300 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <Link
                href="/register"
                className="block w-full text-center px-4 py-3 text-white rounded-lg 
                      bg-gradient-to-r from-pink-500 to-rose-500
                      shadow-lg shadow-pink-500/25
                      hover:shadow-pink-500/40
                      transition-all duration-300"
              >
                Join Circle
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/register"
                className="block w-full bg-red-600 text-center px-4 py-3 text-white rounded-lg 
                     shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.35)]
                          hover:bg-red-700
                      transition-all duration-300"
              >
                <button onClick={handleLogout}>Log out</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
