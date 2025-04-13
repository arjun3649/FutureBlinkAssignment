import React from 'react';
import ChoiceCard from './ChoiceCard';
import { MdEmail, MdTaskAlt } from 'react-icons/md';
import { GiSandsOfTime } from "react-icons/gi";

const ColdEmailCard = ({ onClose,onSelect }) => {
  const handleCardClick = (type) => {
    console.log(`${type} block clicked`);
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full  overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Blocks <span className="text-gray-400 text-base ml-1">ⓘ</span>
            </h2>
            <p className="text-gray-600 mt-1">Click on a block to configure and add it in sequence.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Outreach</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChoiceCard
              icon={<MdEmail />}
              title="Cold Email"
              description="Send an email to a lead."
              iconBgColor="bg-purple-100"
              iconTextColor="text-purple-500"
              onClick={onSelect?.coldemail}
            />

            <ChoiceCard
              icon={<MdTaskAlt />}
              title="Task"
              description="Schedule a manual task."
              iconBgColor="bg-purple-100"
              iconTextColor="text-purple-500"
              onClick={onSelect?.task}
            />
             <ChoiceCard
              icon={<GiSandsOfTime />}
              title="Wait"
              description="Add delay between blocks."
              iconBgColor="bg-purple-100"
              iconTextColor="text-purple-500"
              onClick={onSelect?.wait}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdEmailCard;
