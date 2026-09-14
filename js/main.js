/* ============================================
   MAIN PAGE LOGIC (adapts to each page)
   ============================================ */

(async function () {
  // ---------- SHARED HELPERS ----------
  function renderProductCard(product) {
    const cart = CartManager.getCart();
    const inCart = cart.some(item => item.id === product.id);
    const addedClass = inCart ? 'added' : '';
    const buttonText = inCart ? 'Added' : 'Add to Cart';
    const buttonIcon = inCart ? 'fa-check' : 'fa-plus';

    return `
      <div class="product-card">
        <a class="product-image" href="product.html?id=${product.id}">
          <span class="product-badge">Fresh pick</span>
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='${product.fallbackImage || product.image}'">
        </a>
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.unit || product.category}</div>
        <div class="product-price">${formatPrice(product.price)} <small>/${product.unit || 'each'}</small></div>
        <button class="add-to-cart-btn ${addedClass}" data-id="${product.id}" ${inCart ? 'disabled' : ''}>
          <i class="fas ${buttonIcon}"></i> ${buttonText}
        </button>
      </div>
    `;
  }

  function attachAddToCartListeners(container) {
    container.querySelectorAll('.add-to-cart-btn:not(.added)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const product = products.find(p => p.id === id);
        if (product) {
          CartManager.addToCart(product);
          btn.classList.add('added');
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-check"></i> Added';
        }
      });
    });
  }

  // ---------- HEADER: SEARCH TOGGLE ----------
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
      searchBar.classList.toggle('active');
      if (searchBar.classList.contains('active')) {
        searchBar.querySelector('input').focus();
      }
    });
  }

  // ---------- HEADER: CATEGORY DROPDOWN ----------
  document.querySelectorAll('.nav-menu .dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', (event) => {
      if (!dropdown.classList.contains('open')) {
        event.preventDefault();
        document.querySelectorAll('.nav-menu .dropdown.open').forEach(openDropdown => {
          openDropdown.classList.remove('open');
        });
        dropdown.classList.add('open');
      }
    });

    dropdown.querySelectorAll('.dropdown-menu a').forEach(link => {
      link.addEventListener('click', () => dropdown.classList.remove('open'));
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-menu .dropdown')) {
      document.querySelectorAll('.nav-menu .dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  });

  // ---------- HEADER: DELIVERY TOGGLE ----------
  document.querySelectorAll('.delivery-toggle button').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.delivery-toggle button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ---------- DETECT CURRENT PAGE ----------
  const path = window.location.pathname;
  const isHome = path.endsWith('index.html') || path.endsWith('/');
  const isProducts = path.endsWith('products.html');
  const isCart = path.endsWith('cart.html');
  const isCategories = path.endsWith('categories.html');

  if (typeof API !== 'undefined' && (isHome || isProducts || isCategories)) {
    try {
      await API.loadCatalog();
    } catch (error) {
      console.error('Could not load catalog from database', error);
      const catalogError = document.createElement('div');
      catalogError.className = 'error-box';
      catalogError.textContent = 'Could not load products and categories from the database. Start the FreshMart API and refresh this page.';
      document.querySelector('.page-content')?.prepend(catalogError);
      return;
    }
  }

  // ============================================
  // HOME PAGE
  // ============================================
  if (isHome) {
    // Category cards
    const categoryCards = document.getElementById('categoryCards');
    if (categoryCards) {
      categoryCards.innerHTML = categories
        .filter(c => c.id !== 'all')
        .map(cat => `
          <a href="categories.html?cat=${cat.id}" class="category-card">
            <div class="cat-image"><img src="${cat.image}" alt="${cat.label}" loading="lazy"></div>
            <h3>${cat.label}</h3>
          </a>
        `).join('');
    }

    // Featured products
    const featuredGrid = document.getElementById('featuredProducts');
    if (featuredGrid) {
      const featured = products.filter(p => p.featured).slice(0, 8);
      featuredGrid.innerHTML = featured.map(renderProductCard).join('');
      attachAddToCartListeners(featuredGrid);
    }
  }

  // ============================================
  // PRODUCTS PAGE
  // ============================================
  if (isProducts) {
    let activeCategory = 'all';
    let sortBy = 'default';

    const categoryButtons = document.getElementById('categoryButtons');
    const productGrid = document.getElementById('productGrid');
    const sortSelect = document.getElementById('sortSelect');

    function renderCategoryButtons() {
      categoryButtons.innerHTML = categories.map(cat => `
        <button class="cat-btn ${activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
          <i class="${cat.icon}"></i> ${cat.label}
        </button>
      `).join('');

      categoryButtons.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.category;
          renderCategoryButtons();
          renderCurrentView();
        });
      });
    }

    function getFilteredAndSorted() {
      let list = activeCategory === 'all'
        ? [...products]
        : products.filter(p => p.category === activeCategory);

      switch (sortBy) {
        case 'price-asc': list.sort((a, b) => a.price - b.price); break;
        case 'price-desc': list.sort((a, b) => b.price - a.price); break;
        case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      }
      return list;
    }

    function renderCurrentView() {
      const list = getFilteredAndSorted();
      if (list.length === 0) {
        productGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:#64748b;">No products found.</div>`;
        return;
      }
      productGrid.innerHTML = list.map(renderProductCard).join('');
      attachAddToCartListeners(productGrid);
    }

    if (categoryButtons) renderCategoryButtons();
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderCurrentView();
      });
    }
    renderCurrentView();
  }

  // ============================================
  // CATEGORIES PAGE
  // ============================================
  if (isCategories) {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('cat');
    let activeCategory = categories.some(category => category.id === requestedCategory)
      ? requestedCategory
      : 'all';

    const categoryCards = document.getElementById('categoryCards');
    const categoryProducts = document.getElementById('categoryProducts');
    const categoryTitle = document.getElementById('categoryTitle');

    function renderCategoryCards() {
      categoryCards.innerHTML = categories
        .filter(c => c.id !== 'all')
        .map(cat => `
           <a href="categories.html?cat=${cat.id}" class="category-card ${activeCategory === cat.id ? 'active' : ''}"
             ${activeCategory === cat.id ? 'aria-current="page"' : ''}>
            <div class="cat-image"><img src="${cat.image}" alt="${cat.label}" loading="lazy"></div>
            <h3>${cat.label}</h3>
          </a>
        `).join('');
    }

    function renderCategoryView() {
      const cat = categories.find(c => c.id === activeCategory);
      if (categoryTitle && cat) {
        categoryTitle.textContent = activeCategory === 'all'
          ? 'All Products'
          : `Featured in ${cat.label}`;
      }
      const list = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);
      if (categoryProducts) {
        categoryProducts.innerHTML = list.length
          ? list.map(renderProductCard).join('')
          : `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:#64748b;">No products in this category yet.</div>`;
        attachAddToCartListeners(categoryProducts);
      }
    }

    renderCategoryCards();
    renderCategoryView();
  }

  // ============================================
  // CART PAGE
  // ============================================
  if (isCart) {
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('cartDelivery');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function renderCart() {
      const cart = CartManager.getCart();
      const totals = CartManager.getTotals();

      if (cart.length === 0) {
        container.innerHTML = `
          <div class="empty-cart-message">
            <i class="fas fa-shopping-basket"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <a href="products.html">Start Shopping <i class="fas fa-arrow-right"></i></a>
          </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
      } else {
        container.innerHTML = cart.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
              <span class="cart-item-icon">${item.icon}</span>
              <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
              </div>
            </div>
            <div class="cart-item-quantity">
              <button class="qty-minus" data-id="${item.id}">−</button>
              <span>${item.quantity}</span>
              <button class="qty-plus" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" title="Remove">
              <i class="fas fa-times-circle"></i>
            </button>
          </div>
        `).join('');

        // Attach event listeners
        container.querySelectorAll('.qty-plus').forEach(btn => {
          btn.addEventListener('click', () => {
            CartManager.updateQuantity(Number(btn.dataset.id), 1);
            renderCart();
          });
        });
        container.querySelectorAll('.qty-minus').forEach(btn => {
          btn.addEventListener('click', () => {
            CartManager.updateQuantity(Number(btn.dataset.id), -1);
            renderCart();
          });
        });
        container.querySelectorAll('.cart-item-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            CartManager.removeFromCart(Number(btn.dataset.id));
            renderCart();
          });
        });

        if (checkoutBtn) checkoutBtn.disabled = false;
      }

      // Update totals
      if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
      if (deliveryEl) deliveryEl.textContent = totals.delivery === 0 ? 'FREE' : formatPrice(totals.delivery);
      if (totalEl) totalEl.textContent = formatPrice(totals.total);
    }

    renderCart();

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const totals = CartManager.getTotals();
        alert(`Order placed successfully!\n\nItems: ${totals.totalItems}\nTotal: ${formatPrice(totals.total)}\n\nThank you for shopping with FreshMart!`);
        CartManager.clearCart();
        renderCart();
      });
    }
  }

  // ---------- LISTEN FOR CART UPDATES ----------
  window.addEventListener('cartUpdated', () => {
    if (isCart) {
      // Already handled by renderCart
    }
  });
})();