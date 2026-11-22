/*
 * Share Price Chart Block
 * Interactive share price chart with range toggles.
 * Configuration rows (first cell is the key, case-insensitive):
 *   Data    | link to a .json price series ([{date, close}] or an EDS sheet
 *             with Date and Close columns)
 *   Ranges  | range toggles, list or comma-separated
 *             (default: Today, 1 week, 1 mth, 3 mths, 6 mths, 1 yr, 2 yrs, 5 yrs, 10 yrs, All)
 *   Default | the range selected on load (default: 3 mths)
 *   Title   | accessible chart title (default: Share price)
 * Without the line-chart option the line has a light area fill; with
 * `line-chart` it is a plain line over horizontal gridlines.
 */
import { fetchJson, normaliseSeries } from '../../scripts/share-price.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_RANGES = ['Today', '1 week', '1 mth', '3 mths', '6 mths', '1 yr', '2 yrs', '5 yrs', '10 yrs', 'All'];
const DAY = 86400000;

function rangeToMs(label) {
  const l = label.toLowerCase();
  if (l === 'all') return Infinity;
  if (l === 'today') return DAY;
  const n = parseFloat(l) || 1;
  if (/w(ee)?k/.test(l)) return n * 7 * DAY;
  if (/m(o)?n?th|mth/.test(l)) return n * 30.44 * DAY;
  if (/y(ea)?r/.test(l)) return n * 365.25 * DAY;
  if (/d(ay)?/.test(l)) return n * DAY;
  return Infinity;
}

function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const [k, v] = row.children;
    const key = k?.textContent.trim().toLowerCase();
    if (!key || !v) return;
    if (key === 'data') config.data = v.querySelector('a')?.href || v.textContent.trim();
    else if (key === 'ranges') {
      const list = v.querySelectorAll('li');
      config.ranges = (list.length ? [...list].map((li) => li.textContent) : v.textContent.split(','))
        .map((r) => r.trim()).filter(Boolean);
    } else if (key === 'default') config.default = v.textContent.trim();
    else if (key === 'title') config.title = v.textContent.trim();
  });
  return config;
}

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function drawChart(svg, points, { lineOnly, axis }) {
  const w = 1000;
  const h = 300;
  const pad = 8;
  svg.replaceChildren();
  axis.replaceChildren();
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  // the line-chart look keeps its plot frame and gridlines even without data
  if (lineOnly) {
    for (let i = 0; i <= 6; i += 1) {
      const gy = (h / 6) * i;
      svg.append(el('line', {
        x1: 0, x2: w, y1: gy, y2: gy, class: 'share-price-chart-grid',
      }));
    }
  }
  if (points.length < 2) return;

  const min = Math.min(...points.map((p) => p.close));
  const max = Math.max(...points.map((p) => p.close));
  const span = max - min || 1;
  const t0 = points[0].date.getTime();
  const tSpan = points[points.length - 1].date.getTime() - t0 || 1;
  const x = (p) => ((p.date.getTime() - t0) / tSpan) * w;
  const y = (p) => pad + (1 - (p.close - min) / span) * (h - pad * 2);

  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(p).toFixed(1)},${y(p).toFixed(1)}`).join('');
  if (!lineOnly) {
    svg.append(el('path', { d: `${d}L${w},${h}L0,${h}Z`, class: 'share-price-chart-area' }));
  }
  svg.append(el('path', { d, class: 'share-price-chart-line', 'vector-effect': 'non-scaling-stroke' }));

  // price labels on the right-hand axis, one per gridline (top to bottom)
  const top = max + (span * pad) / (h - pad * 2);
  const bottom = min - (span * pad) / (h - pad * 2);
  for (let i = 0; i <= 6; i += 1) {
    const label = document.createElement('li');
    label.textContent = (top - ((top - bottom) / 6) * i).toFixed(2);
    axis.append(label);
  }
}

export default async function decorate(block) {
  const config = readConfig(block);
  const ranges = config.ranges?.length ? config.ranges : DEFAULT_RANGES;
  let active = ranges.find((r) => r.toLowerCase() === (config.default || '3 mths').toLowerCase()) || ranges[0];
  const lineOnly = block.classList.contains('line-chart');
  const title = config.title || 'Share price';

  const toggles = document.createElement('div');
  toggles.className = 'share-price-chart-ranges';
  toggles.setAttribute('role', 'group');
  toggles.setAttribute('aria-label', `${title} range`);

  const figure = document.createElement('figure');
  figure.className = 'share-price-chart-figure';
  const svg = el('svg', {
    role: 'img', 'aria-label': title, preserveAspectRatio: 'none', class: 'share-price-chart-svg',
  });
  const axis = document.createElement('ul');
  axis.className = 'share-price-chart-axis';
  axis.setAttribute('aria-hidden', 'true');
  const caption = document.createElement('figcaption');
  caption.className = 'share-price-chart-summary';
  caption.setAttribute('aria-live', 'polite');
  figure.append(svg, axis, caption);

  block.replaceChildren(toggles, figure);

  const series = normaliseSeries(await fetchJson(config.data));
  if (!series.length) {
    block.classList.add('share-price-chart-empty');
    caption.textContent = config.data ? 'Share price data is currently unavailable.' : '';
  }

  const render = () => {
    const last = series[series.length - 1];
    const from = last ? last.date.getTime() - rangeToMs(active) : 0;
    const points = series.filter((p) => p.date.getTime() >= from);
    drawChart(svg, points, { lineOnly, axis });
    toggles.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.range === active)));
    if (points.length > 1) {
      const first = points[0];
      const end = points[points.length - 1];
      caption.textContent = `${title}, ${active}: ${first.close.toFixed(2)} on ${first.date.toLocaleDateString()} to ${end.close.toFixed(2)} on ${end.date.toLocaleDateString()}.`;
    }
  };

  ranges.forEach((range) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'share-price-chart-range';
    button.dataset.range = range;
    button.textContent = range;
    button.addEventListener('click', () => {
      active = range;
      render();
    });
    toggles.append(button);
  });

  render();
}
