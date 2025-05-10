export function getLightModeColor(color: string) {
  return color.replace('-700', '-200');
}

export function getDarkModeColor(color: string) {
  return `dark:${color}`;
}

export function getColorName(color: string) {
  return color.replace('-700', '').replace('bg-', '');
}

export const formatDate = (inputString: Date) => {
  const dateObj = new Date(inputString);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  // Format the day with appropriate suffix (e.g., 1st, 2nd, 3rd, 4th, etc.)
  const dayWithSuffix = getDayWithSuffix(day);
  // Get the month name from the month index
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = monthNames[monthIndex];
  // Format the time in 12-hour clock format with AM/PM
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${dayWithSuffix} ${monthName} ${year}, ${formattedHours}:${formattedMinutes} ${amOrPm}`;
};

export const secondFormatDate = (inputString: Date) => {
  const dateObj = new Date(inputString);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  // Format the day with appropriate suffix (e.g., 1st, 2nd, 3rd, 4th, etc.)
  const dayWithSuffix = getDayWithSuffix(day);
  // Get the month name from the month index
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthName = monthNames[monthIndex];
  // Format the time in 12-hour clock format with AM/PM
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${dayWithSuffix} ${monthName}, ${formattedHours}:${formattedMinutes} ${amOrPm}`;
};

export const getDayWithSuffix = (day: number) => {
  if (day >= 11 && day <= 13) {
    return day + 'th';
  }
  switch (day % 10) {
    case 1:
      return day + 'st';
    case 2:
      return day + 'nd';
    case 3:
      return day + 'rd';
    default:
      return day + 'th';
  }
};
