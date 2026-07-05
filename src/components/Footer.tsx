"use client";

import Link from "next/link";
import { useState } from "react";
import ContactForm from "./ContactForm";

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black pt-6 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-xs text-gray-600 dark:text-gray-400">
        <div className="mb-4 flex items-center justify-center gap-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
          <Link href="/watch-sermons" className="hover:underline">
            Watch Live Sermons
          </Link>
          <span className="text-gray-400 font-normal">|</span>
          <button onClick={() => setIsContactOpen(true)} className="hover:underline text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
            Get in Touch
          </button>
        </div>
        <p>
          &copy; {currentYear} My Daily Devotional. All Rights Reserved. Made with ✝️ by{" "}
          <Link
            href="https://essien.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            idongCodes
          </Link>
        </p>
      </div>
      <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
}
