import React from 'react';
import { FaBolt, FaChartLine, FaUserFriends, FaUsers } from 'react-icons/fa';
import ChoiceCard from './ChoiceCard';

const LeadsChoiceCard = ({ onClose, onSelect }) => {
  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-150 overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Add a Source Block <span className="text-gray-400 ml-2">ⓘ</span>
            </h2>
            <p className="text-gray-600 mt-1">
              Pick a block & configure, any new leads that match rules will be added to sequence automatically.
            </p>
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
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Sources</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChoiceCard
              icon={<FaUsers />}
              title="Leads from List(s)"
              description="Connect multiple lists as source for this sequence."
              onClick={onSelect?.lists}
            />

            <ChoiceCard
              icon={<FaChartLine />}
              title="Segment by Events"
              description="Create a segment of leads who have engaged with emails previously."
              onClick={onSelect?.events}
            />

            <ChoiceCard
              icon={<FaUserFriends />}
              title="Segment of List"
              description="Create a segment of leads which match SalesBlink Variables."
              onClick={onSelect?.segment}
            />

            <ChoiceCard
              icon={<FaBolt />}
              title="Lead from CRM Integration"
              description="Pulls leads from your CRM integrations."
              onClick={onSelect?.crm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsChoiceCard;
