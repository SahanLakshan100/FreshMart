/* ============================================
   CART MANAGEMENT (localStorage-based)
   ============================================ */

const CartManager = (function () {
  const STORAGE_KEY = 'freshmart_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
    // Dispatch event so pages can react
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  }

  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
  }

  function updateQuantity(productId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return cart;
    item.quantity += delta;
    if (item.quantity <= 0) {
      return removeFromCart(productId);
    }
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getTotals() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal > 7500 ? 0 : (subtotal > 0 ? 450 : 0);
    const total = subtotal + delivery;
    return { totalItems, subtotal, delivery, total };
  }

  function updateCartBadge() {
    const badge = document.getElementById('headerCartCount');
    if (badge) {
      const { totalItems } = getTotals();
      badge.textContent = totalItems;
    }
  }

  return {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotals,
    updateCartBadge
  };
})();

// Auto-update badge on page load
document.addEventListener('DOMContentLoaded', CartManager.updateCartBadge);