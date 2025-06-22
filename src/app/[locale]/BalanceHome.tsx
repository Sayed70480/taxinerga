"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import Routes from "@/config/Routes"; // Your Routes config
import { useParams } from 'next/navigation'; // Import useParams

const Content = ({ children, className }) => (
  <div className={className}>{children}</div>
);

// userMenu is not directly used in the rendering of this component's links,
// but it's fine to keep it if it's used elsewhere.
const userMenu = Object.values(Routes.user.subPages || []);

export default function BalanceHomePage() {
  const [balance, setBalance] = useState(800);
  const [refundableBalance, setRefundableBalance] = useState(12);
  const [minimumGuarantee] = useState(1000);

  // Get the locale from the URL parameters
  const params = useParams();
  const locale = params.locale; // Assuming the dynamic segment is named 'locale'

  // Safely get the paths from your Routes configuration
  // Make sure 'founds' and 'gift' are correctly defined in Routes.user.subPages
  const addFundsPath = Routes.user.subPages?.founds?.path;
  const giftsPagePath = Routes.user.subPages?.gift?.path;

  // Optional: Add a check to prevent errors if paths are undefined
  if (!locale || !addFundsPath || !giftsPagePath) {
    // You might want a more sophisticated error/loading state here
    console.error("Locale or route paths are undefined. Check Routes.ts and URL.");
    return <div>Loading or configuration error...</div>;
  }

  return (
    <main className="px-4 min-h-screen bg-gray-50">
      <Content className="flex max-w-[480px] flex-col px-2 rounded-lg gap-4 mx-auto py-6 bg-slate-300">

        {/* Balance Section */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
          <h1 className="text-lg text-gray-600 mb-2">Balance</h1>
          <div className="text-5xl font-bold text-black mb-6">${balance}</div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Corrected "Add funds" Link href */}
            <Link
              href={`/${locale}${addFundsPath}`} // Uses locale + path from Routes.ts
              className="flex-1 bg-blue-100 text-blue-600 py-3 px-6 rounded-full font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span>
              Add funds
            </Link>
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Send funds
            </button>
          </div>
        </div>

        {/* Balance Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-gray-600 text-sm mb-1">Refundable balance</h3>
            <div className="text-2xl font-bold text-black">${refundableBalance}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-gray-600 text-sm mb-1">Minimum guarantee</h3>
            <div className="text-2xl font-bold text-black">{minimumGuarantee}</div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded-xl">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold">?</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">How does the guaranteed Income work?</p>
            </div>
          </div>
        </div>

        {/* Promotions Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-black">Promotions</h2>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-lg font-bold">Daily giveaway</h3>
                <p className="text-blue-100">Mission 2</p>
              </div>
              {/* Corrected "Open page" (gifts) Link href */}
              <Link
                href={`/${locale}${giftsPagePath}`} // Uses locale + path from Routes.ts
                className="bg-white bg-opacity-20 text-white py-2 px-4 rounded-full font-medium hover:bg-opacity-30 transition-colors"
              >
                Open page
              </Link>
            </div>

            {/* Decorative coin icon */}
            <div className="absolute -right-4 -top-4 w-24 h-24 opacity-20">
              <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-2xl font-bold">$</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute right-8 top-4 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute right-12 top-8 w-1 h-1 bg-white rounded-full opacity-40"></div>
            <div className="absolute right-6 top-12 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Top 20 Drivers Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
              <span className="text-gray-600 text-lg">‹</span>
            </button>
            <h2 className="text-lg font-bold text-black">Top 20 drivers</h2>
          </div>

          {/* Drivers List */}
          <div className="divide-y divide-gray-100">
            {[
              { name: "Mark Smith", rank: 1 },
              { name: "Robert Jones", rank: 2 },
              { name: "John Williams", rank: 3 },
              { name: "Michael Brown", rank: 4 },
              { name: "David Miller", rank: 5 },
              { name: "Amos Miller", rank: 6 },
              { name: "Joseph Sanchez", rank: 7 },
              { name: "Anna Marco", rank: 8 },
              { name: "Anton Oatehe", rank: 9 },
              { name: "Clarkd Oikeron", rank: 10 },
              { name: "Joseph Sanchez", rank: 12 },
              { name: "Den Mart", rank: 14 }
            ].map((driver, index) => (
              <div key={index} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                {/* Profile Icon */}
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-lg">👤</span>
                </div>

                {/* Driver Name */}
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{driver.name}</p>
                </div>

                {/* Rank Number */}
                <div className="text-gray-900 font-bold text-lg">
                  {driver.rank}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional spacing */}
        <div className="pb-6"></div>

      </Content>
    </main>
  );
}