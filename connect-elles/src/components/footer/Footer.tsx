import React from "react";
import Link from "next/link";
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Heart,
  Mail,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Community: [
      { label: "Find Groups", href: "/groups" },
      { label: "Events", href: "/events" },
      { label: "Workshops", href: "/workshops" },
      { label: "Mentorship", href: "/mentorship" },
    ],
    Resources: [
      { label: "Articles", href: "/articles" },
      { label: "Guides", href: "/guides" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Podcast", href: "/podcast" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-b from-white via-pink-50/50 to-rose-50/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 right-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl group-hover:from-pink-200 group-hover:to-rose-200 transition-all duration-300">
                <svg
                  className="h-5 w-5 text-pink-600"
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
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Together
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-1.5 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg
                           transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-pink-600 inline-flex items-center
                               transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Newsletter
            </h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-1.5 text-sm rounded-l-lg border border-pink-100 focus:outline-none focus:border-pink-300
                         bg-white/70 backdrop-blur-sm transition-all duration-300"
              />
              <button
                className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-r-lg 
                         hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-pink-100 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-xs text-slate-600">
            © 2025 Together. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center">
            Made with{" "}
            <Heart
              size={12}
              className="mx-1 text-rose-500"
              fill="currentColor"
            />{" "}
            for our community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
