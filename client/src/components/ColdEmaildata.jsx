import React, { useState } from 'react';
import SourceSubmitCard from './SourceSubmitCard';

const ColdEmaildata = ({
  onClose,
  onInsertTemplate,
  emailTemplates,
  onButtonClick,
  buttonText,
  editEmail,
}) => {

  const [selectedValue, setSelectedValue] = useState(
    editEmail?.data?.emailTemplateId 
      ? emailTemplates.find(t => t._id === editEmail.data.emailTemplateId)?.name || ''
      : ''
  );

  // Email Type is for usage purpose only → Not saving in EmailTemplate DB
  const [emailType, setEmailType] = useState('Normal');

  const handleInsertClick = () => {
    const selectedTemplate = emailTemplates.find(
      (template) => template.name === selectedValue
    );

    if (!selectedTemplate) return;

    onInsertTemplate({
      ...selectedTemplate,
      emailType,  // Only for this node/sequence use
    });

    onClose();
  };

  const options = emailTemplates.map((template) => ({
    id: template._id,
    name: template.name,
  }));

  return (
    <SourceSubmitCard
      title="Select Email Template"
      description="Choose your email template for this sequence."
      label="Select Template"
      buttonText={buttonText}
      onButtonClick={onButtonClick}
      inputPlaceholder="Search for template"
      onClose={onClose}
      options={options}
      selectedValue={selectedValue}
      onSelectChange={setSelectedValue}
      onInsertClick={handleInsertClick}
    >
      <div className="p-4">
        <label className="block text-sm font-semibold mb-2">
          Email Type
        </label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value={emailType}
          onChange={(e) => setEmailType(e.target.value)}
        >
          <option value="Normal">Normal</option>
          <option value="Follow Up">Follow Up</option>
        </select>
      </div>
    </SourceSubmitCard>
  );
};

export default ColdEmaildata;
