/*
 * Hero Banner Block
 * Page-opening photo hero. Rows/cells (any order):
 *   - background image (a cell holding only a picture)
 *   - content (heading, optional text, optional CTA links)
 * Option `share-price-panel`: an extra content cell becomes a side panel
 * showing a share price summary (heading, price, as-at, stats list). If that
 * cell holds a link to a .json quote source, the values are filled from it.
 * Option `featured`: tall hero (also applied automatically when the content has
 * more than a heading). Option `callout`: compact photo strip with a small h2 and CTA.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  fetchJson, normaliseQuote, changeDirection, takeDataSource, QUOTE_LABELS,
} from '../../scripts/share-price.js';

const PRICE_RE = /^\$?\s*[\d,]+(\.\d+)?$/;

/** Turns paragraphs holding only links into pill CTAs (source shows them as buttons). */
function decorateCtas(content) {
  content.querySelectorAll(':scope > p').forEach((p) => {
    const links = [...p.querySelectorAll('a[href]')];
    if (!links.length) return;
    const linkText = links.map((a) => a.textContent).join('').replace(/\s/g, '');
    if (p.textContent.replace(/\s/g, '') !== linkText) return;
    p.classList.add('button-wrapper', 'hero-banner-ctas');
    links.forEach((a) => {
      if (!a.classList.contains('button')) a.classList.add('button', 'primary');
    });
  });
}

/**
 * Picks the look from the content (source: slim page-title .content-banner vs
 * .content-banner--featured vs photo module with a foreground logo):
 *  - foreground image(s) only (e.g. a campaign logo) -> hero-banner-image: the photo
 *    keeps its own proportions and the logo sits on it
 *  - anything beyond the heading (text, sub-heading, CTA) -> featured (tall hero)
 *  - heading only -> slim page-title banner, unless authored as `featured`
 * Foreground images are marked hero-banner-logo and shown at natural size.
 */
function classifyLook(block, content, withPanel) {
  const nodes = [...content.children];
  const isMedia = (el) => el.matches('picture, img') || (!!el.querySelector('picture, img') && !el.textContent.trim());
  const media = nodes.filter(isMedia);
  media.forEach((el) => el.classList.add('hero-banner-logo'));
  if (media.length && media.length === nodes.length) {
    block.classList.add('hero-banner-image');
    return;
  }
  if (media.length || withPanel) return;
  if (['share-price-panel', 'callout'].some((c) => block.classList.contains(c))) return;
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  if (nodes.some((n) => n !== heading && n.textContent.trim())) block.classList.add('featured');
}

function priceEl(value, change) {
  const price = document.createElement('p');
  price.className = 'hero-banner-panel-price';
  price.dataset.direction = changeDirection(change);
  const currency = document.createElement('span');
  currency.className = 'hero-banner-panel-currency';
  currency.textContent = '$';
  price.append(currency, String(value).replace(/^\$\s*/, ''));
  return price;
}

function statsEl(entries) {
  const list = document.createElement('ul');
  list.className = 'hero-banner-panel-stats';
  entries.forEach(([label, value]) => {
    const li = document.createElement('li');
    const l = document.createElement('span');
    l.className = 'hero-banner-panel-label';
    l.textContent = label;
    const v = document.createElement('span');
    v.className = 'hero-banner-panel-value';
    v.textContent = value;
    li.append(l, v);
    list.append(li);
  });
  return list;
}

/** Restructures the authored panel cell into heading / price / as-at / stats / link. */
function decoratePanel(panel) {
  const nodes = [...panel.children];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  heading?.classList.add('hero-banner-panel-title');

  const list = nodes.find((n) => n.tagName === 'UL');
  const entries = list ? [...list.children].map((li) => {
    const text = li.textContent.trim();
    const i = text.indexOf(':');
    return i > -1 ? [text.slice(0, i).trim(), text.slice(i + 1).trim()] : [text, ''];
  }) : [];
  const change = entries.find(([label]) => /^change$/i.test(label))?.[1];
  if (list) list.replaceWith(statsEl(entries));

  nodes.filter((n) => n.tagName === 'P').forEach((p) => {
    const text = p.textContent.trim();
    const link = p.querySelector('a[href]');
    if (link && text === link.textContent.trim()) {
      // source: the whole tile links to the share price page
      p.className = 'hero-banner-panel-link';
      link.className = '';
    } else if (PRICE_RE.test(text)) {
      p.replaceWith(priceEl(text, change));
    } else if (/^as at/i.test(text)) {
      p.className = 'hero-banner-panel-asat';
    }
  });
}

function renderQuote(panel, quote) {
  const heading = panel.querySelector('.hero-banner-panel-title');
  const link = panel.querySelector('.hero-banner-panel-link');
  const asAt = document.createElement('p');
  asAt.className = 'hero-banner-panel-asat';
  asAt.textContent = quote.asAt ? `As at ${quote.asAt}` : '';
  const entries = Object.entries(QUOTE_LABELS)
    .filter(([key]) => quote[key] !== undefined)
    .map(([key, label]) => [label, quote[key]]);
  panel.replaceChildren(...[
    heading, priceEl(quote.price ?? '', quote.change), asAt, statsEl(entries), link,
  ].filter(Boolean));
}

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const imageCell = cells.find((c) => c.querySelector('picture') && c.textContent.trim() === '');
  const contentCells = cells
    .filter((c) => c !== imageCell && (c.textContent.trim() || c.children.length));
  const withPanel = block.classList.contains('share-price-panel') && contentCells.length > 1;

  const media = document.createElement('div');
  media.className = 'hero-banner-media';
  if (imageCell) {
    const pic = imageCell.querySelector('picture');
    const img = pic.querySelector('img');
    const url = new URL(img.src, window.location.href);
    if (url.origin === window.location.origin && !/\.svg$/i.test(url.pathname)) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [{ media: '(width >= 900px)', width: '2000' }, { width: '900' }]);
      optimized.querySelector('img').fetchPriority = 'high';
      media.append(optimized);
    } else {
      img.loading = 'eager';
      media.append(pic);
    }
  }

  const content = document.createElement('div');
  content.className = 'hero-banner-content';
  const mainCells = withPanel ? contentCells.slice(0, -1) : contentCells;
  mainCells.forEach((c) => content.append(...c.childNodes));
  decorateCtas(content);
  classifyLook(block, content, withPanel);

  const inner = document.createElement('div');
  inner.className = 'hero-banner-inner';
  inner.append(content);

  let panel;
  let source;
  if (withPanel) {
    panel = document.createElement('div');
    panel.className = 'hero-banner-panel';
    panel.setAttribute('aria-live', 'polite');
    const panelCell = contentCells[contentCells.length - 1];
    source = takeDataSource(panelCell);
    panel.append(...panelCell.childNodes);
    decoratePanel(panel);
    inner.append(panel);
  }

  block.replaceChildren(...[imageCell ? media : null, inner].filter(Boolean));
  if (!imageCell) block.classList.add('hero-banner-no-image');

  if (panel && source) {
    const quote = normaliseQuote(await fetchJson(source));
    if (quote) renderQuote(panel, quote);
  }
}
