/*
 * Cards Overlay Block
 * One row per tile: image cell (optional), body cell (heading, text, link).
 * Tiles with an image show the body over the photo; tiles without an image
 * render as boxed text tiles. Option `tinted`: a colour tint over the photo.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-overlay-card';
    [...row.children].forEach((cell) => {
      const imageOnly = cell.querySelector('picture') && cell.textContent.trim() === '';
      if (!imageOnly && !cell.textContent.trim() && !cell.children.length) return;
      cell.className = imageOnly ? 'cards-overlay-card-image' : 'cards-overlay-card-body';
      li.append(cell);
    });
    if (!li.children.length) return;
    if (!li.querySelector('.cards-overlay-card-image')) li.classList.add('cards-overlay-card-text');
    // a paragraph holding only a link is the tile's pill CTA
    li.querySelectorAll('.cards-overlay-card-body p').forEach((p) => {
      const a = p.querySelector(':scope > a');
      if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
        p.classList.add('cards-overlay-card-cta');
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
