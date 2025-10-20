import React from 'react';

const Spinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-3 text-gray-600">{text}</p>
    </div>
  );
};

export default Spinner;