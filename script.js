const one = (selector, parent = document) => parent.querySelector(selector);
const all = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const ui = {
  body: document.body,
  header: one('.site-header'),
  menu: one('.mobile-menu'),
  menuButton: one('.menu-tool'),
  search: one('.search-panel'),
  searchButton: one('[aria-label="Search"]'),
  searchInput: one('.search-panel input'),
  toast: one('.toast')
};

function showToast(message) {
  if (!ui.toast) return;
  ui.toast.textContent = message;
  ui.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove('show'), 2200);
}

function setSearch(open) {
  ui.search?.classList.toggle('open', open);
  ui.search?.setAttribute('aria-hidden', String(!open));
  if (open) setTimeout(() => ui.searchInput?.focus(), 180);
}

function setMenu(open) {
  if (!ui.menu || !ui.menuButton) return;
  ui.menu.classList.toggle('open', open);
  ui.body.classList.toggle('menu-open', open);
  ui.menu.setAttribute('aria-hidden', String(!open));
  ui.menuButton.setAttribute('aria-expanded', String(open));
  one('i', ui.menuButton).textContent = open ? 'close' : 'menu';
  if (open) ui.menu.style.top = `${ui.header.getBoundingClientRect().bottom}px`;
}

one('#announce button')?.addEventListener('click', () => one('#announce')?.remove());
ui.searchButton?.addEventListener('click', () => setSearch(!ui.search.classList.contains('open')));
one('.search-panel button')?.addEventListener('click', () => setSearch(false));
ui.menuButton?.addEventListener('click', () => setMenu(!ui.menu.classList.contains('open')));
all('.mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
all('[data-chat]').forEach(button => button.addEventListener('click', () => showToast('Chat will be available here.')));

/* Shared persistent cart */
const CART_KEY = 'true-print-shop-cart';
const readCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
};
const writeCart = items => localStorage.setItem(CART_KEY, JSON.stringify(items));
const money = value => `$${Number(value).toFixed(2)}`;
const escapeHTML = value => String(value).replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);

document.body.insertAdjacentHTML('beforeend', `
  <div class="cart-backdrop" aria-hidden="true"></div>
  <aside class="cart-drawer" aria-hidden="true" aria-label="Shopping cart">
    <div class="cart-head"><h2>Shopping cart</h2><button class="cart-close" type="button" aria-label="Close cart"><i class="material-icons">close</i></button></div>
    <div class="cart-items"></div>
    <div class="cart-empty"><i class="material-icons">shopping_bag</i><h3>Your cart is empty</h3><p>Add a product and it will appear here.</p></div>
    <div class="cart-summary"><div><span>Subtotal</span><strong class="cart-subtotal">$0.00</strong></div><button class="button primary cart-checkout" type="button">Checkout <i class="material-icons">arrow_forward</i></button><small>Shipping and taxes calculated at checkout.</small></div>
  </aside>`);

const cartUI = {
  drawer: one('.cart-drawer'), backdrop: one('.cart-backdrop'), items: one('.cart-items'),
  empty: one('.cart-empty'), summary: one('.cart-summary'), subtotal: one('.cart-subtotal')
};

function cartCount(items = readCart()) { return items.reduce((total, item) => total + item.quantity, 0); }
function updateCartBadges(items = readCart()) { all('.cart-tool b').forEach(badge => badge.textContent = cartCount(items)); }
function renderCart() {
  const items = readCart();
  cartUI.empty.hidden = items.length > 0;
  cartUI.summary.hidden = items.length === 0;
  cartUI.items.innerHTML = items.map(item => `
    <article class="cart-item" data-id="${escapeHTML(item.id)}">
      <div class="cart-item-image" aria-hidden="true"></div>
      <div class="cart-item-copy"><small>${escapeHTML(item.brand)}</small><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.colour)} · ${escapeHTML(item.size)}</p><strong>${money(item.price)}</strong></div>
      <button class="cart-remove" type="button" data-cart-action="remove" aria-label="Remove ${escapeHTML(item.name)}"><i class="material-icons">close</i></button>
      <div class="cart-qty"><button type="button" data-cart-action="minus" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-cart-action="plus" aria-label="Increase quantity">+</button></div>
    </article>`).join('');
  cartUI.subtotal.textContent = money(items.reduce((total, item) => total + item.price * item.quantity, 0));
  updateCartBadges(items);
}
function setCart(open) {
  cartUI.drawer.classList.toggle('open', open);
  cartUI.backdrop.classList.toggle('open', open);
  cartUI.drawer.setAttribute('aria-hidden', String(!open));
  cartUI.backdrop.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('cart-open', open);
  if (open) { setMenu(false); renderCart(); one('.cart-close')?.focus(); }
}
function addToCart(product) {
  const items = readCart();
  const id = [product.name, product.colour, product.size].join('|');
  const existing = items.find(item => item.id === id);
  if (existing) existing.quantity += product.quantity;
  else items.push({ ...product, id });
  writeCart(items);
  renderCart();
  showToast(`${product.quantity} item${product.quantity > 1 ? 's' : ''} added to your cart`);
}

all('.cart-tool').forEach(button => button.addEventListener('click', () => setCart(true)));
one('.cart-close')?.addEventListener('click', () => setCart(false));
cartUI.backdrop.addEventListener('click', () => setCart(false));
cartUI.items.addEventListener('click', event => {
  const button = event.target.closest('[data-cart-action]');
  const card = event.target.closest('.cart-item');
  if (!button || !card) return;
  const items = readCart();
  const item = items.find(entry => entry.id === card.dataset.id);
  if (!item) return;
  if (button.dataset.cartAction === 'plus') item.quantity += 1;
  if (button.dataset.cartAction === 'minus') item.quantity -= 1;
  const next = button.dataset.cartAction === 'remove' || item.quantity < 1 ? items.filter(entry => entry.id !== item.id) : items;
  writeCart(next); renderCart();
});
one('.cart-checkout')?.addEventListener('click', () => showToast('Checkout will be connected next.'));
renderCart();

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  setSearch(false);
  setMenu(false);
  setCart(false);
});

const railControls = new Map();
function updateRail(rail) {
  const track = railControls.get(rail);
  if (!track) return;
  const overflow = rail.scrollWidth - rail.clientWidth;
  track.classList.toggle('visible', overflow > 2);
  if (overflow <= 2) return;
  const thumb = one('span', track);
  const width = Math.max(14, rail.clientWidth / rail.scrollWidth * 100);
  thumb.style.width = `${width}%`;
  thumb.style.left = `${rail.scrollLeft / overflow * (100 - width)}%`;
}

all('.product-rail').forEach(rail => {
  const track = rail.nextElementSibling;
  railControls.set(rail, track);
  rail.addEventListener('scroll', () => updateRail(rail), { passive: true });
  track?.addEventListener('click', event => {
    const bounds = track.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    rail.scrollTo({ left: ratio * (rail.scrollWidth - rail.clientWidth), behavior: 'smooth' });
  });
});

all('.tabs').forEach(tabs => {
  const rail = document.getElementById(tabs.dataset.grid);
  const filter = () => {
    const category = one('.active', tabs).dataset.filter;
    all('article', rail).forEach(card => card.hidden = card.dataset.category !== category);
    rail.scrollLeft = 0;
    requestAnimationFrame(() => updateRail(rail));
  };
  tabs.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    all('button', tabs).forEach(item => item.classList.toggle('active', item === button));
    filter();
  });
  filter();
});

all('#bundle-products article,#responder-products article').forEach(card => {
  card.classList.add('is-product-link');
  card.tabIndex = 0;
  card.setAttribute('role', 'link');
  const open = () => {
    const query = new URLSearchParams({
      name: one('h3', card)?.textContent.trim() || 'True Print Product',
      price: one('strong', card)?.textContent.trim() || '$49.00',
      brand: card.dataset.brand || 'Brand name'
    });
    location.href = `product.html?${query}`;
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });
});

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  revealObserver.unobserve(entry.target);
}), { threshold: .08 });
all('.reveal').forEach(element => revealObserver.observe(element));

window.addEventListener('resize', () => {
  if (ui.menu?.classList.contains('open')) ui.menu.style.top = `${ui.header.getBoundingClientRect().bottom}px`;
  all('.product-rail').forEach(updateRail);
});

window.TruePrintUI = { one, all, showToast };
window.TruePrintCart = { add: addToCart, open: () => setCart(true), count: cartCount };

const routeByLabel = {
  'Contact Us': 'info.html?page=contact', FAQ: 'info.html?page=faq', Refunds: 'info.html?page=refunds',
  'Our Story': 'info.html?page=about', Blog: 'info.html?page=blog', Careers: 'info.html?page=careers',
  Safety: 'collection.html?category=safety', Blanks: 'collection.html?category=blanks', Merch: 'collection.html?category=merch'
};
all('a').forEach(link => {
  const route = routeByLabel[link.textContent.trim()];
  if (route && (!link.getAttribute('href') || link.getAttribute('href') === '#')) link.href = route;
});
all('.products').forEach(section => {
  const category = section.id === 'bundles' ? 'bundles' : 'first-responders';
  one('.heading-row>a', section)?.setAttribute('href', `collection.html?category=${category}`);
  one('.section-button', section)?.setAttribute('href', `collection.html?category=${category}`);
});

/* Canonical storefront fixes requested across all pages using script.js. */
(function installCanonicalStorefrontFixes(){
  const mega=document.querySelector('.desktop-nav .nav-item.has-mega-dropdown');
  if(mega){
    mega.className='nav-item has-dropdown apparel-dropdown';
    mega.innerHTML=`<a href="collection.html?category=t-shirts">Custom Apparel</a><div class="dropdown-menu apparel-menu">
      <div class="nav-subitem"><a href="collection.html?category=t-shirts">T-Shirts</a><div class="sub-dropdown-menu"><a href="collection.html?category=short-sleeve">Short Sleeve</a><a href="collection.html?category=long-sleeve">Long Sleeve</a><a href="collection.html?category=polos">Polos</a></div></div>
      <div class="nav-subitem"><a href="collection.html?category=sweatshirts">Sweatshirts</a><div class="sub-dropdown-menu"><a href="collection.html?category=hoodies">Hoodies</a><a href="collection.html?category=crewnecks">Crewnecks</a><a href="collection.html?category=zip-hoodies">Zip Up Hoodies</a><a href="collection.html?category=quarter-zips">Quarter Zip Ups</a></div></div>
      <div class="nav-subitem"><a href="collection.html?category=sweatpants">Sweatpants</a><div class="sub-dropdown-menu"><a href="collection.html?category=joggers">Joggers</a></div></div>
      <div class="nav-subitem"><a href="collection.html?category=hats">Hats</a><div class="sub-dropdown-menu"><a href="collection.html?category=athletic-hats">Athletic Hats</a><a href="collection.html?category=beanies">Beanies</a><a href="collection.html?category=fitted-hats">Fitted Hats</a><a href="collection.html?category=hats">Lifetime Hats</a><a href="collection.html?category=mesh-hats">Mesh</a><a href="collection.html?category=snapbacks">Snapback</a><a href="collection.html?category=trucker-hats">Trucker Hats</a></div></div>
      <div class="nav-subitem"><a href="collection.html?category=jackets">Jackets</a><div class="sub-dropdown-menu"><a href="collection.html?category=jackets&q=jacket">Jackets</a><a href="collection.html?category=jackets&q=vest">Vests</a></div></div>
    </div>`;
  }

  if(document.getElementById('canonical-storefront-fixes'))return;
  const style=document.createElement('style');
  style.id='canonical-storefront-fixes';
  style.textContent=`
    h1{font-size:clamp(64px,6.6vw,84px)!important;line-height:1.02!important;font-weight:900!important;text-transform:uppercase!important}
    h2{font-size:clamp(36px,5.5vw,64px)!important;line-height:1.05!important;font-weight:900!important;text-transform:uppercase!important;letter-spacing:-3px!important}
    #product-name{font-weight:600!important;text-transform:none!important;color:var(--color-ink,#111111)!important}
    .site-footer{background:#111111!important;color:#F5F1E8!important}
    .site-footer :is(h1,h2,h3,h4,h5,h6,p,a,span,strong,small,li){color:#F5F1E8!important}
    .site-footer .footer-intro,.site-footer .footer-bottom{border-color:rgba(245,241,232,.3)!important}
    .site-footer .footer-bottom a{background:#2457FF!important;border-color:#2457FF!important;color:#F5F1E8!important}
    .site-footer .footer-bottom a i{color:#F5F1E8!important}
    .site-footer .footer-bottom a:hover{background:#2457FF!important;border-color:#2457FF!important;color:#F5F1E8!important}
    .filter-scroll h2{font-size:22px!important;line-height:1.2!important;letter-spacing:0!important;text-transform:none!important;border:0!important;text-decoration:none!important;padding-bottom:0!important}
    .filter-scroll h2::before,.filter-scroll h2::after{display:none!important;content:none!important}
    @media(min-width:1481px){
      .desktop-nav a,.desktop-nav a:hover{transition:none!important;transform:none!important}
      .desktop-nav .apparel-dropdown{position:relative!important}
      .desktop-nav .apparel-dropdown>.apparel-menu{top:calc(100% - 2px)!important;left:0!important;min-width:290px!important;width:auto!important;padding:18px!important;display:flex!important;flex-direction:column!important;gap:4px!important;background:var(--color-cream,#F5F1E8)!important;color:var(--color-ink,#111111)!important;border:2px solid var(--color-ink,#111111)!important;border-radius:20px!important;box-shadow:5px 5px 0 var(--color-ink,#111111)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:none!important;transition:none!important}
      .desktop-nav .apparel-dropdown:hover>.apparel-menu,.desktop-nav .apparel-dropdown:focus-within>.apparel-menu{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important}
      .desktop-nav .nav-subitem{position:relative}
      .desktop-nav .nav-subitem::before{content:"";position:absolute;top:0;left:100%;width:18px;height:100%}
      .desktop-nav .nav-subitem>a{min-height:46px;padding:9px 12px!important;display:flex!important;align-items:center;justify-content:space-between;gap:22px;font-size:16px!important;font-weight:700!important;color:var(--color-ink,#111111)!important;white-space:nowrap!important;transition:none!important;transform:none!important}
      .desktop-nav .nav-subitem>a::after{content:"chevron_right";font-family:"Material Icons";font-size:19px;color:var(--color-blue,#2457FF)}
      .desktop-nav .sub-dropdown-menu{position:absolute;top:-18px;left:calc(100% + 12px);min-width:270px;padding:18px;display:flex;flex-direction:column;gap:4px;background:var(--color-cream,#F5F1E8);border:2px solid var(--color-ink,#111111);border-radius:20px;box-shadow:5px 5px 0 var(--color-ink,#111111);opacity:0;visibility:hidden;pointer-events:none;z-index:130;transition:none}
      .desktop-nav .nav-subitem:hover>.sub-dropdown-menu,.desktop-nav .nav-subitem:focus-within>.sub-dropdown-menu{opacity:1;visibility:visible;pointer-events:auto}
      .desktop-nav .sub-dropdown-menu a{min-height:44px;padding:9px 12px!important;font-size:16px!important;font-weight:700!important;color:var(--color-ink,#111111)!important;white-space:nowrap!important;transition:none!important;transform:none!important}
      .desktop-nav .nav-subitem>a:hover,.desktop-nav .sub-dropdown-menu a:hover{color:var(--color-blue,#2457FF)!important;transform:none!important}
    }
  `;
  document.head.appendChild(style);
})();
