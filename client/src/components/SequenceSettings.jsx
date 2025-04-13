import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiChevronDown } from 'react-icons/fi';

export default function SequenceSettings({ 
  workflowId, 
  nodes, 
  edges, 
  onSave, 
  onClose, 
  existingSettings,
  existingName
}) {
  const [saveStatus, setSaveStatus] = useState('idle'); 
  const [formData, setFormData] = useState({
    workflowName: '',
    launchDate: '',
    launchTime: '08:00',
    timezone: 'Asia/Calcutta',
    sendingMode: 'batch',
    addRandomDelays: true,
    delayFrom: '10',
    delayTo: '20',
    sendingHours: [
      { enabled: true, day: 'Monday', from: '09:00', till: '17:00', sendsPerDay: '24-48' },
      { enabled: true, day: 'Tuesday', from: '09:00', till: '17:00', sendsPerDay: '24-48' },
      { enabled: true, day: 'Wednesday', from: '09:00', till: '17:00', sendsPerDay: '24-48' },
      { enabled: false, day: 'Thursday', from: '09:00', till: '17:00', sendsPerDay: '24-48' },
      { enabled: false, day: 'Friday', from: '09:00', till: '17:00', sendsPerDay: '24-48' },
      { enabled: false, day: 'Saturday', from: '09:00', till: '17:00', sendsPerDay: '24-48' },
      { enabled: false, day: 'Sunday', from: '09:00', till: '17:00', sendsPerDay: '24-48' },
    ]
  });

  useEffect(() => {
    if (!formData.launchDate) {
      setFormData(prev => ({ ...prev, launchDate: new Date().toISOString().substring(0, 10) }));
    }
  }, []);

  useEffect(() => {
    if (existingSettings) {
      setFormData({
        workflowName: existingName || 'My Campaign',
        launchDate: existingSettings.launchDate ? existingSettings.launchDate.substring(0, 10) : formData.launchDate,
        launchTime: existingSettings.launchTime || formData.launchTime,
        timezone: existingSettings.timezone || formData.timezone,
        sendingMode: 'batch',
        addRandomDelays: existingSettings.randomDelays?.enabled ?? formData.addRandomDelays,
        delayFrom: existingSettings.randomDelays?.fromMinutes?.toString() || formData.delayFrom,
        delayTo: existingSettings.randomDelays?.toMinutes?.toString() || formData.delayTo,
        sendingHours: existingSettings.sendingHours || formData.sendingHours
      });
    }
  }, [existingSettings, existingName]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleDelay = () => {
    setFormData(prev => ({ ...prev, addRandomDelays: !prev.addRandomDelays }));
  };

  const handleToggleDay = (index) => {
    setFormData(prev => {
      const updatedSendingHours = prev.sendingHours.map((day, idx) =>
        idx === index ? { ...day, enabled: !day.enabled } : day
      );
      return { ...prev, sendingHours: updatedSendingHours };
    });
  };

  const handleSendingHoursChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSendingHours = prev.sendingHours.map((day, idx) =>
        idx === index ? { ...day, [field]: value } : day
      );
      return { ...prev, sendingHours: updatedSendingHours };
    });
  };

  const handleSubmit = () => {
    setSaveStatus('saving');
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-2xl mx-auto my-6">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Sequence Settings</h2>
        <button className="text-gray-500 hover:text-red-500" onClick={onClose}>
          <FiX size={20} />
        </button>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="mb-6">
          <label className="text-sm font-medium">Workflow Name</label>
          <input 
            type="text" 
            name="workflowName" 
            value={formData.workflowName} 
            onChange={handleInputChange}
            placeholder="Enter a name for your campaign"
            className="border rounded py-2 px-3 w-full mt-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium">Launch Date</label>
            <input type="date" name="launchDate" value={formData.launchDate} onChange={handleInputChange}
              className="border rounded py-2 px-3 w-full"/>
          </div>
          <div>
            <label className="text-sm font-medium">Launch Time</label>
            <input type="time" name="launchTime" value={formData.launchTime} onChange={handleInputChange}
              className="border rounded py-2 px-3 w-full"/>
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <select name="timezone" value={formData.timezone} onChange={handleInputChange}
              className="border rounded py-2 px-3 w-full">
              <option value="Asia/Calcutta">Asia/Calcutta</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium">Sending Mode</label>
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-blue-600 mr-2"></div>
              <span className="text-sm font-medium">Batch (BCC)</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Emails will be sent to multiple recipients at once using BCC for efficiency.
            </p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <input type="checkbox" checked={formData.addRandomDelays} onChange={handleToggleDelay}
            className="h-4 w-4 rounded text-blue-600"/>
          <label className="ml-2 text-sm">Add Random Delays (minutes)</label>
          {formData.addRandomDelays && (
            <div className="flex gap-2 ml-4">
              <input type="number" value={formData.delayFrom} onChange={e => handleInputChange({ target: { name: 'delayFrom', value: e.target.value } })}
                className="border rounded p-1 w-16"/>
              <span>to</span>
              <input type="number" value={formData.delayTo} onChange={e => handleInputChange({ target: { name: 'delayTo', value: e.target.value } })}
                className="border rounded p-1 w-16"/>
            </div>
          )}
        </div>

        <div className="mt-6">
          {formData.sendingHours.map((day, index) => (
            <div key={day.day} className="flex items-center gap-3 mb-2">
              <input type="checkbox" checked={day.enabled} onChange={() => handleToggleDay(index)}
                className="h-4 w-4 text-blue-600"/>
              <label className="text-sm w-20">{day.day}</label>
              <input type="time" value={day.from} onChange={e => handleSendingHoursChange(index, 'from', e.target.value)}
                className="border rounded p-1 w-28"/>
              <span>to</span>
              <input type="time" value={day.till} onChange={e => handleSendingHoursChange(index, 'till', e.target.value)}
                className="border rounded p-1 w-28"/>
              <input type="text" value={day.sendsPerDay} onChange={e => handleSendingHoursChange(index, 'sendsPerDay', e.target.value)}
                className="border rounded p-1 w-24" placeholder="Emails/day"/>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleSubmit}>
          {saveStatus === 'saving' ? 'Saving...' : 'Save & Schedule'}
        </button>
      </div>
    </div>
  );
}
