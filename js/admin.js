/* ============================================
   ADMIN PANEL
   Browser-only management for the demo catalog.
   ============================================ */

(function () {
  const sectionEl = document.getElementById('adminSection');
  const noticeEl = document.getElementById('adminNotice');
  const statsEl = document.getElementById('adminStats');
  let activeSection = 'products';
  let editingProductId = null;
  let editingCategoryId = null;
  let editingUserId = null;
  let remoteUsers = [];
  const API_BASE = 'http://localhost:5050/api';

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    if (!response.ok) throw new Error(await response.text() || `Request failed (${response.status})`);
    return response.status === 204 ? null : response.json();
  }

  async function loadDatabase() {
    const [databaseCategories, databaseProducts, databaseUsers] = await Promise.all([
      request('/categories'), request('/products'), request('/users')
    ]);
    categories.splice(0, categories.length, ...databaseCategories.map(category => ({ ...category, id: category.slug, dbId: category.id, items: [] })));
    products.splice(0, products.length, ...databaseProducts.map(product => ({
      ...product,
      category: product.category?.slug || product.category,
      categoryDbId: product.categoryId,
      unit: product.unit,
      fallbackImage: product.image
    })));
    remoteUsers = databaseUsers;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
  }

  function showNotice(message, type = 'success') {
    noticeEl.textContent = message;
    noticeEl.className = `admin-notice ${type}`;
    window.clearTimeout(showNotice.timeout);
    showNotice.timeout = window.setTimeout(() => {
      noticeEl.textContent = '';
      noticeEl.className = 'admin-notice';
    }, 3500);
  }

  function updateStats() {
    statsEl.innerHTML = `
      <div><strong>${products.length}</strong><span>Products</span></div>
      <div><strong>${categories.filter(category => category.id !== 'all').length}</strong><span>Categories</span></div>
      <div><strong>${remoteUsers.length}</strong><span>Users</span></div>
    `;
  }

  function categoryOptions(selected = '') {
    return categories.filter(category => category.id !== 'all').map(category => `
      <option value="${escapeHtml(category.id)}" ${category.id === selected ? 'selected' : ''}>${escapeHtml(category.label)}</option>
    `).join('');
  }

  function renderProducts() {
    const product = products.find(item => item.id === editingProductId);
    sectionEl.innerHTML = `
      <div class="admin-section-heading">
        <div><p class="admin-eyebrow">CATALOG</p><h2>Products</h2></div>
        <button class="admin-primary" id="newProductBtn"><i class="fas fa-plus"></i> New product</button>
      </div>
      <div class="admin-layout">
        <form class="admin-form admin-editor ${product ? 'is-editing' : ''}" id="productForm">
          <h3>${product ? 'Edit product' : 'Add product'}</h3>
          <input type="hidden" id="productId" value="${product ? product.id : ''}">
          <label>Product name<input id="productName" required value="${product ? escapeHtml(product.name) : ''}" placeholder="e.g. Fresh Mangoes"></label>
          <div class="admin-form-grid">
            <label>Price (LKR)<input id="productPrice" type="number" min="0" step="1" required value="${product ? product.price : ''}"></label>
            <label>Unit<input id="productUnit" required value="${product ? escapeHtml(product.unit || 'each') : 'each'}" placeholder="1 kg"></label>
          </div>
          <label>Category<select id="productCategory" required><option value="">Choose a category</option>${categoryOptions(product ? product.category : '')}</select></label>
          <label>Image URL<input id="productImage" type="url" required value="${product ? escapeHtml(product.image) : ''}" placeholder="https://..."></label>
          <label class="admin-check"><input id="productFeatured" type="checkbox" ${product && product.featured ? 'checked' : ''}> Show as featured product</label>
          <div class="admin-form-actions"><button type="submit" class="admin-primary"><i class="fas fa-save"></i> ${product ? 'Update product' : 'Add product'}</button>${product ? '<button type="button" class="admin-secondary" id="cancelProductBtn">Cancel</button>' : ''}</div>
        </form>
        <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th></th></tr></thead><tbody>
          ${products.map(item => `<tr><td><div class="admin-product"><img src="${escapeHtml(item.image)}" alt=""><span>${escapeHtml(item.name)}</span></div></td><td>${escapeHtml((categories.find(category => category.id === item.category) || {}).label || item.category)}</td><td>${formatPrice(item.price)}</td><td class="admin-actions"><button class="icon-action edit-product" data-id="${item.id}" title="Edit product" aria-label="Edit ${escapeHtml(item.name)}"><i class="fas fa-pen"></i></button><button class="icon-action danger delete-product" data-id="${item.id}" title="Delete product" aria-label="Delete ${escapeHtml(item.name)}"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
        </tbody></table></div>
      </div>
    `;
    document.getElementById('newProductBtn').addEventListener('click', () => { editingProductId = null; renderProducts(); });
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    document.getElementById('cancelProductBtn')?.addEventListener('click', () => { editingProductId = null; renderProducts(); });
    sectionEl.querySelectorAll('.edit-product').forEach(button => button.addEventListener('click', () => { editingProductId = Number(button.dataset.id); renderProducts(); }));
    sectionEl.querySelectorAll('.delete-product').forEach(button => button.addEventListener('click', () => deleteProduct(Number(button.dataset.id))));
  }

  async function saveProduct(event) {
    event.preventDefault();
    const id = Number(document.getElementById('productId').value);
    const record = {
      name: document.getElementById('productName').value.trim(),
      price: Number(document.getElementById('productPrice').value),
      unit: document.getElementById('productUnit').value.trim(),
      category: document.getElementById('productCategory').value,
      image: document.getElementById('productImage').value.trim(),
      featured: document.getElementById('productFeatured').checked,
      icon: '🛒'
    };
    if (!record.name || !record.category || !record.image || record.price < 0) return showNotice('Complete all product fields.', 'error');
    const category = categories.find(item => item.id === record.category);
    if (!category) return showNotice('Choose a valid category.', 'error');
    const payload = { name: record.name, price: record.price, unit: record.unit, featured: record.featured, image: record.image, categoryId: category.dbId };
    try {
      const saved = id
        ? await request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
        : await request('/products', { method: 'POST', body: JSON.stringify(payload) });
      const normalized = { ...saved, category: record.category, categoryDbId: category.dbId };
      if (id) Object.assign(products.find(product => product.id === id), normalized);
      else products.unshift(normalized);
      editingProductId = null;
      showNotice(id ? 'Product updated in SQL Server.' : 'Product added to SQL Server.');
      render();
    } catch (error) { showNotice(error.message, 'error'); }
  }

  function deleteProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product || !window.confirm(`Delete ${product.name}?`)) return;
    request(`/products/${id}`, { method: 'DELETE' }).then(() => {
      products.splice(products.indexOf(product), 1);
      showNotice('Product deleted from SQL Server.');
      render();
    }).catch(error => showNotice(error.message, 'error'));
  }

  function renderCategories() {
    const category = categories.find(item => item.id === editingCategoryId);
    sectionEl.innerHTML = `
      <div class="admin-section-heading"><div><p class="admin-eyebrow">TAXONOMY</p><h2>Categories</h2></div><button class="admin-primary" id="newCategoryBtn"><i class="fas fa-plus"></i> New category</button></div>
      <div class="admin-layout">
        <form class="admin-form admin-editor" id="categoryForm"><h3>${category ? 'Edit category' : 'Add category'}</h3><input type="hidden" id="categoryId" value="${category ? escapeHtml(category.id) : ''}"><label>Category name<input id="categoryLabel" required value="${category ? escapeHtml(category.label) : ''}" placeholder="e.g. Fresh Produce"></label><label>Category ID<input id="categorySlug" required value="${category ? escapeHtml(category.id) : ''}" placeholder="fresh-produce" ${category ? 'readonly' : ''}></label><label>Image URL<input id="categoryImage" type="url" required value="${category ? escapeHtml(category.image) : ''}" placeholder="https://..."></label><div class="admin-form-actions"><button type="submit" class="admin-primary"><i class="fas fa-save"></i> ${category ? 'Update category' : 'Add category'}</button>${category ? '<button type="button" class="admin-secondary" id="cancelCategoryBtn">Cancel</button>' : ''}</div></form>
        <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Category</th><th>Products</th><th></th></tr></thead><tbody>${categories.filter(item => item.id !== 'all').map(item => `<tr><td><div class="admin-product"><img src="${escapeHtml(item.image)}" alt=""><span>${escapeHtml(item.label)}</span></div></td><td>${products.filter(product => product.category === item.id).length}</td><td class="admin-actions"><button class="icon-action edit-category" data-id="${escapeHtml(item.id)}" title="Edit category" aria-label="Edit ${escapeHtml(item.label)}"><i class="fas fa-pen"></i></button><button class="icon-action danger delete-category" data-id="${escapeHtml(item.id)}" title="Delete category" aria-label="Delete ${escapeHtml(item.label)}"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div>
      </div>
    `;
    document.getElementById('newCategoryBtn').addEventListener('click', () => { editingCategoryId = null; renderCategories(); });
    document.getElementById('categoryForm').addEventListener('submit', saveCategory);
    document.getElementById('cancelCategoryBtn')?.addEventListener('click', () => { editingCategoryId = null; renderCategories(); });
    sectionEl.querySelectorAll('.edit-category').forEach(button => button.addEventListener('click', () => { editingCategoryId = button.dataset.id; renderCategories(); }));
    sectionEl.querySelectorAll('.delete-category').forEach(button => button.addEventListener('click', () => deleteCategory(button.dataset.id)));
  }

  function saveCategory(event) {
    event.preventDefault();
    const id = document.getElementById('categoryId').value;
    const label = document.getElementById('categoryLabel').value.trim();
    const categoryId = document.getElementById('categorySlug').value.trim().toLowerCase().replace(/\s+/g, '-');
    const image = document.getElementById('categoryImage').value.trim();
    if (!label || !categoryId || !image) return showNotice('Complete all category fields.', 'error');
    if (!id && categories.some(category => category.id === categoryId)) return showNotice('That category ID already exists.', 'error');
    const category = categories.find(item => item.id === (id || categoryId));
    const payload = { slug: categoryId, label, icon: 'fas fa-tag', image };
    request(id ? `/categories/${category.dbId}` : '/categories', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) }).then(saved => {
      const normalized = { ...saved, id: saved.slug, dbId: saved.id, items: [] };
      if (category) Object.assign(category, normalized);
      else categories.push(normalized);
      editingCategoryId = null;
      showNotice(id ? 'Category updated in SQL Server.' : 'Category added to SQL Server.');
      render();
    }).catch(error => showNotice(error.message, 'error'));
  }

  function deleteCategory(id) {
    const category = categories.find(item => item.id === id);
    if (!category) return;
    if (products.some(product => product.category === id)) return showNotice('Move or delete this category\'s products first.', 'error');
    if (!window.confirm(`Delete ${category.label}?`)) return;
    request(`/categories/${category.dbId}`, { method: 'DELETE' }).then(() => {
      categories.splice(categories.indexOf(category), 1);
      showNotice('Category deleted from SQL Server.');
      render();
    }).catch(error => showNotice(error.message, 'error'));
  }

  function renderUsers() {
    const user = remoteUsers.find(item => String(item.id) === String(editingUserId));
    sectionEl.innerHTML = `
      <div class="admin-section-heading"><div><p class="admin-eyebrow">ACCESS</p><h2>Users</h2></div><button class="admin-primary" id="newUserBtn"><i class="fas fa-plus"></i> New user</button></div>
      <div class="admin-layout"><form class="admin-form admin-editor" id="userForm"><h3>${user ? 'Edit user' : 'Create user'}</h3><input type="hidden" id="userId" value="${user ? escapeHtml(user.id) : ''}"><label>Full name<input id="userName" required value="${user ? escapeHtml(user.name) : ''}"></label><label>Email<input id="userEmail" type="email" required value="${user ? escapeHtml(user.email) : ''}"></label><label>Password<input id="userPassword" type="password" ${user ? '' : 'required'} placeholder="${user ? 'Leave blank to keep current' : 'At least 6 characters'}"></label><label>Role<select id="userRole"><option value="customer" ${!user || user.role !== 'admin' ? 'selected' : ''}>Customer</option><option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>Administrator</option></select></label><div class="admin-form-actions"><button type="submit" class="admin-primary"><i class="fas fa-save"></i> ${user ? 'Update user' : 'Create user'}</button>${user ? '<button type="button" class="admin-secondary" id="cancelUserBtn">Cancel</button>' : ''}</div></form>
      <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>User</th><th>Role</th><th>Joined</th><th></th></tr></thead><tbody>${remoteUsers.map(item => `<tr><td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.email)}</small></td><td><span class="role-badge ${item.role}">${item.role === 'admin' ? 'Administrator' : 'Customer'}</span></td><td>${new Date(item.createdAt).toLocaleDateString('en-GB')}</td><td class="admin-actions"><button class="icon-action edit-user" data-id="${escapeHtml(item.id)}" title="Edit user" aria-label="Edit ${escapeHtml(item.name)}"><i class="fas fa-pen"></i></button><button class="icon-action danger delete-user" data-id="${escapeHtml(item.id)}" title="Delete user" aria-label="Delete ${escapeHtml(item.name)}"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div></div>`;
    document.getElementById('newUserBtn').addEventListener('click', () => { editingUserId = null; renderUsers(); });
    document.getElementById('userForm').addEventListener('submit', saveUser);
    document.getElementById('cancelUserBtn')?.addEventListener('click', () => { editingUserId = null; renderUsers(); });
    sectionEl.querySelectorAll('.edit-user').forEach(button => button.addEventListener('click', () => { editingUserId = button.dataset.id; renderUsers(); }));
    sectionEl.querySelectorAll('.delete-user').forEach(button => button.addEventListener('click', () => deleteUser(button.dataset.id)));
  }

  async function saveUser(event) {
    event.preventDefault();
    const id = document.getElementById('userId').value;
    const payload = { name: document.getElementById('userName').value.trim(), email: document.getElementById('userEmail').value, password: document.getElementById('userPassword').value, role: document.getElementById('userRole').value };
    try {
      const saved = id
        ? await request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
        : await request('/users', { method: 'POST', body: JSON.stringify(payload) });
      if (id) Object.assign(remoteUsers.find(user => String(user.id) === String(id)), saved);
      else remoteUsers.push(saved);
      editingUserId = null;
      showNotice(id ? 'User updated.' : 'User created.');
      render();
    } catch (error) { showNotice(error.message, 'error'); }
  }

  function deleteUser(id) {
    const user = remoteUsers.find(item => String(item.id) === String(id));
    if (!user || !window.confirm(`Delete ${user.name}?`)) return;
    request(`/users/${id}`, { method: 'DELETE' }).then(() => {
      remoteUsers = remoteUsers.filter(item => String(item.id) !== String(id));
      showNotice('User deleted from SQL Server.');
      render();
    }).catch(error => showNotice(error.message, 'error'));
  }

  function render() {
    updateStats();
    if (activeSection === 'products') renderProducts();
    if (activeSection === 'categories') renderCategories();
    if (activeSection === 'users') renderUsers();
  }

  if (!Auth.isAdmin()) {
    window.location.href = 'login.html';
    return;
  }

  document.querySelectorAll('.admin-tab').forEach(tab => tab.addEventListener('click', () => {
    activeSection = tab.dataset.section;
    editingProductId = editingCategoryId = editingUserId = null;
    document.querySelectorAll('.admin-tab').forEach(item => item.classList.toggle('active', item === tab));
    render();
  }));
  document.getElementById('adminLogout').addEventListener('click', () => Auth.logout());
  loadDatabase().then(render).catch(error => {
    showNotice(`Database API unavailable: ${error.message}`, 'error');
    render();
  });
})();
