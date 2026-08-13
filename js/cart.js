/* True Print Shop — persistent prototype cart.
   Kept separate from storefront/navigation logic for a clean handoff. */

import { $, $$, escapeHtml, formatMoney, showToast } from './app.js';

const CART_STORAGE_KEY = 'true-print-shop-cart';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function getCartCount(items = readCart()) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadges(items = readCart()) {
  $$('.cart-tool b').forEach(badge => {
    badge.textContent = getCartCount(items);
  });
}

function ensureCartMarkup() {
  if ($('.cart-drawer')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="cart-backdrop" aria-hidden="true"></div>
    <aside class="cart-drawer" aria-hidden="true" aria-label="Shopping cart">
      <div class="cart-head">
        <h2 class="ui-title">Shopping cart</h2>
        <button class="cart-close" type="button" aria-label="Close cart"><i class="material-icons">close</i></button>
      </div>
      <div class="cart-items"></div>
      <div class="cart-empty">
        <i class="material-icons">shopping_bag</i>
        <h3>Your cart is empty</h3>
        <p>Add a product and it will appear here.</p>
      </div>
      <div class="cart-summary">
        <div><span>Subtotal</span><strong class="cart-subtotal">$0.00</strong></div>
        <button class="button primary cart-checkout" type="button">Checkout <i class="material-icons">arrow_forward</i></button>
        <small>Shipping and taxes calculated at checkout.</small>
      </div>
    </aside>
  `);
}

export function initializeCart() {
  ensureCartMarkup();

  const drawer = $('.cart-drawer');
  const backdrop = $('.cart-backdrop');
  const itemsContainer = $('.cart-items');
  const emptyState = $('.cart-empty');
  const summary = $('.cart-summary');
  const subtotal = $('.cart-subtotal');

  if (!drawer || !backdrop || !itemsContainer || !emptyState || !summary || !subtotal) return;

  function renderCart() {
    const items = readCart();

    emptyState.hidden = items.length > 0;
    summary.hidden = items.length === 0;
    itemsContainer.innerHTML = items.map(item => `
      <article class="cart-item" data-id="${escapeHtml(item.id)}">
        <div class="cart-item-image" aria-hidden="true"></div>
        <div class="cart-item-copy">
          <small>${escapeHtml(item.brand)}</small>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.colour)} · ${escapeHtml(item.size)}</p>
          <strong>${formatMoney(item.price)}</strong>
        </div>
        <button class="cart-remove" type="button" data-cart-action="remove" aria-label="Remove ${escapeHtml(item.name)}"><i class="material-icons">close</i></button>
        <div class="cart-qty">
          <button type="button" data-cart-action="minus" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-action="plus" aria-label="Increase quantity">+</button>
        </div>
      </article>
    `).join('');

    subtotal.textContent = formatMoney(items.reduce((total, item) => total + item.price * item.quantity, 0));
    updateCartBadges(items);
  }

  function setCartOpen(open) {
    drawer.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    backdrop.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('cart-open', open);

    if (open) {
      renderCart();
      $('.cart-close')?.focus();
    }
  }

  $$('.cart-tool').forEach(button => button.addEventListener('click', () => setCartOpen(true)));
  $('.cart-close')?.addEventListener('click', () => setCartOpen(false));
  backdrop.addEventListener('click', () => setCartOpen(false));

  itemsContainer.addEventListener('click', event => {
    const actionButton = event.target.closest('[data-cart-action]');
    const card = event.target.closest('.cart-item');
    if (!actionButton || !card) return;

    const items = readCart();
    const item = items.find(entry => entry.id === card.dataset.id);
    if (!item) return;

    if (actionButton.dataset.cartAction === 'plus') item.quantity += 1;
    if (actionButton.dataset.cartAction === 'minus') item.quantity -= 1;

    const nextItems = actionButton.dataset.cartAction === 'remove' || item.quantity < 1
      ? items.filter(entry => entry.id !== item.id)
      : items;

    writeCart(nextItems);
    renderCart();
  });

  $('.cart-checkout')?.addEventListener('click', () => showToast('Checkout will be connected next.'));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setCartOpen(false);
  });

  renderCart();

  return {
    add(product) {
      const items = readCart();
      const id = [product.name, product.colour, product.size].join('|');
      const existing = items.find(item => item.id === id);

      if (existing) existing.quantity += product.quantity;
      else items.push({ ...product, id });

      writeCart(items);
      renderCart();
      showToast(`${product.quantity} item${product.quantity > 1 ? 's' : ''} added to your cart`);
    },
    open: () => setCartOpen(true),
    close: () => setCartOpen(false),
    render: renderCart
  };
}
