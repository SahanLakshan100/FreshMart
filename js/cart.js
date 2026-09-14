/* ============================================
   CART MANAGEMENT (localStorage-based)
   ============================================ */

const CartManager = (function () {
  const STORAGE_KEY = 'freshmart_cart';
  const SESSION_KEY = 'freshmart_cart_session';

  function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = typeof crypto?.randomUUID === 'function'
        ? crypto.randomUUID()
        : `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    if (typeof API !== 'undefined') {
      const user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
      API.saveCart(getSessionId(), cart, user?.id || null).catch(error => console.error('Could not save cart to database', error));
    }
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

  async function loadCartFromDatabase() {
    if (typeof API === 'undefined') return;
    try {
      const result = await API.getCart(getSessionId());
      const items = JSON.parse(result.items || '[]');
      if (Array.isArray(items)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        updateCartBadge();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }));
      }
    } catch (error) {
      console.error('Could not load cart from database', error);
    }
  }

  return {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotals,
    updateCartBadge,
    loadCartFromDatabase
  };
})();

// Auto-update badge on page load
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCartBadge();
  CartManager.loadCartFromDatabase();
});