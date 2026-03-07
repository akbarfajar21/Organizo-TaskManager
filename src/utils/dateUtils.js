// src/utils/dateUtils.js

export const getLocalToday = () => {
  const date = new Date();
  // Adjust for local timezone offset
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

export const getLocalYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

// Also useful for other dynamic days if needed
export const getLocalDateString = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};
