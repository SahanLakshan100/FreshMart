/* ============================================
   SEARCH PAGE LOGIC
   ============================================ */

(function () {
  const resultsEl = document.getElementById('searchResults');
  const formEl = document.getElementById('searchForm');
  const inputEl = document.getElementById('searchInput');

  function renderProductCard(product) {
    const cart = CartManager.getCart();
    const inCart = cart.some(item => item.id === product.id);
    return `
      <div class="product-card">
        <a href="product.html?id=${product.id}" style="text-decoration:none;color:inherit;">
          <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='${product.fallbackImage || product.image}'"></div>
          <div class="product-name">${product.name}</div>
          <div class="product-category">${product.unit || product.category}</div>
          <div class="product-price">${formatPrice(product.price)} <small>/${product.unit || 'each'}</small></div>
        </a>
        <button class="add-to-cart-btn ${inCart ? 'added' : ''}" data-id="${product.id}" ${inCart ? 'disabled' : ''}>
          <i class="fas ${inCart ? 'fa-check' : 'fa-plus'}"></i> ${inCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    `;
  }

  async function runSearch(query) {
    resultsEl.innerHTML = `<div class="loading-spinner">Searching...</div>`;

    const result = await API.getProducts({ search: query, perPage: 24 });
    const list = result.products;

    if (!list.length) {
      resultsEl.innerHTML = `
        <div class="empty-cart-message">
          <i class="fas fa-search"></i>
          <h3>No results for "${query}"</h3>
          <p>Try a different keyword or browse our categories.</p>
          <a href="products.html">Browse All Products</a>
        </div>`;
      return;
    }

    resultsEl.innerHTML = `
      <div class="search-results-header">
        <h2>${list.length} result${list.length !== 1 ? 's' : ''} for "${query}"</h2>
      </div>
      <div class="product-grid">${list.map(renderProductCard).join('')}</div>
    `;

    // Attach add-to-cart handlers
    resultsEl.querySelectorAll('.add-to-cart-btn:not(.added)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const product = list.find(p => p.id === id);
        if (product) {
          CartManager.addToCart(product);
          runSearch(query); // Re-render
        }
      });
    });
  }

  // Initial state
  const urlQuery = new URLSearchParams(window.location.search).get('q');
  if (urlQuery) {
    inputEl.value = urlQuery;
    runSearch(urlQuery);
  } else {
    resultsEl.innerHTML = `
      <div class="empty-cart-message">
        <i class="fas fa-search"></i>
        <h3>Start typing to search</h3>
        <p>Search for products by name or category.</p>
      </div>`;
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = inputEl.value.trim();
    if (!q) return;

    // Update URL so it's shareable
    history.pushState({}, '', `search.html?q=${encodeURIComponent(q)}`);
    runSearch(q);
  });
})();