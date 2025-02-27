import React from "react";
import { X, Calendar, CreditCard, AlertCircle } from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
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
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex">
          <div className="w-1/2 overflow-y-auto custom-scroll max-h-96 border-r border-slate-200">
            <form className="p-6 space-y-4">
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
                    id="reservationDate"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="w-1/2 overflow-y-auto custom-scroll max-h-96">
            <form className="p-6 space-y-4">
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="Name on card"
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
                  id="cardNumber"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="1234 5678 9012 3456"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                    placeholder="MM/YY"
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
                    id="cardCVV"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Confirm Reservation
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
