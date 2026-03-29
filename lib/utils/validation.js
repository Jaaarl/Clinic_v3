/**
 * Validation utility functions
 */

export function isEmpty(value) {
  return !value || value.trim().length === 0;
}

export function validateRequired(data, requiredFields) {
  const missing = requiredFields.filter((field) => isEmpty(data?.[field]));
  return { valid: missing.length === 0, missing };
}

export function isValidObjectId(id) {
  if (!id) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function parseIntOrDefault(value, defaultValue = 0) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

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
