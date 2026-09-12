/* ============================================
   PRODUCT DETAIL PAGE LOGIC
   ============================================ */

(function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  const detailEl = document.getElementById('productDetail');
  const relatedEl = document.getElementById('relatedProducts');
  const breadcrumbEl = document.getElementById('breadcrumb');

  if (!productId) {
    detailEl.innerHTML = `<div class="error-box">Product not found. <a href="products.html">Back to products</a></div>`;
    return;
  }

  async function loadProduct() {
    try {
      const product = await API.getProductById(productId);

      if (!product) {
        detailEl.innerHTML = `<div class="error-box">Product not found. <a href="products.html">Back to products</a></div>`;
        return;
      }

      // Update page title
      document.title = `${product.name} · FreshMart`;

      // Breadcrumb
      breadcrumbEl.innerHTML = `
        <a href="index.html">Home</a>
        <i class="fas fa-chevron-right"></i>
        <a href="products.html">Products</a>
        <i class="fas fa-chevron-right"></i>
        <a href="categories.html?cat=${product.category}">${product.category}</a>
        <i class="fas fa-chevron-right"></i>
        <span>${product.name}</span>
      `;

      // Rating stars
      const rating = product.rating || 4.5;
      const stars = renderStars(rating);
      const reviewCount = product.reviews || Math.floor(Math.random() * 200) + 20;

      // Check cart state
      const cart = CartManager.getCart();
      const inCart = cart.some(item => item.id === product.id);

      detailEl.innerHTML = `
        <div class="product-detail-grid">
          <div class="product-detail-image">
            <div class="product-detail-icon"><img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage || product.image}'"></div>
            <div class="product-thumbnails">
              <div class="thumb active"><img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage || product.image}'"></div>
              <div class="thumb"><img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage || product.image}'"></div>
              <div class="thumb"><img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage || product.image}'"></div>
            </div>
          </div>

          <div class="product-detail-info">
            <span class="product-detail-category">${product.category}</span>
            <h1 class="product-detail-name">${product.name}</h1>

            <div class="product-detail-rating">
              ${stars}
              <span class="rating-text">${rating.toFixed(1)} (${reviewCount} reviews)</span>
            </div>

            <div class="product-detail-price">
              ${formatPrice(product.price)} <small>/${product.unit || 'each'}</small>
            </div>

            <p class="product-detail-desc">
              Fresh, high-quality ${product.name.toLowerCase()} sourced from trusted suppliers.
              Perfect for your daily needs. Delivered to your doorstep with care.
            </p>

            <div class="product-detail-actions">
              <div class="qty-selector">
                <button class="qty-btn" id="qtyMinus">−</button>
                <input type="number" id="qtyInput" value="1" min="1" max="99">
                <button class="qty-btn" id="qtyPlus">+</button>
              </div>
              <button class="btn-add-large ${inCart ? 'added' : ''}" id="addToCartBtn" ${inCart ? 'disabled' : ''}>
                <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i>
                ${inCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            <div class="product-detail-meta">
              <div><i class="fas fa-truck"></i> Free delivery over LKR 7,500</div>
              <div><i class="fas fa-undo"></i> 7-day return policy</div>
              <div><i class="fas fa-shield-alt"></i> Quality guaranteed</div>
            </div>
          </div>
        </div>
      `;

      // Attach handlers
      attachProductHandlers(product);
      loadRelated(product.id);

    } catch (err) {
      detailEl.innerHTML = `<div class="error-box">Failed to load product. <a href="products.html">Back to products</a></div>`;
      console.error(err);
    }
  }

  function renderStars(rating) {
    let html = '<div class="stars">';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
      else if (i - rating < 1) html += '<i class="fas fa-star-half-alt"></i>';
      else html += '<i class="far fa-star"></i>';
    }
    html += '</div>';
    return html;
  }

  function attachProductHandlers(product) {
    const qtyInput = document.getElementById('qtyInput');
    const addBtn = document.getElementById('addToCartBtn');

    document.getElementById('qtyMinus').addEventListener('click', () => {
      const v = Math.max(1, Number(qtyInput.value) - 1);
      qtyInput.value = v;
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
      const v = Math.min(99, Number(qtyInput.value) + 1);
      qtyInput.value = v;
    });

    addBtn.addEventListener('click', () => {
      const qty = Number(qtyInput.value);
      for (let i = 0; i < qty; i++) {
        CartManager.addToCart(product);
      }
      addBtn.classList.add('added');
      addBtn.disabled = true;
      addBtn.innerHTML = `<i class="fas fa-check"></i> Added to Cart`;
    });
  }

  async function loadRelated(id) {
    const related = await API.getRelatedProducts(id, 4);
    if (!related.length) {
      relatedEl.parentElement.style.display = 'none';
      return;
    }
    relatedEl.innerHTML = related.map(p => `
      <a href="product.html?id=${p.id}" class="product-card" style="text-decoration:none;color:inherit;">
        <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='${p.fallbackImage || p.image}'"></div>
        <div class="product-name">${p.name}</div>
        <div class="product-category">${p.unit || p.category}</div>
        <div class="product-price">${formatPrice(p.price)} <small>/${p.unit || 'each'}</small></div>
      </a>
    `).join('');
  }

  loadProduct();
})();