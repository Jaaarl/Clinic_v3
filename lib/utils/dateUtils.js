/**
 * Calculate age from birthday
 * @param {string|Date} birthday - Birthday date
 * @returns {string} Age as formatted string (e.g., "25 years old", "6 months old", "15 days old")
 */
export function calculateAge(birthday) {
  if (!birthday) return "N/A";

  const birthDate = new Date(birthday);
  const today = new Date();

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  if (
    ageMonths < 0 ||
    (ageMonths === 0 && today.getDate() < birthDate.getDate())
  ) {
    ageYears--;
    ageMonths += 12;
  }

  if (ageYears === 0) {
    ageMonths = today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) {
      ageMonths--;
    }

    if (ageMonths === 0) {
      const ageDays = Math.floor(
        (today - birthDate) / (1000 * 60 * 60 * 24)
      );
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
