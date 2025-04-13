export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const isWithinSendingHours = (sendingHours) => {
  if (!sendingHours || !Array.isArray(sendingHours) || sendingHours.length === 0) {
    // If no sending hours defined, assume it's always within sending hours
    return true;
  }

  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const time = now.getHours() * 60 + now.getMinutes();

  const todaysSetting = sendingHours.find(d => d.day === day && d.enabled);

  if (!todaysSetting) return false;

  let from, till;
  try {
    from = convertToMinutes(todaysSetting.fromTime || todaysSetting.from);
    till = convertToMinutes(todaysSetting.toTime || todaysSetting.till || todaysSetting.to);
  } catch (error) {
    console.error('Error parsing sending hours:', error);
    return false;
  }

  return time >= from && time <= till;
};

export const convertToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') {
    return 0;
  }

  try {
    // Handle various time formats
    let hour, minutes, isPM;
    
    if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
      // Handle 12-hour format with AM/PM
      const [time, modifier] = timeStr.split(/\s+/);
      const [hourStr, minStr] = time.split(':');
      
      hour = parseInt(hourStr, 10) % 12;
      minutes = parseInt(minStr, 10);
      isPM = modifier.toLowerCase() === 'pm';
      
      if (isPM) hour += 12;
    } else {
      // Handle 24-hour format
      const [hourStr, minStr] = timeStr.split(':');
      hour = parseInt(hourStr, 10);
      minutes = parseInt(minStr, 10);
    }
    
    // Check for valid values
    if (isNaN(hour) || isNaN(minutes) || hour < 0 || hour > 23 || minutes < 0 || minutes > 59) {
      console.warn(`Invalid time format: ${timeStr}, defaulting to 0`);
      return 0;
    }
    
    return hour * 60 + minutes;
  } catch (error) {
    console.error(`Error converting time string '${timeStr}' to minutes:`, error);
    return 0;
  }
};

export const applyRandomDelay = (fromMinutes, toMinutes) => {
  // Ensure valid inputs
  const from = Math.max(0, parseInt(fromMinutes, 10) || 1);
  const to = Math.max(from, parseInt(toMinutes, 10) || from + 1);
  
  const randomMinutes = Math.floor(Math.random() * (to - from + 1)) + from;
  return randomMinutes * 60 * 1000;
};

export const convertTo24Hr = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') {
    console.warn('Invalid time string provided, using default 00:00:00');
    return '00:00:00';
  }

  try {
    // Check if already in 24-hour format (no AM/PM)
    if (!timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
      // Ensure it has seconds
      const parts = timeStr.split(':');
      if (parts.length === 2) {
        return `${parts[0]}:${parts[1]}:00`;
      } else if (parts.length === 3) {
        return timeStr;
      } else {
        throw new Error(`Invalid time format: ${timeStr}`);
      }
    }

    // Parse 12-hour format with AM/PM
    const [timePart, modifier] = timeStr.split(/\s+/);
    let [hours, minutes] = timePart.split(':');
    
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid time values in: ${timeStr}`);
    }

    if (modifier.toLowerCase() === 'pm' && hours !== 12) {
      hours = hours + 12;
    }

    if (modifier.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    // Format with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:00`;
  } catch (error) {
    console.error(`Error converting time '${timeStr}' to 24-hour format:`, error);
    return '00:00:00'; // Default to midnight
  }
};
