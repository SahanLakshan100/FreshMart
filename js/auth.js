/* ============================================
   AUTHENTICATION MODULE
   Handles login, register, logout, session.
   ============================================ */

const Auth = (function () {
  const USER_KEY = 'freshmart_user';
  const USERS_KEY = 'freshmart_users';

  // ---------- STORAGE HELPERS ----------
  function getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      if (!users.some(user => user.role === 'admin')) {
        users.push({
          id: 'u_admin',
          name: 'FreshMart Admin',
          email: 'admin@freshmart.lk',
          password: btoa('admin123'),
          role: 'admin',
          createdAt: new Date().toISOString()
        });
        saveUsers(users);
      }
      return users;
    } catch { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

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

    const users = getUsers();
    if (users.some(user => user.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists');
    }

    users.push({
      id: 'u_' + Date.now().toString(36),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: btoa(password),
      role: role === 'admin' ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }

  function updateUser(id, changes) {
    if (!isAdmin()) throw new Error('Administrator access required');
    const users = getUsers();
    const user = users.find(item => item.id === id);
    if (!user) throw new Error('User not found');
    if (user.id === getCurrentUser().id && changes.role !== 'admin') {
      throw new Error('You cannot remove your own administrator access');
    }
    if (changes.email && users.some(item => item.id !== id && item.email === changes.email.toLowerCase().trim())) {
      throw new Error('An account with this email already exists');
    }
    user.name = changes.name.trim();
    user.email = changes.email.toLowerCase().trim();
    user.role = changes.role === 'admin' ? 'admin' : 'customer';
    if (changes.password) user.password = btoa(changes.password);
    saveUsers(users);
  }

  function deleteUser(id) {
    if (!isAdmin()) throw new Error('Administrator access required');
    if (id === getCurrentUser().id) throw new Error('You cannot delete your own account');
    saveUsers(getUsers().filter(user => user.id !== id));
  }

  document.addEventListener('DOMContentLoaded', updateAuthUI);

  return {
    register,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    isAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    updateAuthUI
  };
})();