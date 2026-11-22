/*
 * Author Bio Block
 * One row: headshot cell, text cell (name heading, bio, social link).
 * Cells may come in either order; a missing headshot is allowed.
 */
import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const imageCell = cells.find((c) => c.querySelector('picture') && c.textContent.trim() === '');
  const textCells = cells.filter((c) => c !== imageCell);

  const card = document.createElement('div');
  card.className = 'author-bio-card';

  if (imageCell) {
    imageCell.className = 'author-bio-image';
    card.append(imageCell);
  }

  const body = document.createElement('div');
  body.className = 'author-bio-body';
  textCells.forEach((c) => body.append(...c.childNodes));

  const first = body.firstElementChild;
  if (first && !/^H[1-6]$/.test(first.tagName)) first.classList.add('author-bio-name');

  body.querySelectorAll('a[href]').forEach((a) => {
    const network = ['linkedin', 'twitter', 'x.com', 'facebook', 'instagram']
      .find((n) => a.href.toLowerCase().includes(n));
    if (network) {
      a.classList.add('author-bio-social', `author-bio-social-${network.replace('.com', '')}`);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      if (network === 'linkedin' && !a.parentElement.querySelector('.icon-linkedin')) {
        const icon = document.createElement('span');
        icon.className = 'icon icon-linkedin author-bio-social-icon';
        a.before(icon);
      }
    }
  });
  card.append(body);

  card.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });

  decorateIcons(card);
  block.replaceChildren(card);
}
