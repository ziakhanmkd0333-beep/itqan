/**
 * Convert a string to URL-friendly slug
 * @param {string} str - The string to slugify
 * @returns {string} - The slugified string
 */
function slugify(str) {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

module.exports = slugify;
