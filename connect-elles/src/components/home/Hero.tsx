"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Heart,
  Users,
  Star,
  Sparkles,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const women = require("../../../public/women.jpg");

const Hero = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);
  const handledashboard = () => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "mentor") {
      router.push("/mentor");
    } else if (userRole === "normal-user") {
      router.push("/user");
    }
  };
  const featureCards = [
    {
      icon: <Heart className="w-8 h-8 text-rose-400" />,
      title: "Supportive Community",
      description:
        "Find your tribe of like-minded women who uplift and inspire each other every day.",
      bgColor: "bg-rose-50",
      iconBg: "bg-rose-100",
      borderColor: "border-rose-200",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Mentorship Programs",
      description:
        "Connect with experienced mentors who guide you on your personal growth journey.",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      icon: <Star className="w-8 h-8 text-pink-400" />,
      title: "Skill Workshops",
      description:
        "Participate in workshops designed to enhance both personal and professional skills.",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
      borderColor: "border-pink-200",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-fuchsia-400" />,
      title: "Wellness Sessions",
      description:
        "Join regular wellness activities focused on mental and physical well-being.",
      bgColor: "bg-fuchsia-50",
      iconBg: "bg-fuchsia-100",
      borderColor: "border-fuchsia-200",
    },
    {
      icon: <Calendar className="w-8 h-8 text-violet-400" />,
      title: "Regular Meetups",
      description:
        "Attend both virtual and in-person events to build lasting friendships.",
      bgColor: "bg-violet-50",
      iconBg: "bg-violet-100",
      borderColor: "border-violet-200",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-rose-400" />,
      title: "Safe Space Discussions",
      description:
        "Engage in open conversations about challenges and victories in a supportive environment.",
      bgColor: "bg-rose-50",
      iconBg: "bg-rose-100",
      borderColor: "border-rose-200",
    },
  ];

  return (
    <>
      <div className="relative min-h-[calc(100vh-5rem)] bg-gradient-to-br from-green-50 via-pink-50 to-rose-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[calc(100vh-5rem)]">
            <div className="grid lg:grid-cols-2 gap-8 items-center py-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
                    Supporting Each Other
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
                    Growing
                    <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-green-500">
                      Together
                    </span>
                  </h1>
                  <p className="text-lg text-slate-600 max-w-xl">
                    Join our welcoming community where women support, inspire,
                    and empower each other. Create lasting friendships and grow
                    together in a safe, nurturing environment.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {!isLoggedIn && (
                    <Link href={"/register"}>
                      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300">
                        Join Our Circle
                      </button>
                    </Link>
                  )}
                  {isLoggedIn && (
                    <button
                      onClick={handledashboard}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Go To Dashboard
                    </button>
                  )}
                  <button className="px-6 py-3 border-2 border-pink-200 text-pink-700 rounded-xl font-medium hover:bg-pink-50 transform hover:-translate-y-1 transition-all duration-300">
                    Learn More
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "12K+", label: "Friends Made" },
                    { value: "300+", label: "Support Groups" },
                    { value: "50+", label: "Activities" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 rounded-xl bg-white/60 backdrop-blur-sm"
                    >
                      <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-rose-500/30 rounded-3xl blur-2xl transform rotate-6"></div>
                  <Image
                    src={women}
                    alt="Women Supporting Women"
                    className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                  />

                  <div className="absolute -left-8 top-1/4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl animate-bounce">
                    <div className="text-pink-800 font-medium">🌸 Support</div>
                  </div>
                  <div className="absolute -right-16 bottom-3/4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl animate-bounce">
                    <div className="text-pink-800 font-medium">🤗 Share </div>
                  </div>
                  <div className="absolute -right-8 bottom-1/4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl animate-bounce delay-150">
                    <div className="text-rose-800 font-medium">
                      💝 Friendship
                    </div>
                  </div>
                  <div className="absolute left-1/4 -bottom-8 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl animate-bounce delay-300">
                    <div className="text-pink-800 font-medium">✨ Growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -z-10"></div>

          <div className="text-center mb-16 relative">
            <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-4">
              Our Features
            </span>
            <h2 className="text-3xl font-bold text-slate-800">
              Empowering Women Through
              <span className="block mt-2 text-pink-600">
                Community & Connection
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Discover all the ways we support your journey of growth,
              connection, and empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border ${card.borderColor} ${card.bgColor} backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className={`p-3 rounded-xl ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    {card.title}
                  </h3>
                  <p className="text-slate-600">{card.description}</p>
                </div>

                <div
                  className={`absolute top-0 right-0 w-16 h-16 ${card.bgColor} rounded-bl-3xl -z-10 transform translate-x-2 -translate-y-2 opacity-50`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
