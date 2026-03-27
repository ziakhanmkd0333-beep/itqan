/**
 * Generate a secure random token
 * @param {number} length - Length of the token
 * @returns {string} - Random token
 */
function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @param {string} format - Format string
 * @returns {string} - Formatted date
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Sanitize HTML content
 * @param {string} html - HTML string
 * @returns {string} - Sanitized HTML
 */
function sanitizeHtml(html) {
  if (!html) return '';
  
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Paginate array
 * @param {Array} items - Array to paginate
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} - Paginated result
 */
function paginate(items, page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      total: items.length,
      page,
      pages: Math.ceil(items.length / limit),
      limit
    }
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format currency
 * @param {number} amount - Amount
 * @param {string} currency - Currency code
 * @returns {string} - Formatted currency
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

module.exports = {
  generateToken,
  formatDate,
  sanitizeHtml,
  paginate,
  isValidEmail,
  formatCurrency
};
