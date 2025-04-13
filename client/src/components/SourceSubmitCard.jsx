import React, { useState } from 'react';

const SourceSubmitCard = ({
  title,
  description,
  label,
  buttonText,
  inputPlaceholder,
  onButtonClick,
  onClose,
  options = [],
  selectedValue,
  onSelectChange,
  onSearchChange,
  onInsertClick,
  children,
}) => {
  const [search, setSearch] = useState('');
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {title}
            </h2>
            <p className="text-gray-600 mt-1 text-sm">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            {buttonText && (
              <button
                onClick={onButtonClick}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
              >
                <span>{buttonText}</span>
                <span className="text-lg leading-none">＋</span>
              </button>
            )}
          </div>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={inputPlaceholder || "Search..."}
              value={search}
              onChange={handleSearchChange}
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* List of options */}
          {options.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded divide-y">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 cursor-pointer ${
                    selectedValue === option.name
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectChange?.(option.name)}
                >
                  <div className="font-medium text-gray-800">{option.name}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              {search ? "No results found" : "No options available"}
            </div>
          )}

          {children}

          <button
            onClick={onInsertClick}
            disabled={!selectedValue}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceSubmitCard;
