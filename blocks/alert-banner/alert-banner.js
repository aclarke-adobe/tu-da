import { decorateIcons } from '../../scripts/aem.js';

/*
 * Alert Banner Block
 * Dismissible notice bar. One row: optional icon cell, message cell (text + link).
 * Dismissal is remembered for the browser session per message.
 */

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = Math.imul(31, h) + text.charCodeAt(i) || 0;
  return Math.abs(h).toString(36);
}

/**
 * Swap an icon <img> for its inline SVG so the icon can take the theme fill colour.
 * Keeps the <img> if the SVG cannot be fetched.
 * @param {HTMLImageElement} img
 */
async function inlineIcon(img) {
  try {
    const resp = await fetch(img.src);
    if (!resp.ok) return;
    const doc = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    img.replaceWith(document.importNode(svg, true));
  } catch (e) {
    // keep the <img> fallback
  }
}

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (!cells.length) return;

  // a cell holding only ":icon-name:" text becomes an icon span (when not already converted)
  cells.forEach((cell) => {
    const m = cell.textContent.trim().match(/^:([a-z0-9-]+):$/);
    if (!m || cell.querySelector('picture, img, .icon')) return;
    const span = document.createElement('span');
    span.className = `icon icon-${m[1]}`;
    cell.replaceChildren(span);
    decorateIcons(cell);
  });

  const iconCell = cells.find((c) => c.querySelector('picture, img, .icon') && !c.textContent.trim());
  const messageCells = cells.filter((c) => c !== iconCell);

  const key = `alert-banner-dismissed-${hash(block.textContent.trim())}`;
  try {
    if (sessionStorage.getItem(key)) {
      block.closest('.alert-banner-wrapper')?.remove();
      block.remove();
      return;
    }
  } catch (e) {
    // storage unavailable: always show
  }

  const inner = document.createElement('div');
  inner.className = 'alert-banner-inner';
  inner.setAttribute('role', 'region');
  inner.setAttribute('aria-label', 'Site notice');

  if (iconCell) {
    // keep only the icon: on published pages the icon arrives already converted and
    // gets wrapped in a <p> (with its margins) before the block runs
    const icon = iconCell.querySelector('.icon, picture, img');
    iconCell.replaceChildren(icon);
    iconCell.className = 'alert-banner-icon';
    inner.append(iconCell);
    const iconImg = iconCell.querySelector('.icon img[src$=".svg"]');
    if (iconImg) await inlineIcon(iconImg);
  }

  const message = document.createElement('div');
  message.className = 'alert-banner-message';
  messageCells.forEach((c) => message.append(...c.childNodes));
  inner.append(message);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'alert-banner-close';
  close.setAttribute('aria-label', 'Dismiss notice');
  close.addEventListener('click', () => {
    try {
      sessionStorage.setItem(key, '1');
    } catch (e) {
      // ignore
    }
    (block.closest('.alert-banner-wrapper') || block).remove();
  });
  inner.append(close);

  block.replaceChildren(inner);
}
