/* ============================================
   PRODUCT & CATEGORY DATA
   ============================================ */

const products = [];

const categories = [];

function formatPrice(value) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0
  }).format(value);
}