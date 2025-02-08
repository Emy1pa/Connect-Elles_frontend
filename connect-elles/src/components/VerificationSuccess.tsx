import React from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const VerificationSuccess = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-xl backdrop-blur-md p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Email Verified Successfully!
          </h2>

          <p className="text-green-600 mb-6">
            Your email has been verified. You can now log in to your account.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl 
              font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform 
              hover:-translate-y-1 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;
