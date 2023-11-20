// LoadingModal.js
import React from 'react';

function LoadingModal() {
  return (
    <div
      className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className="bg-white border py-3 px-6 rounded-lg flex items-center flex-col">
        <div className="loader-dots block relative w-20 h-5 mt-2">
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-primary-300" />
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-primary-300" />
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-primary-300" />
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-primary-300" />
        </div>
        <div className="text-gray-500 text-xs font-medium mt-2 text-center">
          Generando soluciones...
        </div>
      </div>
    </div>
  );
}

export default LoadingModal;
