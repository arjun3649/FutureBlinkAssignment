import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const WaitTimeSelect = ({ onClose, onUpdate }) => {
  const [waitFor, setWaitFor] = useState('0');
  const [waitType, setWaitType] = useState('Days');

    const handleUpdate = () => {
        if (waitFor && waitType) {
            onUpdate( waitFor, waitType);
            onClose();
            
      } 
    
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
      >
        <FaTimes size={18} />
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-1">Edit Wait</h2>
      <p className="text-sm text-gray-500 mb-6">Add a delay between blocks.</p>

      {/* Wait For */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Wait For</label>
        <input
          type="number"
          value={waitFor}
          onChange={(e) => setWaitFor(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Wait Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Wait Type</label>
        <select
          value={waitType}
          onChange={(e) => setWaitType(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Days">Days</option>
          <option value="Hours">Hours</option>
          <option value="Minutes">Minutes</option>
        </select>
      </div>

      {/* Update Button */}
      <div className="text-right">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default WaitTimeSelect;

