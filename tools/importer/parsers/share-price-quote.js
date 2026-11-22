/* eslint-disable */
/* global WebImporter */

/**
 * share-price-quote parser.
 * Source: div.richContentContainer:has(.featuredshareprice) > .investor-tile:
 * code (.investor-tile__title), price (.investor-tile__share-price .price),
 * as-at (.investor-tile__share-price-update-time), stats
 * (.investor-tile__share-info .share-info-item .label / .value).
 * Block table (blocks/share-price-quote/share-price-quote.js): key/value rows
 * Code, Price, As at, Change, Prev close, Low, High, Open, Volume.
 */

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

/** yourir numbers are split over spans; join without spaces. */
function num(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, '').trim();
}

export default function parse(element, { document }) {
  const cells = [];
  const tile = element.querySelector('.investor-tile') || element;

  const code = text(tile.querySelector('.investor-tile__title'));
  if (code) cells.push(['Code', code]);

  const price = num(tile.querySelector('.investor-tile__share-price .price, .investor-tile__share-price [data-yourir="price"]'));
  if (price) cells.push(['Price', price]);

  const asAtEl = tile.querySelector('.investor-tile__share-price-update-time');
  const asAt = text(asAtEl).replace(/^as at\s*/i, '');
  if (asAt) cells.push(['As at', asAt]);

  tile.querySelectorAll('.investor-tile__share-info .share-info-item').forEach((item) => {
    const label = text(item.querySelector('.label'));
    if (!label) return;
    cells.push([label, num(item.querySelector('.value'))]);
  });

  // a link out of the tile (e.g. to the share price page) is kept as a note row
  const href = tile.matches('a[href]') ? tile.getAttribute('href') : null;
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = 'View share price';
    cells.push([a]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'share-price-quote', cells });
  element.replaceWith(block);
}
