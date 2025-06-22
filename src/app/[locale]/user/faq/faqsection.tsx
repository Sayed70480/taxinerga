"use client"

import React, { useState } from 'react';

const Content = ({ children , className }) => (
  <div className={className}>{children}</div>
);

export default function FAQSection() {
  const [expandedItems, setExpandedItems] = useState(new Set());
  
  const faqItems = [
    {
      id: 1,
      question: "Lorem ipsum dolor sit amet?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
    },
    {
      id: 2,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      answer: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      id: 3,
      question: "Lorem ipsum dolor sit amet?",
      answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
    }
  ];

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <main className="px-4 min-h-screen bg-gray-100">
      <Content className="flex max-w-[480px] flex-col gap-4 mx-auto py-6">
        
        {/* FAQ Header */}
        <div className="bg-blue-500 text-white text-center py-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">FAQ</h1>
        </div>

        {/* FAQ Items Container */}
        <div className="bg-white rounded-b-lg shadow-sm overflow-hidden">
          {faqItems.map((item, index) => (
            <div key={item.id}>
              <div 
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                  index !== faqItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex-1 pr-4">
                  <p className="text-gray-800 text-base leading-relaxed">
                    {item.question}
                  </p>
                  
                  {/* Show answer if expanded */}
                  {expandedItems.has(item.id) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Plus/Minus Icon for all items */}
                <div className="flex-shrink-0">
                  {expandedItems.has(item.id) ? (
                    <span className="w-6 h-6 text-blue-500 text-xl font-bold flex items-center justify-center">−</span>
                  ) : (
                    <span className="w-6 h-6 text-blue-500 text-xl font-bold flex items-center justify-center">+</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

       
      </Content>
    </main>
  );
}