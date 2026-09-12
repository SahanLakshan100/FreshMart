/* ============================================
   CHECKOUT PAGE LOGIC
   ============================================ */

(function () {
  const cart = CartManager.getCart();
  const totals = CartManager.getTotals();

  // Redirect if cart is empty
  if (cart.length === 0) {
    alert('Your cart is empty. Redirecting to products...');
    window.location.href = 'products.html';
    return;
  }

  // Prefill if user is logged in
  const user = Auth.getCurrentUser();
  if (user) {
    document.getElementById('coName').value = user.name;
    document.getElementById('coEmail').value = user.email;
  }

  // Render cart items
  document.getElementById('checkoutItems').innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span class="checkout-item-icon">${item.icon}</span>
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-qty">Qty: ${item.quantity}</div>
      </div>
      <div class="checkout-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  // Totals
  document.getElementById('coSubtotal').textContent = formatPrice(totals.subtotal);
  document.getElementById('coDelivery').textContent = totals.delivery === 0 ? 'FREE' : formatPrice(totals.delivery);
  document.getElementById('coTotal').textContent = formatPrice(totals.total);

  // Place order
  document.getElementById('placeOrderBtn').addEventListener('click', async () => {
    const btn = document.getElementById('placeOrderBtn');
    const errEl = document.getElementById('checkoutError');
    errEl.textContent = '';

    // Validate
    const name = document.getElementById('coName').value.trim();
    const email = document.getElementById('coEmail').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const address = document.getElementById('coAddress').value.trim();
    const city = document.getElementById('coCity').value.trim();
    const postal = document.getElementById('coPostal').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !email || !phone || !address || !city || !postal) {
      errEl.textContent = 'Please fill in all required fields.';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing order...';

    try {
      const orderData = {
        customer: { name, email, phone },
        shipping: { address, city, postal },
        payment,
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity })),
        totals
      };

      const result = await API.placeOrder(orderData);

      // Clear cart
      CartManager.clearCart();

      // Success page (inline)
      document.querySelector('.checkout-layout').outerHTML = `
        <div class="success-box">
          <div class="success-icon"><i class="fas fa-check-circle"></i></div>
          <h1>Order Placed!</h1>
          <p>Thank you, ${name}. Your order has been confirmed.</p>
          <div class="success-order-id">Order ID: <strong>${result.orderId}</strong></div>
          <p class="success-note">You will receive a confirmation email at <strong>${email}</strong> shortly.</p>
          <a href="products.html" class="btn-primary">Continue Shopping</a>
        </div>
      `;

    } catch (err) {
      errEl.textContent = 'Something went wrong. Please try again.';
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
    }
  });
})();