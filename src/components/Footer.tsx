import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-xs text-gray-600 dark:text-gray-400">
        <Link 
          href="/watch-sermons" 
          className="mb-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Watch Live Sermons
        </Link>
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
        
        {/* Contact Email Icon */}
        <a 
          href="mailto:idongesit_essien@ymail.com" 
          className="mt-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Contact via Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
