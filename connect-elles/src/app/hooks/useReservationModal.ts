import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_URL } from "../utils/constants";

interface UseReservationProps {
  userId: string | null;
  serviceId: string;
  onReservationSuccess: () => void;
  onClose: () => void;
}

export function useReservation({ userId, serviceId, onReservationSuccess, onClose }: UseReservationProps) {
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
    if (!cleanedCardNumber || cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
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

      await axios.post(`${API_URL}/reservations/${userId}/${serviceId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("Reservation created successfully!");
      resetForm();
      onReservationSuccess();

      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to create reservation");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setReservationDate("");
    setCardHolderName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
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

  return {
    reservationDate,
    setReservationDate,
    cardHolderName,
    setCardHolderName,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCVV,
    setCardCVV,
    isLoading,
    errorMessage,
    successMessage,
    handleSubmit,
    handleCardNumberChange,
    handleExpiryChange,
  };
}
