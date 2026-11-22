/*
 * Share Price Quote Block
 * Stock quote summary: code, price, as-at time and trading stats.
 * Rows (first cell is the key, case-insensitive):
 *   Code       | TCL
 *   Price      | 14.67
 *   As at      | 20 Nov 2026 12:38
 *   Change | Prev close | Low | High | Open | Volume  -> one row each
 *   Data       | optional link to a .json quote source; when present its
 *                values replace the authored ones (authored values stay as
 *                the fallback if the fetch fails)
 * Unrecognised rows are kept as a note under the quote.
 */
import {
  fetchJson, normaliseQuote, changeDirection, QUOTE_LABELS,
} from '../../scripts/share-price.js';

// Movement triangles from the source (25x25 box, drawn in currentColor).
const ARROW_SVG = (d) => `<svg class="share-price-quote-arrow" viewBox="0 0 25 25" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/></svg>`;
const ARROWS = {
  up: ARROW_SVG('M7.457 15.625a.5.5 0 01-.353-.854l5.042-5.042a.5.5 0 01.708 0l5.042 5.042a.5.5 0 01-.353.854H7.457z'),
  down: ARROW_SVG('M17.543 9.375a.5.5 0 01.353.854l-5.042 5.042a.5.5 0 01-.708 0L7.104 10.23a.5.5 0 01.353-.854h10.086z'),
};

function readAuthored(block) {
  const rows = {};
  const notes = [];
  let source;
  [...block.children].forEach((row) => {
    const [k, v] = row.children;
    const key = k?.textContent.trim();
    if (!key) return;
    if (/^data$/i.test(key)) {
      source = v?.querySelector('a')?.href || v?.textContent.trim();
    } else if (v) {
      rows[key] = v.textContent.trim();
    } else {
      notes.push(k);
    }
  });
  return { quote: normaliseQuote(rows) || {}, notes, source };
}

function render(block, quote, notes) {
  const code = document.createElement('p');
  code.className = 'share-price-quote-code';
  code.textContent = quote.code || '';

  const main = document.createElement('div');
  main.className = 'share-price-quote-main';
  const price = document.createElement('p');
  price.className = 'share-price-quote-price';
  price.dataset.direction = changeDirection(quote.change);
  const currency = document.createElement('span');
  currency.className = 'share-price-quote-currency';
  currency.textContent = '$';
  const value = document.createElement('span');
  value.className = 'share-price-quote-value';
  value.textContent = (quote.price || '').replace(/^\$/, '');
  price.append(currency, value);
  const arrow = ARROWS[price.dataset.direction];
  if (arrow) price.insertAdjacentHTML('beforeend', arrow);
  const asAt = document.createElement('p');
  asAt.className = 'share-price-quote-asat';
  asAt.textContent = quote.asAt ? `As at ${quote.asAt}` : '';
  main.append(price, asAt);

  const stats = document.createElement('dl');
  stats.className = 'share-price-quote-stats';
  Object.entries(QUOTE_LABELS).forEach(([key, label]) => {
    if (quote[key] === undefined) return;
    const item = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = quote[key];
    item.append(dt, dd);
    stats.append(item);
  });

  const tile = document.createElement('div');
  tile.className = 'share-price-quote-tile';
  tile.append(code, main, stats);
  if (notes.length) {
    const note = document.createElement('div');
    note.className = 'share-price-quote-note';
    notes.forEach((n) => note.append(...n.childNodes));
    tile.append(note);
  }
  block.replaceChildren(tile);
}

export default async function decorate(block) {
  block.setAttribute('aria-live', 'polite');
  const { quote, notes, source } = readAuthored(block);
  render(block, quote, notes);
  if (source) {
    const live = normaliseQuote(await fetchJson(source));
    if (live) render(block, { ...quote, ...live }, []);
  }
}
