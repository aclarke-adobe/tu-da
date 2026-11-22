/*
 * Testimonial Block
 * Single profile: photo, name, short bio and quote. Content may be one row
 * (photo cell | text cell) or stacked rows (photo row, text row). In the
 * text, the first short line is the name; a blockquote, or a paragraph that
 * is wholly italic or wrapped in quotation marks, is the quote.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

function isQuote(p) {
  const text = p.textContent.trim();
  if (/^["“].*["”]$/s.test(text)) return true;
  const only = p.children.length === 1 ? p.firstElementChild : null;
  return !!only && /^(EM|I)$/.test(only.tagName) && only.textContent.trim() === text;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const imageCell = cells.find((c) => c.querySelector('picture') && c.textContent.trim() === '');

  const figure = document.createElement('figure');
  figure.className = 'testimonial-figure';

  if (imageCell) {
    imageCell.className = 'testimonial-image';
    figure.append(imageCell);
  }

  const body = document.createElement('div');
  body.className = 'testimonial-body';
  cells.filter((c) => c !== imageCell).forEach((c) => body.append(...c.childNodes));

  const first = body.firstElementChild;
  if (first && !isQuote(first)) first.classList.add('testimonial-name');

  body.querySelectorAll(':scope > p, :scope > blockquote').forEach((el) => {
    if (el.tagName === 'BLOCKQUOTE' || isQuote(el)) el.classList.add('testimonial-quote');
  });
  figure.append(body);

  figure.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(figure);
}
