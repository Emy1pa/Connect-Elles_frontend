"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const girls = require("../../../../public/girl.jpg");

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  profileImage: z.instanceof(File).nullable(),
});
type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      profileImage: null,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await fetch(
        "http://localhost:4000/api/users/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUserEmail(data.email);
        setRegistrationSuccess(true);

        toast.success("Registration successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setPreviewImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-pink-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass = `w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl 
    font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform 
    hover:-translate-y-1 transition-all duration-300 ${
      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
    }`;

  return (
    <div className="h-screen w-full bg-pink-50 relative overflow-hidden">
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

      <div className="relative min-h-screen flex items-center justify-center p-4 -mt-4">
        <div className="w-full max-w-md max-h-[80vh] overflow-y-auto custom-scroll rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-pink-800">
                Join Our Circle
              </h1>
              <p className="mt-2 text-pink-600">
                Start your journey of growth and connection
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Enter your full name"
                  className={inputClass}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">
                  Username
                </label>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Enter your username"
                  className={inputClass}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">
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
                <label className="block text-sm font-medium text-pink-700 mb-1">
                  Password
                </label>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-3"
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="text-teal-400 hover:text-teal-600"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-teal-400 hover:text-teal-600"
                    />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">
                  Profile Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profile-image"
                    onChange={handleImageChange}
                  />
                  {errors.profileImage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.profileImage.message}
                    </p>
                  )}
                  <label
                    htmlFor="profile-image"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer hover:border-pink-400 transition-all duration-300"
                  >
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewImage}
                          alt="Profile Preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-pink-400" />
                        <span className="mt-2 block text-sm text-pink-600">
                          Upload your photo
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className={buttonClass}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-300"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
