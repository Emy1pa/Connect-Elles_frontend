import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  serviceId: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  userId,
  serviceId,
}) => {
  const router = useRouter();
  const [reservationDate, setReservationDate] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  const validateForm = () => {
    setErrorMessage("");

    if (!reservationDate) {
      setErrorMessage("Please select a reservation date");
      return false;
    }

    if (!cardHolderName) {
      setErrorMessage("Please enter the cardholder name");
      return false;
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    if (
      !cleanedCardNumber ||
      cleanedCardNumber.length < 13 ||
      cleanedCardNumber.length > 19
    ) {
      setErrorMessage("Please enter a valid card number (13-19 digits)");
      return false;
    }

    if (!cardExpiry || !cardExpiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setErrorMessage("Please enter a valid expiry date (MM/YY)");
      return false;
    }

    if (!cardCVV || !cardCVV.match(/^\d{3,4}$/)) {
      setErrorMessage("Please enter a valid CVV (3-4 digits)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        reservationDate: new Date(reservationDate).toISOString(),
        cardHolderName,
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardExpiry,
        cardCVV,
      };

      await axios.post(
        `http://localhost:4000/reservations/${userId}/${serviceId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Reservation created successfully!");
      setReservationDate("");
      setCardHolderName("");
      setCardNumber("");
      setCardExpiry("");
      setCardCVV("");
      setTimeout(() => {
        onClose();
        <Link href={"/user/services"} />;
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create reservation"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\//g, "");

    if (cleaned.length <= 2) {
      setCardExpiry(cleaned);
    } else {
      setCardExpiry(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            Make Reservation
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        {successMessage && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 flex items-start">
            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-emerald-800">Success!</h3>
              <p className="text-emerald-700 text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="flex">
          <div className="w-1/2 overflow-y-auto custom-scroll max-h-96 border-r border-slate-200">
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div className="w-full">
                  <label
                    htmlFor="reservationDate"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    disabled={isLoading}
                    id="reservationDate"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="w-1/2 overflow-y-auto custom-scroll max-h-96">
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div className="border-t-0 pt-0 pb-2">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-emerald-500" />
                  Payment Information
                </h3>
              </div>

              <div>
                <label
                  htmlFor="cardHolderName"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="Name on card"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  id="cardNumber"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="1234 5678 9012 3456"
                  disabled={isLoading}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="cardExpiry"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Expiry
                  </label>
                  <input
                    type="text"
                    id="cardExpiry"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                    placeholder="MM/YY"
                    maxLength={5}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardCVV"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    id="cardCVV"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                    placeholder="123"
                    maxLength={4}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
