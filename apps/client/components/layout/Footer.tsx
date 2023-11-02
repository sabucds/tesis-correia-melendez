import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary-300 py-8  flex flex-col justify-center items-center space-y-3">
      <p className="text-lg font-semibold text-center">
        Aplicación desarrollada por Sabrina Correia y Marianna Melendez
      </p>
      <div className="flex flex-col justify-center items-center">
        <p className="font-light">
          Universidad Metropolitana, Caracas, Venezuela.
        </p>
        <p className="font-light">2024</p>
      </div>
    </footer>
  );
}
