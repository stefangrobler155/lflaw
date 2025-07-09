"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; email: string }) => void;
};

export default function FreeDownloadModal({ isOpen, onClose, onSubmit }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    onSubmit({ name, email });
    onClose();
    };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed z-50 inset-0 flex justify-center items-center px-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="bg-white  rounded-lg shadow-lg max-w-md w-full p-6 relative">
            {/* ✨ Close Button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:accent__text transition"
                aria-label="Close modal"
            >
                <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Download Contract</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-2 border rounded"
                />
                <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-2 border rounded"
                />
                <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                Download Now
                </button>
            </form>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
