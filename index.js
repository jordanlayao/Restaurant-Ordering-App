import { menuArray } from '/data.js'

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
        <button class="add-button">+</button>             
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
function addToCard(id) {
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