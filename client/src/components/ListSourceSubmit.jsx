import React, { useState } from 'react';
import SourceSubmitCard from './SourceSubmitCard';

const ListSubmitCard = ({ onClose, onInsertLead, leadSources, onButtonClick, buttonText }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleInsertClick = () => {
    const selectedLead = leadSources.find((lead) => lead.name === selectedValue);
    if (selectedLead) {
      onInsertLead(selectedLead);
      onClose();
    }
  };

  // Get email count for selected lead source
  const getSelectedLeadEmailCount = () => {
    const selectedLead = leadSources.find((lead) => lead.name === selectedValue);
    if (!selectedLead) return 0;
    
    // Count emails in the body field
    return selectedLead.body 
      ? selectedLead.body.split(',').filter(email => email.trim()).length 
      : selectedLead.emailCount || 0;
  };

  // Filter and format options to include email counts
  const options = leadSources
    .filter(lead => !searchTerm || lead.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((lead) => {
      // Calculate email count if not already provided
      const emailCount = lead.emailCount || 
        (lead.body ? lead.body.split(',').filter(email => email.trim()).length : 0);
      
      return {
        id: lead._id,
        name: lead.name,
        description: `${emailCount} email${emailCount !== 1 ? 's' : ''}`
      };
    });

  return (
    <SourceSubmitCard
      title="Leads from List"
      description="Choose a list of leads for this sequence"
      label="Select a Lead List"
      buttonText={buttonText || "Create New List"}
      onButtonClick={onButtonClick}
      inputPlaceholder="Search for lists"
      onClose={onClose}
      options={options}
      selectedValue={selectedValue}
      onSelectChange={setSelectedValue}
      onSearchChange={setSearchTerm}
      onInsertClick={handleInsertClick}
    >
      {selectedValue && (
        <div className="mt-2 text-sm text-blue-600 font-medium">
          This list contains {getSelectedLeadEmailCount()} email{getSelectedLeadEmailCount() !== 1 ? 's' : ''}
        </div>
      )}
    </SourceSubmitCard>
  );
};

export default ListSubmitCard;
