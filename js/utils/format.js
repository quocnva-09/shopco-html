/**
 * Formats a number to USD currency format
 * @param {number} amount 
 * @returns {string} Formatted string, e.g., "$150,000"
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};
