/**
 * Validation utility functions
 */

/**
 * Check if a string is empty or only whitespace
 * @param {string} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  return !value || value.trim().length === 0;
}

/**
 * Validate required fields in an object
 * @param {object} data - Data to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRequired(data, requiredFields) {
  const missing = requiredFields.filter(
    (field) => isEmpty(data?.[field])
  );
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validate MongoDB ObjectId
 * @param {string} id
 * @returns {boolean}
 */
export function isValidObjectId(id) {
  if (!id) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Parse and validate integer
 * @param {string|number} value
 * @param {number} defaultValue
 * @returns {number}
 */
export function parseIntOrDefault(value, defaultValue = 0) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get request metadata (IP, user agent)
 * @param {Request} request
 * @returns {{ ipAddress: string, userAgent: string }}
 */
export function getRequestMetadata(request) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.ip ||
      "unknown",
    userAgent: request.headers.get("user-agent") || "",
  };
}
