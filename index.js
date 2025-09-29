import { menuArray } from './data.js'

function getMenuArray(array){
  return array.map(property => {
  
    const {
      id,
      name,
      ingredients,
      price,
      image
    } = property
    
    return `
    <section class="item" data-id="${id}">
      <div class="item-image">
        <img src="images/${image}" alt="${image}">
      </div>
      <div class="item-details">
        <div class="item-details-container">
          <div class="detail-header">
              <p class="item-title">${name}</p>
              <p class="item-ingredients">${ingredients.join(', ')}</p>
          </div>
          <div class="detail-footer">
            <p class="item-price">$${price}</p>
          </div>
      </div>    
        <button class="add-button" data-action="add" data-id="${id}">+</button>             
      </div>
  </section>`
  
}).join('')
}

document.getElementById('main-container').innerHTML = getMenuArray(menuArray)

// ---- Elments ----
const $order = document.getElementById('order');
const $orderItems = document.getElementById('order-items');
const $totalEl = document.getElementById('order-total-amount');
const $btnComplete = document.getElementById('btn-complete');

// ---- Start Hidden ----
$order.classList.add('hidden');

// ---- State ----
const cart = []; // [{ id, qty }]
const byId = new Map(menuArray.map(m => [m.id, m]));

// ---- Helpers ----
function addToCart(id) {
  const line = cart.find(l => l.id === id);
  if (line) 
    line.qty += 1;
  else 
    cart.push({ id, qty: 1 })
  renderCart();
}

function removeAll(id) {
  const i = cart.findIndex(l => l.id === id);
  if (i !== -1) cart.splice(i, 1);
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, l) => sum + (byId.get(l.id)?.price || 0) * l.qty, 0);
}

// ------- Render cart -------
function renderCart() {
  if (cart.length === 0) {
    $orderItems.innerHTML = '';
    $totalEl.textContent = '$0';
    $order.classList.add('hidden');
    return;
  }

  $order.classList.remove('hidden');

  $orderItems.innerHTML = cart.map(l => {
    const item = byId.get(l.id);
    return `
      <div class="item-row" data-id="${l.id}">
        <div class="row-item-title">
          <p class="item-title">${item.name} - ${l.qty}</p>
          <button class="btn-link" data-action="remove">remove</button>
        </div>
        <p class="item-price">$${item.price * l.qty}</p>
      </div>
    `;
  }).join('');

  $totalEl.textContent = `$${cartTotal()}`;
}

// ------- Click handlers (event delegation) -------
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-action="add"]');
  if (addBtn) {
    const id = Number(addBtn.dataset.id);
    addToCart(id);
  }

  const removeBtn = e.target.closest('[data-action="remove"]');
  if (removeBtn) {
    const row = removeBtn.closest('.item-row');
    const id = Number(row?.dataset.id);
    removeAll(id);
  }
});

// ------- Modal elements -------
const $overlay  = document.getElementById('overlay');
const $checkout = document.getElementById('checkout-modal');
const $success  = document.getElementById('success-modal');
const $modalClose = document.getElementById('modal-close');
const $successClose = document.getElementById('success-close');
const $payForm = document.getElementById('pay-form');
const $btnPay = document.getElementById('btn-pay');
const $successName = document.getElementById('success-name');

// Open checkout on Complete Order
$btnComplete.addEventListener('click', () => {
  if (cart.length === 0) return;
  $overlay.classList.remove('hidden');
  $checkout.classList.remove('hidden');
  document.getElementById('input-name')?.focus();
});

// Close buttons
$modalClose.addEventListener('click', () => {
  $checkout.classList.add('hidden');
  $overlay.classList.add('hidden');
});
$successClose.addEventListener('click', () => {
  $success.classList.add('hidden');
  $overlay.classList.add('hidden');
});

// Submit payment
$btnPay.addEventListener('click', () => {
  // Submit the form programmatically so 'required' fields still work
  $payForm.requestSubmit();
});

$payForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Grab name for the success message
  const fd = new FormData($payForm);
  const name = (fd.get('name') || 'Friend').toString().trim() || 'Friend';
  $successName.textContent = name;

  // Swap modals
  $checkout.classList.add('hidden');
  $success.classList.remove('hidden');

  // Clear cart
  cart.splice(0, cart.length);
  renderCart();

  // Reset form for next time
  $payForm.reset();
});