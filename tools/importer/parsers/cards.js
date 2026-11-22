/* eslint-disable */
/* global WebImporter */

/**
 * cards parser — profile tile grids (board of directors, executive committee, investor day
 * speaker bios): AEM `.feature-tile--board` tiles inside a div.richContentContainer grid.
 * Block table (blocks/cards/cards.js), 2 columns per row: image cell (the photo; empty for
 * a tile without one, e.g. the Company Secretary tile) | body cell (name as a heading, linked
 * to the profile page when the tile links somewhere; then the role/bio paragraphs).
 * Rich text in the same component but outside the tiles stays as default content around the block.
 */

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

function bodyNodes(document, container) {
  if (!container) return [];
  const clone = container.cloneNode(true);
  clone.querySelectorAll('script, style, .feature-tile__mask').forEach((n) => n.remove());
  [clone, ...clone.querySelectorAll('*')].forEach((n) => {
    ['style', 'class', 'data-emptytext'].forEach((a) => n.removeAttribute && n.removeAttribute(a));
  });
  // drop empty paragraphs and trailing <br>
  clone.querySelectorAll('p').forEach((p) => { if (!text(p) && !p.querySelector('img, a')) p.remove(); });
  clone.querySelectorAll('p > br:last-child').forEach((br) => br.remove());
  const nodes = [...clone.childNodes].filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
  // bare text and inline elements become paragraphs
  return nodes.map((n) => {
    if (n.nodeType === 3 || !/^(P|UL|OL|H[1-6]|DIV|BLOCKQUOTE)$/.test(n.tagName)) {
      const p = document.createElement('p');
      p.append(n.nodeType === 3 ? document.createTextNode(n.textContent.trim()) : n);
      return p;
    }
    return n;
  });
}

function tileRow(document, tile) {
  const anchor = tile.matches('a[href]') ? tile : tile.closest('a[href]');
  const href = anchor && anchor.getAttribute('href');

  const srcImg = tile.querySelector('.feature-tile__image-container img, img.feature-tile__image');
  let imageCell = '';
  if (srcImg && srcImg.getAttribute('src')) {
    const img = document.createElement('img');
    img.src = srcImg.getAttribute('src');
    img.alt = srcImg.getAttribute('alt') || text(tile.querySelector('.feature-tile__title'));
    imageCell = img;
  }

  const body = [];
  const title = text(tile.querySelector('.feature-tile__title'));
  if (title) {
    const h = document.createElement('h3');
    if (href && !href.startsWith('#')) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = title;
      h.append(a);
    } else {
      h.textContent = title;
    }
    body.push(h);
  }
  body.push(...bodyNodes(document, tile.querySelector('.feature-tile__text')));
  // any other authored content in the tile
  const content = tile.querySelector('.feature-tile__content');
  if (content) {
    [...content.children]
      .filter((c) => !c.matches('.feature-tile__title, .feature-tile__text, .feature-tile__date'))
      .forEach((c) => body.push(...bodyNodes(document, c)));
  }

  // tiles without a title field (investor day speaker bios) lead with the name in bold:
  // make that the card heading so every profile card reads the same way
  if (!title && body[0] && body[0].tagName === 'P' && body[0].children.length === 1
    && /^(STRONG|B)$/.test(body[0].firstElementChild.tagName) && text(body[0]) === text(body[0].firstElementChild)) {
    const h = document.createElement('h3');
    h.textContent = text(body[0]);
    body[0] = h;
  }

  if (!imageCell && !body.length) return null;
  return [imageCell, body.length ? body : ''];
}

export default function parse(element, { document }) {
  const tiles = [...element.querySelectorAll('.feature-tile')]
    .filter((t) => !t.parentElement.closest('.feature-tile'));
  const cells = tiles.map((t) => tileRow(document, t)).filter(Boolean);

  // rich text outside the tiles (intro or closing copy) stays as default content
  const before = [];
  const after = [];
  const firstTile = tiles[0];
  [...element.querySelectorAll('.rich-text')]
    .filter((r) => !r.closest('.feature-tile'))
    .forEach((r) => {
      const nodes = bodyNodes(document, r);
      // eslint-disable-next-line no-bitwise
      const isBefore = firstTile && (r.compareDocumentPosition(firstTile) & 4);
      (isBefore ? before : after).push(...nodes);
    });

  if (!cells.length) {
    if (before.length || after.length) element.replaceWith(...before, ...after);
    return;
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(...before, block, ...after);
}
