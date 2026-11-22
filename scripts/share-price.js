/*
 * Shared share-price helpers used by share-price-quote, share-price-chart and
 * hero-banner (share-price-panel). No live feed is wired by default: authors
 * point a block at a JSON source (an EDS sheet or any endpoint that returns the
 * shapes below). Without a source the authored content is shown as-is.
 */

const cache = new Map();

/**
 * Fetch JSON once per URL.
 * @param {string} url
 * @returns {Promise<object|null>}
 */
export async function fetchJson(url) {
  if (!url) return null;
  if (!cache.has(url)) {
    cache.set(url, fetch(url)
      .then((resp) => (resp.ok ? resp.json() : null))
      .catch(() => null));
  }
  return cache.get(url);
}

const QUOTE_KEYS = {
  code: ['code', 'symbol', 'ticker'],
  price: ['price', 'last', 'lastprice'],
  asAt: ['asat', 'as at', 'date', 'timestamp', 'time'],
  change: ['change'],
  prevClose: ['prevclose', 'prev close', 'previousclose'],
  low: ['low'],
  high: ['high'],
  open: ['open'],
  volume: ['volume'],
};

export const QUOTE_LABELS = {
  change: 'Change',
  prevClose: 'Prev close',
  low: 'Low',
  high: 'High',
  open: 'Open',
  volume: 'Volume',
};

const norm = (key) => String(key).toLowerCase().replace(/[^a-z ]/g, '').trim();

/**
 * Normalise a quote from either a flat object or an EDS sheet
 * ({ data: [{ Key, Value }] } or { data: [{ Code, Price, ... }] }).
 * @param {object} json
 * @returns {object|null} { code, price, asAt, change, prevClose, low, high, open, volume }
 */
export function normaliseQuote(json) {
  if (!json) return null;
  let flat = json;
  if (Array.isArray(json.data)) {
    const rows = json.data;
    const isKeyValue = rows.length && ('Key' in rows[0] || 'key' in rows[0]);
    flat = isKeyValue
      ? Object.fromEntries(rows.map((r) => [r.Key ?? r.key, r.Value ?? r.value]))
      : rows[0] || {};
  }
  const lookup = Object.fromEntries(Object.entries(flat).map(([k, v]) => [norm(k), v]));
  const quote = {};
  Object.entries(QUOTE_KEYS).forEach(([field, aliases]) => {
    const hit = aliases.find((a) => lookup[norm(a)] !== undefined && lookup[norm(a)] !== '');
    if (hit) quote[field] = String(lookup[norm(hit)]);
  });
  return Object.keys(quote).length ? quote : null;
}

/**
 * Normalise a price series to [{ date: Date, close: number }], oldest first.
 * Accepts [{date, close}], { data: [{ Date, Close }] } or { series: [...] }.
 * @param {object|Array} json
 * @returns {Array<{date: Date, close: number}>}
 */
export function normaliseSeries(json) {
  if (!json) return [];
  let rows = json;
  if (!Array.isArray(rows)) rows = json.data || json.series || [];
  return rows
    .map((r) => {
      const entries = Object.fromEntries(Object.entries(r).map(([k, v]) => [norm(k), v]));
      const date = new Date(entries.date ?? entries.time ?? entries.timestamp);
      const close = parseFloat(entries.close ?? entries.price ?? entries.value);
      return { date, close };
    })
    .filter((p) => !Number.isNaN(p.date.getTime()) && !Number.isNaN(p.close))
    .sort((a, b) => a.date - b.date);
}

/**
 * Direction of a change value: 'up', 'down' or 'flat'.
 * @param {string} change
 */
export function changeDirection(change) {
  const n = parseFloat(String(change || '').replace(/[^0-9.+-]/g, ''));
  if (Number.isNaN(n) || n === 0) return 'flat';
  return n > 0 ? 'up' : 'down';
}

/**
 * Find a JSON data-source link inside an element and remove its paragraph.
 * @param {Element} el
 * @returns {string|null}
 */
export function takeDataSource(el) {
  const link = [...el.querySelectorAll('a[href]')]
    .find((a) => /\.json$/i.test(new URL(a.href, window.location.href).pathname));
  if (!link) return null;
  const { href } = link;
  const holder = link.closest('p') || link;
  holder.remove();
  return href;
}
