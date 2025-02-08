"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/app/utils/interface";

const girls = require("../../../../public/girl.jpg");

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        "http://localhost:5000/api/users/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const token = result.accessToken;
        localStorage.setItem("token", token);
        const decoded: DecodedToken = jwtDecode(token);
        localStorage.setItem("userId", decoded.id.toString());
        localStorage.setItem("userRole", decoded.userRole);
        toast.success("Login successful!");
        setTimeout(() => {
          if (decoded.userRole === "admin") {
            router.push("/admin");
          } else if (decoded.userRole === "mentor") {
            router.push("/mentor");
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-teal-200 focus:border-teal-400 focus:ring-teal-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass = `w-full px-6 py-3 bg-gradient-to-r from-teal-400 to-pink-400 text-white rounded-xl 
    font-medium shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transform 
    hover:-translate-y-1 transition-all duration-300 ${
      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
    }`;

  return (
    <div className="h-screen w-full bg-teal-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={girls}
          alt="Floral Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-teal-800">Welcome Back</h1>
              <p className="mt-2 text-teal-600">
                Continue your journey with us
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className={inputClass}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={20}
                        className="text-teal-400 hover:text-teal-600 "
                      />
                    ) : (
                      <Eye
                        size={20}
                        className="text-teal-400 hover:text-teal-600 h-4 "
                      />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={buttonClass}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/register"
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-300"
              >
                Don't have an account? Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
