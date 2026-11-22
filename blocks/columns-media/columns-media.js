/*
 * Columns Media Block
 * Two-column text + media layout. Each row: a text cell (heading, text,
 * lists, buttons) and a media cell (image or illustration); either order.
 * Option `boxed`: the row sits in a filled panel.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? firstRow.children.length : 0;
  block.classList.add(`columns-media-${cols}-cols`);

  // Document Authoring stores list items holding an image as paragraphs
  // (<li><p><picture></p><p>text</p></li>): unwrap them back to <li><picture>text</li>
  block.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));

  [...block.children].forEach((row) => {
    row.classList.add('columns-media-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const mediaOnly = pic && col.textContent.trim() === '';
      col.classList.add(mediaOnly ? 'columns-media-media' : 'columns-media-text');
    });
    const first = row.firstElementChild;
    if (first?.classList.contains('columns-media-media')) row.classList.add('columns-media-media-first');
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
