export const getFormattedDate = (dateValue: any): string => {
  if (!dateValue) return "";

  try {
    // If it's already a Date object
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split("T")[0]; // Returns YYYY-MM-DD
    }

    // If it's a string or timestamp, convert to Date
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  } catch (error) {
    console.error("Error formatting date:", error);
  }

  return "";
};
