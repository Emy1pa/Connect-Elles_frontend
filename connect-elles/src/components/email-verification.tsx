"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const EmailVerificationStatus = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const id = searchParams.get("id");
        const token = searchParams.get("token");

        if (!id || !token) {
          setStatus("error");
          setMessage("Invalid verification link");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/users/verify-email/${id}/${token}`,
          {
            method: "GET",
          }
        );
        console.log(response);

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen w-full bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-pink-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-pink-800 mb-4">
                Verifying Your Email
              </h2>
              <p className="text-pink-600">Please wait a moment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Email Verified!
              </h2>
              <p className="text-green-600 mb-6">{message}</p>
              <p className="text-sm text-green-600">
                Redirecting you to login page...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-4">
                Verification Failed
              </h2>
              <p className="text-red-600 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-block px-6 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl 
                  font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform 
                  hover:-translate-y-1 transition-all duration-300"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationStatus;
