/* ============================================
   SQL SERVER API CLIENT
   ============================================ */

const API = (function () {
  const BASE_URL = 'http://localhost:5050/api';

  async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    if (!response.ok) throw new Error(await response.text() || `Request failed (${response.status})`);
    return response.status === 204 ? null : response.json();
  }

  async function getCategories() {
    const list = await request('/categories');
    return list.map(category => ({ ...category, id: category.slug, dbId: category.id, items: [] }));
  }

  async function getProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    const list = await request(`/products${params.toString() ? `?${params}` : ''}`);
    let filtered = list.map(product => ({ ...product, category: product.category?.slug || product.category, categoryDbId: product.categoryId, fallbackImage: product.image }));
    if (filters.category && filters.category !== 'all') filtered = filtered.filter(product => product.category === filters.category);
    if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (filters.sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    const page = filters.page || 1;
    const perPage = filters.perPage || filtered.length || 1;
    const start = (page - 1) * perPage;
    return { products: filtered.slice(start, start + perPage), total: filtered.length, page, perPage, totalPages: Math.ceil(filtered.length / perPage) };
  }

  async function getProductById(id) {
    const product = await request(`/products/${Number(id)}`);
    return product ? { ...product, category: product.category?.slug || product.category, categoryDbId: product.category?.id, fallbackImage: product.image } : null;
  }

  async function getFeaturedProducts(limit = 8) {
    const result = await getProducts({ perPage: 1000 });
    return result.products.filter(product => product.featured).slice(0, limit);
  }

  async function getRelatedProducts(productId, limit = 4) {
    const product = await getProductById(productId);
    if (!product) return [];
    const result = await getProducts({ category: product.category, perPage: 1000 });
    return result.products.filter(item => item.id !== product.id).slice(0, limit);
  }

  async function placeOrder(orderData) { return request('/orders', { method: 'POST', body: JSON.stringify(orderData) }); }
  async function getOrders(email) { return request(`/orders?email=${encodeURIComponent(email)}`); }
  async function login(credentials) { return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); }
  async function register(details) { return request('/auth/register', { method: 'POST', body: JSON.stringify(details) }); }
  async function requestUser(details) { return request('/users', { method: 'POST', body: JSON.stringify(details) }); }
  async function getCart(sessionId) { return request(`/cart?sessionId=${encodeURIComponent(sessionId)}`); }
  async function saveCart(sessionId, items, userId = null) {
    return request('/cart', { method: 'PUT', body: JSON.stringify({ sessionId, userId, itemsJson: JSON.stringify(items) }) });
  }

  async function loadCatalog() {
    const [loadedCategories, productResult] = await Promise.all([getCategories(), getProducts({ perPage: 1000 })]);
    categories.splice(0, categories.length, { id: 'all', label: 'All Products', icon: 'fas fa-th-large', image: '', items: [] }, ...loadedCategories);
    products.splice(0, products.length, ...productResult.products);
  }

  return { getCategories, getProducts, getProductById, getFeaturedProducts, getRelatedProducts, placeOrder, getOrders, login, register, requestUser, getCart, saveCart, loadCatalog };
})();
