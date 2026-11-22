/*
 * Cards News Block
 * One row per news teaser: image cell, body cell (date, headline, excerpt,
 * link). The first short paragraph that parses as a date is marked as the
 * date. When every link in a card points to the same article, the whole card
 * becomes that link (as on the source site); otherwise the headline link is
 * stretched over the card.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const DATE_RE = /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$|^[A-Za-z]+\s+\d{1,2},?\s+\d{4}$|^\d{4}-\d{2}-\d{2}$/;

function linkCard(li) {
  const links = [...li.querySelectorAll('a[href]')];
  if (!links.length) return;
  const primary = li.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a') || links[0];
  const hrefs = new Set(links.map((a) => a.href));

  if (hrefs.size === 1) {
    const cardLink = document.createElement('a');
    cardLink.href = primary.getAttribute('href');
    if (primary.target) cardLink.target = primary.target;
    if (primary.rel) cardLink.rel = primary.rel;
    cardLink.className = 'cards-news-card-link';
    links.forEach((a) => {
      // drop link-only paragraphs (e.g. "Read more") and unwrap inline links
      const parent = a.parentElement;
      const linkOnly = parent && parent !== li && parent.tagName === 'P'
        && parent.textContent.trim() === a.textContent.trim()
        && !parent.classList.contains('cards-news-card-date');
      if (linkOnly && !parent.closest('h1, h2, h3, h4, h5, h6')) {
        const container = parent.closest('.button-container') || parent;
        container.remove();
      } else {
        a.replaceWith(...a.childNodes);
      }
    });
    // keep words apart in the link's text (authored cells have no whitespace between blocks)
    li.querySelectorAll('.cards-news-card-body > *').forEach((el) => el.after(' '));
    cardLink.append(...li.childNodes);
    li.append(cardLink);
    return;
  }

  li.classList.add('cards-news-card-linked');
  primary.classList.add('cards-news-card-link');
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-news-card';
    [...row.children].forEach((cell) => {
      if (!cell.children.length && cell.textContent.trim() === '') return;
      const imageOnly = cell.querySelector('picture, img') && cell.textContent.trim() === '';
      cell.className = imageOnly ? 'cards-news-card-image' : 'cards-news-card-body';
      li.append(cell);
    });
    if (!li.children.length) return;

    const body = li.querySelector('.cards-news-card-body');
    if (body) {
      const date = [...body.querySelectorAll('p')].find((p) => DATE_RE.test(p.textContent.trim()));
      if (date) date.classList.add('cards-news-card-date');
    }

    linkCard(li);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
