/* True Print Shop — shared application utilities.
   This module is staged for the clean handoff and is not loaded by pages
   until the migration pass is complete. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

export function showToast(message) {
  const toast = $('.toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

export function setSearch(open) {
  const panel = $('.search-panel');
  if (!panel) return;

  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', String(!open));

  if (open) {
    setTimeout(() => $('.search-panel input')?.focus(), 180);
  }
}

export function initializeSharedUi() {
  const searchButton = $('[aria-label="Search"]');
  const closeSearchButton = $('.search-panel button');

  searchButton?.addEventListener('click', () => {
    const panel = $('.search-panel');
    setSearch(!panel?.classList.contains('open'));
  });

  closeSearchButton?.addEventListener('click', () => setSearch(false));

  $$('#announce button').forEach(button => {
    button.addEventListener('click', () => $('#announce')?.remove());
  });

  $$('[data-chat]').forEach(button => {
    button.addEventListener('click', () => showToast('Chat will be available here.'));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setSearch(false);
  });
}
