import React from 'react';
import brainImg from '../../assets/neuron-modefied.png'; // Update with your actual image path

export const QuoteBox = () => (
  <div className="relative flex items-center bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-500 rounded-2xl shadow-lg px-8 py-6 h-44 w-full max-w-xl mx-auto overflow-visible">
    {/* Quote Section */}
    <div className="flex-1 z-10">
      <span className="block text-white text-xl sm:text-2xl font-bold leading-snug">
        “Reviewing isn’t repeating—it’s reinforcing.”
      </span>
      <span className="block text-blue-100 text-base mt-3 font-medium">
        — Memory Zone
      </span>
    </div>
    {/* Mascot Image */}
    <img
      src={brainImg}
      alt="Brain mascot"
      className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-40 sm:w-48 rotate-[10deg] drop-shadow-xl"
      style={{ background: 'transparent' }}
    />
  </div>
);