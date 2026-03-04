"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 flex items-center justify-between">
        
        {/* Right side: Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="text-3xl sm:text-4xl md:text-5xl">🍑</div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">מטע משפחתי</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">אפרסקים • נקטרינות • אפרסומונים</p>
          </div>
        </div>

        {/* Left side: Navigation */}
        <nav className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* "All Orders" button */}
          <button
            onClick={() => router.push("/")}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2 md:py-3 rounded-full font-medium sm:font-semibold text-sm sm:text-base transition-colors ${
              pathname === "/"
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-700 border border-orange-500 hover:bg-orange-50"
            }`}
          >
            כל ההזמנות
          </button>

          {/* "New Order" button */}
          <button
            onClick={() => router.push("/new-order")}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2 md:py-3 rounded-full font-medium sm:font-semibold text-sm sm:text-base transition-colors ${
              pathname === "/new-order"
                ? "bg-orange-500 text-white"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
          >
            הזמנה חדשה +
          </button>
        </nav>
      </div>
    </header>
  );
}
