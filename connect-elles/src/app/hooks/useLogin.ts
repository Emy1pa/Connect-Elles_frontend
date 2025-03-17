import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { LoginFormData } from "@/app/utils/types/login";
import { API_URL } from "@/app/utils/constants";
import { DecodedToken } from "@/app/utils/interface";
import axios from "axios";

export const useLogin = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = async (data: LoginFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API_URL}/api/users/auth/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const token = response.data.accessToken;
        localStorage.setItem("token", token);
        const decoded: DecodedToken = jwtDecode(token);
        localStorage.setItem("userId", decoded.id.toString());
        localStorage.setItem("userRole", decoded.userRole);
        toast.success("Login successful!");
        setTimeout(() => {
          if (decoded.userRole === "admin") {
            router.replace("/admin/statistics");
          } else if (decoded.userRole === "mentor") {
            router.replace("/mentor/statistics");
          } else if (decoded.userRole === "normal-user") {
            router.replace("/user/statistics");
          }
        }, 1500);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, login };
};
