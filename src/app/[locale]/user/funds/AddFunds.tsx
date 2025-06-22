"use client"

import React, { useState } from 'react';

const Content = ({ children , className }) => (
  <div className={className}>{children}</div>
);

export default function AddFunds() {
  const [copied, setCopied] = useState(false);
  
  const bankDetails = {
    name: "Gary Wilson",
    accountNumber: "1234567890123456",
    routingNumber: "987654321"
  };

  const handleCopy = () => {
    const detailsText = `${bankDetails.name}\n${bankDetails.accountNumber}\n${bankDetails.routingNumber}`;
    navigator.clipboard.writeText(detailsText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="px-4 min-h-screen bg-gray-50">
      <Content className="flex max-w-[480px] flex-col gap-6 mx-auto py-6 bg-slate-300 px-2 rounded-lg">
        
        {/* Header */}
        <div className="flex items-center gap-3">
         
          <h1 className="text-xl font-bold text-black text-center">Add funds</h1>
        </div>

        {/* Instructions */}
        <div className="text-gray-600 text-base">
          Copy the bank details below and transfer funds to your balance.
        </div>

        {/* Bank Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-black mb-4">Bank Details</h2>
          
          <div className="space-y-3">
            <div className="text-gray-900 text-base">
              {bankDetails.name}
            </div>
            <div className="text-gray-900 text-base">
              {bankDetails.accountNumber}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-900 text-base">
                {bankDetails.routingNumber}
              </div>
              <button 
                onClick={handleCopy}
                className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Done Button */}
        <div className="mt-auto pt-6">
          <button 
            className="w-full bg-blue-600 text-white py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
            onClick={() => window.history.back()}
          >
            Done
          </button>
        </div>
        
      </Content>
    </main>
  );
}