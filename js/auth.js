/* ============================================
   AUTHENTICATION MODULE
   Handles login, register, logout, session.
   ============================================ */

const Auth = (function () {
  const USER_KEY = 'freshmart_user';

  // ---------- SESSION ----------
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch { return null; }
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  function setCurrentUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    updateAuthUI();
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    updateAuthUI();
    window.location.href = 'index.html';
  }

  // ---------- REGISTER ----------
  async function register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (typeof API === 'undefined') throw new Error('Database API is not loaded');
    const user = await API.register({ name, email, password });
    setCurrentUser(user);
    return user;
  }

  // ---------- LOGIN ----------
  async function login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (typeof API === 'undefined') throw new Error('Database API is not loaded');
    const user = await API.login({ email, password });
    setCurrentUser(user);
    return user;
  }

  // ---------- UI UPDATE ----------
  function updateAuthUI() {
    const user = getCurrentUser();
    const accountLinks = document.querySelectorAll('[data-auth-link]');
    accountLinks.forEach(el => {
      if (user) {
        el.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name.split(' ')[0]}`;
        el.href = 'account.html';
      } else {
        el.innerHTML = `<i class="fas fa-user"></i>`;
        el.href = 'login.html';
      }
    });
  }

  function isAdmin() {
    const user = getCurrentUser();
    return Boolean(user && user.role === 'admin');
  }

  async function createUser({ name, email, password, role = 'customer' }) {
    if (!isAdmin()) throw new Error('Administrator access required');
    if (!name || !email || !password) throw new Error('All fields are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (typeof API === 'undefined') throw new Error('Database API is not loaded');
    return API.requestUser({ name, email, password, role });
  }

  function updateUser(id, changes) {
    throw new Error('Use the database API to update users');
  }

  function deleteUser(id) {
    throw new Error('Use the database API to delete users');
  }

  document.addEventListener('DOMContentLoaded', updateAuthUI);

  return {
    register,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    isAdmin,
    createUser,
    updateUser,
    deleteUser,
    updateAuthUI
  };
})();