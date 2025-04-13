import React, { useState } from 'react';
import { useApiMutation } from '../hooks/useApiMutation';
import { BASE_URL } from '../../../server/utils/BaseUrl';

const LeadsForm = ({ onClose }) => {
  const [name, setName] = useState('');
  const [emails, setEmails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailCount, setEmailCount] = useState(0);

  const { mutate: createLeadSource } = useApiMutation({
    url:` ${BASE_URL}/api/lead-sources`,
    queryKey: ['leadSources'],
  });

  const handleEmailChange = (e) => {
    const newEmails = e.target.value;
    setEmails(newEmails);
    
    if (newEmails.trim()) {
      const emailArray = newEmails.split(/[\n,]+/).map(e => e.trim()).filter(e => e && isValidEmail(e));
      setEmailCount(emailArray.length);
    } else {
      setEmailCount(0);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter a list name');
      return;
    }

    if (!emails.trim()) {
      setError('Please add at least one email');
      return;
    }

    const emailArray = emails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);
    
    const invalidEmails = emailArray.filter(email => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      setError(`Found ${invalidEmails.length} invalid email${invalidEmails.length > 1 ? 's' : ''}. Please check your list.`);
      return;
    }

    setIsSubmitting(true);

    createLeadSource({ name, body: emailArray.join(',') }, {
      onSuccess: () => {
        console.log('Lead Source Created');
        setIsSubmitting(false);
        onClose();
      },
      onError: (err) => {
        console.error('Failed:', err);
        setError('Failed to create lead source. Please try again.');
        setIsSubmitting(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4 p-6 max-w-md w-full bg-white rounded-lg shadow-md">
      <button 
        type="button"
        onClick={onClose} 
        className="absolute top-3 right-3 text-xl text-gray-500 hover:text-red-500"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold text-gray-800">Create Lead List</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">List Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter a name for this list"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
          Emails
          {emailCount > 0 && (
            <span className="ml-2 text-green-600 text-xs font-semibold">
              {emailCount} valid email{emailCount !== 1 ? 's' : ''} detected
            </span>
          )}
        </label>
        <textarea
          id="emails"
          placeholder="Add multiple emails by:
- Separating with commas: email1@domain.com, email2@domain.com
- Placing each on a new line
- Copy-pasting from spreadsheet"
          value={emails}
          onChange={handleEmailChange}
          rows={8}
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
        />
        
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className={`w-full px-4 py-2 rounded font-medium ${
          isSubmitting 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-colors`}
      >
        {isSubmitting ? 'Creating...' : 'Create Lead List'}
      </button>
    </form>
  );
};

export default LeadsForm;
