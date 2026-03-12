/**
 * API error handling utilities.
 * Normalizes Laravel/backend error responses for consistent handling in the UI.
 */

/**
 * Parsed API error shape returned to callers.
 */

/**
 * Extract a user-friendly message and validation errors from an axios error.
 *
 */
export function parseApiError(err) {
  const status = err.response?.status ?? 0;
  const data = err.response?.data;

  let message = 'An unexpected error occurred.';
  let errors = null;

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string') {
      message = data.message;
    }
    if (status === 422 && data.errors && typeof data.errors === 'object') {
      errors = data.errors;
    }
  }

  if (status === 0 && err.message) {
    message = err.code === 'ECONNABORTED'
      ? 'Request timed out. Please try again.'
      : 'Network error. Please check your connection.';
  }

  return { status, message, errors, error: data?.error ?? null };
}

/**
 * Get first validation message for a field, or a generic message.
 */
export function getValidationMessage(parsed, field) {
  if (field && parsed.errors?.[field]?.length) {
    return parsed.errors[field][0];
  }
  return parsed.message;
}
