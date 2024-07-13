import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="relative flex items-center justify-center h-screen bg-cover bg-center">
      <div className="absolute inset-0 bg-white opacity-50"></div>
      <div className="relative z-10 text-center text-black p-5">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Oops! The page you are looking for doesn't exist.</p>
        <Link to="/">
          <button className="px-6 py-3 bg-gray-800 text-white text-lg rounded-full hover:bg-gray-900 transition duration-300">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}
