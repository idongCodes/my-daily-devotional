import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center text-xs text-gray-600 dark:text-gray-400">
        <p>
          &copy; {currentYear} My Daily Devotional. All Rights Reserved. Made with ✝️ by{" "}
          <Link
            href="https://idong-essien.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            idongCodes
          </Link>
        </p>
      </div>
    </footer>
  );
}
