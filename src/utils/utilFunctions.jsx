

export const formatDate = (date) => {
    if (!date) return "N/A";
    const newDate = new Date(date);

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        hourCycle: 'h12',
        timeZoneName: undefined
    };

    return newDate.toLocaleString('en-GB', options);
}




export const capitalizeFirstLetter = str => 
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";






export const getStartEndDate = (filter) => {
  const today = new Date();
  let startDate, endDate;

  switch (filter) {
    case "today":
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date();
      break;
    case "thisWeek":
      // Create a copy of today to avoid modifying original
      let thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      startDate = thisWeekStart;

      // Set end date to Saturday of current week
      let thisWeekEnd = new Date(today);
      thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
      endDate = thisWeekEnd;
      break;

    case "lastWeek":
      // Create a copy of today for last week's start
      let lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7); // Start of last week (Sunday)
      startDate = lastWeekStart;

      // Set end date to Saturday of last week
      let lastWeekEnd = new Date(today);
      lastWeekEnd.setDate(today.getDate() - today.getDay() - 1); // Saturday of last week
      endDate = lastWeekEnd;
      break;
    case "thisMonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "lastMonth":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "thisYear":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
    case "lastYear":
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
    default:
      return { startDate: null, endDate: null }; // "All Time" option
  }

  startDate = startDate.toISOString()
  endDate = endDate.toISOString()
  return { startDate, endDate };
};