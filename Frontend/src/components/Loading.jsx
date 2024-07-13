import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#3498db' }}></div>
      </div>
    </div>
  );
}
