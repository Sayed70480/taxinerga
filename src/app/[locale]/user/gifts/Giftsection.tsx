"use client"
import React, { useState } from 'react';

// Content component definition (as previously provided, with children: any)
interface ContentProps {
  children: any; // Type 'any' as requested
  className?: string; // Optional string for CSS classes
}

const Content: React.FC<ContentProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default function GiftsPage() {
  const [openedBoxes, setOpenedBoxes] = useState(new Set<number>()); // Specific type for Set elements for better clarity
  const [prizes, setPrizes] = useState<Record<number, string>>({}); // Specific type for prizes for better clarity

  const prizeOptions: string[] = [
    "🎉 $10 Bonus!",
    "💎 Premium Features",
    "🎁 Free Month",
    "⭐ 50 Points",
    "🏆 VIP Status",
    "💰 $25 Credit", // Corrected the stray character here if it was still present
    "🎊 Special Badge",
    "🌟 Double XP"
  ];

  // Type 'any' for boxIndex as requested for function props
  const handleBoxClick = (boxIndex: any): any => {
    if (!openedBoxes.has(boxIndex)) {
      const randomPrize = prizeOptions[Math.floor(Math.random() * prizeOptions.length)];
      setOpenedBoxes(new Set([...openedBoxes  , boxIndex]));
      setPrizes({ ...prizes, [boxIndex]: randomPrize });
    }
  };

  // Define interface for GiftBox props with 'any' types as requested
  interface GiftBoxProps {
    index: any;      // Type 'any'
    isOpened: any;   // Type 'any'
    prize: any;      // Type 'any'
  
  }

  // GiftBox component, defined as a nested component for clarity.
  // Its props are typed as 'any' as requested.
  const GiftBox: React.FC<GiftBoxProps> = ({ index, isOpened, prize }) => (
    <div
      onClick={() => handleBoxClick(index)}
      className={`aspect-square rounded-3xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
        isOpened
          ? 'bg-green-100 border-2 border-green-300'
          : 'bg-blue-100 hover:bg-blue-200 hover:scale-105'
      }`}
    >
      {isOpened ? (
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-sm font-bold text-green-700">{prize}</div>
        </div>
      ) : (
        <div className="text-6xl">
          {/* Gift box emoji made with CSS */}
          <div className="relative">
            {/* Box base */}
            <div className="w-16 h-12 bg-orange-400 rounded-sm relative">
              {/* Box lid */}
              <div className="w-16 h-4 bg-orange-500 rounded-sm absolute -top-2"></div>
              {/* Vertical ribbon */}
              <div className="w-2 h-16 bg-red-600 absolute left-1/2 transform -translate-x-1/2 -top-2"></div>
              {/* Horizontal ribbon */}
              <div className="w-16 h-2 bg-red-600 absolute top-1 left-0"></div>
              {/* Bow */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-3 bg-red-700 rounded-full"></div>
                <div className="w-2 h-2 bg-red-800 rounded-full absolute top-0.5 left-1"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className="px-4 min-h-screen bg-gray-50">
      <Content className="flex max-w-[480px] flex-col gap-6 mx-auto py-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
            <span className="text-gray-600 text-lg">‹</span>
          </button>
          <h1 className="text-2xl font-bold text-black">Gifts</h1>
        </div>

        {/* Instructions */}
        <div className="text-gray-600 text-base text-center">
          Select a box to reveal your prize.
        </div>

        {/* Gift Boxes Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[0, 1, 2, 3].map((index) => (
            <GiftBox
              key={index}
              index={index}
              isOpened={openedBoxes.has(index)}
              prize={prizes[index]}
            />
          ))}
        </div>

        {/* Progress indicator */}
        {openedBoxes.size > 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            {openedBoxes.size} of 4 boxes opened
          </div>
        )}

        {/* Reset button for demo purposes */}
        {openedBoxes.size === 4 && (
          <button
            onClick={() => {
              setOpenedBoxes(new Set());
              setPrizes({});
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-medium hover:bg-blue-700 transition-colors mt-4"
          >
            Reset Boxes
          </button>
        )}

      </Content>
    </main>
  );
}
