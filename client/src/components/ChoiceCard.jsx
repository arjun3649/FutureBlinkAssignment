import React from 'react';

const ChoiceCard = ({ 
  icon, 
  title, 
  description, 
  onClick,
  iconBgColor = 'bg-pink-100',
  iconTextColor = 'text-pink-500',
  containerClassName = '',
}) => {
  return (
    <div 
      className={`p-4 rounded-md border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer ${containerClassName}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-md ${iconBgColor}`}>
          <div className={`text-2xl ${iconTextColor}`}>
            {icon}
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChoiceCard;