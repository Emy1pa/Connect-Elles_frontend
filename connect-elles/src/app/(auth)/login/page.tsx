"use client";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/app/utils/types/login";
import { useLogin } from "@/app/hooks/useLogin";
import { girls } from "@/app/utils/images";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isSubmitting } = useLogin();

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
    await login(data);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-rose-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass = `w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-xl 
    font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform 
    hover:-translate-y-1 transition-all duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <div className="h-screen w-full bg-rose-50 relative overflow-hidden">
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
              <h1 className="text-3xl font-bold text-rose-800">Welcome Back</h1>
              <p className="mt-2 text-rose-600">Continue your journey with us</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">Email</label>
                <input {...register("email")} type="email" placeholder="Enter your email" className={inputClass} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-rose-700 mb-1">Password</label>
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
                      <EyeOff size={20} className="text-rose-400 hover:text-rose-600 " />
                    ) : (
                      <Eye size={20} className="text-rose-400 hover:text-rose-600 h-4 " />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" className={buttonClass} disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/register"
                className="text-rose-600 hover:text-rose-700 font-medium transition-colors duration-300"
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
