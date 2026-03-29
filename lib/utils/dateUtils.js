/**
 * Calculate age from birthday
 * @param {string|Date} birthday - Birthday date
 * @param {boolean} detailed - If true, returns "X years, Y months, Z days old"
 * @returns {string} Age as formatted string
 */
export function calculateAge(birthday, detailed = false) {
  if (!birthday) return "N/A";

  const birthDate = new Date(birthday);
  const today = new Date();

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();
  let ageDays = today.getDate() - birthDate.getDate();

  if (ageDays < 0) {
    ageMonths--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    ageDays += lastMonth.getDate();
  }

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  if (detailed) {
    return `${ageYears} years, ${ageMonths} months, ${ageDays} days old`;
  }

  if (ageYears === 0) {
    if (ageMonths === 0) {
      return `${ageDays} days old`;
    }
    return `${ageMonths} months old`;
  }

  return `${ageYears} years old`;
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return "N/A";

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    ...options,
  };

  return new Date(date).toLocaleDateString("en-US", defaultOptions);
}

/**
 * Get start and end of day for a given date
 * @param {string|Date} date
 * @returns {{ start: Date, end: Date }}
 */
export function getDayBounds(date) {
  const d = new Date(date);
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}
