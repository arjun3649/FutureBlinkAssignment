import React, { useState } from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SequenceComponent = ({ defaultValues = {}, onSubmit ,handleSequenceClose }) => {
  const [launchDate, setLaunchDate] = useState(defaultValues.launchDate || '');
  const [launchTime, setLaunchTime] = useState(defaultValues.launchTime || '');
  const [timezone, setTimezone] = useState(defaultValues.timezone || 'Asia/Calcutta');
  const [randomDelay, setRandomDelay] = useState(defaultValues.randomDelay || { from: 10, to: 20 });
  const [sendingSchedule, setSendingSchedule] = useState(
    defaultValues.sendingSchedule || weekdays.map(day => ({
      day,
      enabled: ['Monday', 'Tuesday', 'Wednesday'].includes(day),
      from: '09:00 AM',
      to: '05:00 PM',
      emailsPerDay: '24 - 48',
    }))
  );

  const handleScheduleChange = (index, key, value) => {
    const updated = [...sendingSchedule];
    updated[index][key] = value;
    setSendingSchedule(updated);
  };

  const handleSubmit = () => {
    onSubmit?.({
      launchDate,
      launchTime,
      timezone,
      randomDelay,
      sendingSchedule,
    });
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sequence Settings</h2>
        <button className="text-red-500 hover:text-red-700" onClick={handleSequenceClose}>
          <FaTimes size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Launch on - Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={launchDate}
            onChange={e => setLaunchDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            className="w-full border px-3 py-2 rounded"
            value={launchTime}
            onChange={e => setLaunchTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timezone</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
          >
            <option value="Asia/Calcutta">Asia/Calcutta</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Random Delays</label>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">Helps avoid spam detection</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm">From</span>
          <input
            type="number"
            min="1"
            max="59"
            value={randomDelay.from}
            onChange={e => setRandomDelay({...randomDelay, from: parseInt(e.target.value)})}
            className="w-16 border rounded px-3 py-2"
          />
          <span className="text-sm">to</span>
          <input
            type="number"
            min="1"
            max="59"
            value={randomDelay.to}
            onChange={e => setRandomDelay({...randomDelay, to: parseInt(e.target.value)})}
            className="w-16 border rounded px-3 py-2"
          />
          <span className="text-sm">minutes</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Sending Schedule</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 grid grid-cols-4 gap-2">
            <div className="text-xs font-semibold">Day</div>
            <div className="text-xs font-semibold">From</div>
            <div className="text-xs font-semibold">Till</div>
            <div className="text-xs font-semibold">Emails/day</div>
          </div>
          <div className="divide-y">
            {sendingSchedule.map((day, index) => (
              <div key={day.day} className="px-4 py-2 grid grid-cols-4 gap-2 items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => handleScheduleChange(index, 'enabled', !day.enabled)}
                    className="mr-2"
                  />
                  <span className="text-sm">{day.day}</span>
                </div>
                <input
                  type="time"
                  value={day.from}
                  onChange={e => handleScheduleChange(index, 'from', e.target.value)}
                  className="border rounded p-1 text-sm w-full"
                  disabled={!day.enabled}
                />
                <input
                  type="time"
                  value={day.to}
                  onChange={e => handleScheduleChange(index, 'to', e.target.value)}
                  className="border rounded p-1 text-sm w-full"
                  disabled={!day.enabled}
                />
                <input
                  type="text"
                  value={day.emailsPerDay}
                  onChange={e => handleScheduleChange(index, 'emailsPerDay', e.target.value)}
                  placeholder="20-40"
                  className="border rounded p-1 text-sm w-full"
                  disabled={!day.enabled}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Save Settings & Schedule
      </button>
    </div>
  );
};

export default SequenceComponent;
