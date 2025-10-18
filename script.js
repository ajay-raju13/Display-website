// Select elements
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.getElementById('cart-count');

// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let count = cart.length;
if (cartCount) cartCount.textContent = count;

// Update cart count
function updateCartCount() {
  count = cart.length;
  if (cartCount) cartCount.textContent = count;
}

// Update total price
function updateTotalPrice() {
  const totalDiv = document.getElementById('cart-total');
  if (!totalDiv) return;
  let total = 0;
  cart.forEach(item => {
    let priceNum = parseFloat(item.price.replace('$','')) || 0;
    total += priceNum;
  });
  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
}

// Add to cart
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3')?.textContent;
    const productPrice = productCard.querySelector('p')?.textContent;
    const productImage = productCard.querySelector('img')?.src;
    if (!productName || !productPrice || !productImage) return;

    cart.push({ name: productName, price: productPrice, image: productImage });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateTotalPrice();
  });
});

// Buy Now - single product
const buyNowButtons = document.querySelectorAll('.buy-now');
buyNowButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card, .cart-item');
    if (!productCard) return;
    const productName = productCard.querySelector('h3')?.textContent;
    const productPrice = productCard.querySelector('p')?.textContent;
    if (!productName || !productPrice) return;

    const message = `Hi, I'm interested in buying ${productName} priced at ${productPrice}.`;
    const phoneNumber = "919876543210";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  });
});

// Load cart items
function loadCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartMsg = document.getElementById('empty-cart');
  if (!cartItemsContainer) return;

  cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    if (emptyCartMsg) emptyCartMsg.style.display = 'block';
    updateCartCount();
    updateTotalPrice();
    return;
  } else {
    if (emptyCartMsg) emptyCartMsg.style.display = 'none';
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="product-info">
        <h3>${item.name}</h3>
        <p>${item.price}</p>
      </div>
      <div class="card-buttons">
        <button class="buy-now">Buy Now</button>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  // Remove button functionality
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCartItems();
    });
  });

  // Buy Now inside cart
  document.querySelectorAll('#cart-items .buy-now').forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.cart-item');
      if (!productCard) return;
      const productName = productCard.querySelector('h3')?.textContent;
      const productPrice = productCard.querySelector('p')?.textContent;
      if (!productName || !productPrice) return;

      const message = `Hi, I'm interested in buying ${productName} priced at ${productPrice}.`;
      const phoneNumber = "919876543210";
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
    });
  });

  updateCartCount();
  updateTotalPrice();
}

// Buy All button
const buyAllBtn = document.getElementById('buy-all');
if (buyAllBtn) {
  buyAllBtn.addEventListener('click', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;

    let message = "Hi, I'm interested in buying these products:\n";
    cart.forEach(item => {
      message += `${item.name} - ${item.price}\n`;
    });

    const phoneNumber = "919876543210";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  });
}

// Load cart items on page load
if (document.getElementById('cart-items')) {
  loadCartItems();
}
