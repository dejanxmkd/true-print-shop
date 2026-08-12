const { one: find, all: findAll, showToast: notify } = window.TruePrintUI;
const product = Object.fromEntries(new URLSearchParams(location.search));
const details = {
  name: product.name || 'Premium Custom Product',
  price: product.price || '$49.00',
  brand: product.brand || 'Brand name'
};

function withoutBrand(name, brand) {
  const words = brand.split(/[^a-z0-9]+/i).filter(Boolean).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return name.replace(new RegExp(`^${words.join('[\\s+&.-]*')}[\\s:–—-]*`, 'i'), '').trim() || name;
}
details.displayName = withoutBrand(details.name, details.brand);

document.title = `${details.displayName} — True Print Shop`;
const productName = find('#product-name');
productName.textContent = details.displayName;
productName.classList.toggle('title-short', details.displayName.length <= 20);
productName.classList.toggle('title-long', details.displayName.length >= 34);
productName.style.setProperty('font-weight', '800', 'important');
productName.style.color = '#111111';
find('#product-price').textContent = details.price;
find('#product-brand').textContent = details.brand;

const catalog = window.TRUE_PRINT_CATALOG || {};
const palette = catalog.colorSets?.[details.name]
  || catalog.brandColorSets?.[details.brand]
  || catalog.defaultColors
  || [['Warm White', '#F5F1E8'], ['Near Black', '#111111']];
const colourOptions = find('#colour-options');
const checkColour = hex => {
  const value = hex.replace('#', '');
  const rgb = [0, 2, 4].map(offset => parseInt(value.slice(offset, offset + 2), 16));
  const luminance = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return luminance > 155 ? '#111111' : '#F5F1E8';
};
const swatchColour = (name, hex) => {
  const normalized = hex.toLowerCase();
  const isBlack = /black/i.test(name) || normalized === '#111111' || normalized === '#000000';
  return isBlack ? '#2A2A2A' : hex;
};
colourOptions.innerHTML = palette.map(([name, hex], index) =>
  `<button type="button" ${index === 0 ? 'class="active"' : ''} style="--swatch:${swatchColour(name, hex)};--check-colour:${checkColour(hex)}" data-colour="${name}" title="${name}" aria-label="${name}" aria-pressed="${index === 0}"><i class="material-icons" aria-hidden="true">check</i></button>`
).join('');
find('#selected-colour').textContent = palette[0][0];

function singleSelect(selector, onChange = () => {}) {
  const controls = findAll(selector);
  controls.forEach(control => control.addEventListener('click', () => {
    controls.forEach(item => {
      const isSelected = item === control;
      item.classList.toggle('active', isSelected);
      item.setAttribute('aria-pressed', String(isSelected));
    });
    onChange(control);
  }));
}

singleSelect('.thumbnails button');
singleSelect('.size-options button');
singleSelect('.colour-options button', control => find('#selected-colour').textContent = control.dataset.colour);

find('.qty')?.addEventListener('click', event => {
  if (!event.target.matches('button')) return;
  const output = find('.qty span');
  const change = event.target.dataset.qty === 'plus' ? 1 : -1;
  output.textContent = Math.max(1, Number(output.textContent) + change);
});

find('.buy-row>.button')?.addEventListener('click', () => {
  const quantity = Number(find('.qty span').textContent);
  window.TruePrintCart.add({
    name: details.displayName,
    brand: details.brand,
    price: Number(details.price.replace(/[^0-9.]/g, '')) || 0,
    colour: find('#selected-colour').textContent,
    size: find('.size-options .active')?.textContent.trim() || 'One size',
    quantity
  });
});

const shareButton = find('.title-line button[aria-label="Share product"]');
const shareModal = find('.share-modal');
const shareOverlay = find('.share-overlay');
const shareUrl = find('#share-url');
const copyButton = find('.share-copy');
let shareReturnFocus = null;

function closeShare() {
  if (!shareModal?.classList.contains('open')) return;
  shareModal.classList.remove('open');
  shareOverlay.classList.remove('open');
  shareModal.setAttribute('aria-hidden', 'true');
  shareOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('share-open');
  shareReturnFocus?.focus();
}

function openShare() {
  const url = location.href;
  const title = `${details.displayName} — True Print Shop`;
  shareReturnFocus = document.activeElement;
  shareUrl.value = url;
  find('[data-share-facebook]').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  find('[data-share-x]').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  find('[data-share-email]').href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
  shareModal.classList.add('open');
  shareOverlay.classList.add('open');
  shareModal.setAttribute('aria-hidden', 'false');
  shareOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('share-open');
  find('.share-close').focus();
}

shareButton?.addEventListener('click', openShare);
findAll('[data-share-close]').forEach(control => control.addEventListener('click', closeShare));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeShare();
});

copyButton?.addEventListener('click', async () => {
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl.value);
      copied = true;
    }
  } catch (_) {}
  if (!copied) {
    shareUrl.focus();
    shareUrl.select();
    copied = document.execCommand('copy');
  }
  const icon = copyButton.querySelector('i');
  const label = copyButton.querySelector('span');
  icon.textContent = copied ? 'check' : 'content_copy';
  label.textContent = copied ? 'Copied' : 'Copy link';
  if (copied) notify('Product link copied');
  setTimeout(() => {
    icon.textContent = 'content_copy';
    label.textContent = 'Copy link';
  }, 1800);
});

// Match the product page's horizontal grid to the shared home/category gutters.
const productGridStyle = document.createElement('style');
productGridStyle.textContent = `
.product-page{
  padding-left:var(--pad)!important;
  padding-right:var(--pad)!important;
}
.product-page>.breadcrumbs,
.product-page .product-layout,
.product-page .also-loved{
  width:100%!important;
  max-width:none!important;
  margin-left:0!important;
  margin-right:0!important;
}
.product-page .product-info{
  width:100%!important;
  max-width:none!important;
}
@media(min-width:1481px){
  .product-page .product-layout{position:relative!important}
  .product-page .product-info{position:static!important}
  .product-page .title-line button[aria-label="Share product"]{right:51px!important}
}
@media(max-width:980px){
  .product-page{
    padding-left:var(--pad)!important;
    padding-right:var(--pad)!important;
  }
}
@media(max-width:600px){
  .product-page{
    padding-left:16px!important;
    padding-right:16px!important;
  }
}
`;
document.head.appendChild(productGridStyle);
