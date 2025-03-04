import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

import { RegisterFormData } from "@/app/utils/types/register";
import { API_URL } from "@/app/utils/constants";

export const useRegister = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const register = async (data: RegisterFormData) => {
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

      const response = await axios.post(`${API_URL}/api/users/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setUserEmail(data.email);
        setRegistrationSuccess(true);

        toast.success("Registration successful!");

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data.message || "Something went wrong. Please try again."
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    registrationSuccess,
    userEmail,
    register,
  };
};
