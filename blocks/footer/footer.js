/*
 * Footer block
 * Reads the footer fragment (content/footer.plain.html locally, /footer.plain.html
 * on DA/EDS) and lays it out. All copy, links and images come from the fragment;
 * each top-level section is classified by its content:
 *   social  - a list whose links contain only images
 *   quote   - a share price (a price paragraph and/or a .json data link)
 *   legal   - paragraphs of plain text (copyright), optionally with a logo/links
 *   links   - any other list of links
 */
import { fetchJson, normaliseQuote, takeDataSource } from '../../scripts/share-price.js';

const PRICE_PATTERN = /^\$?\s*\d[\d,]*(\.\d+)?$/;

/**
 * Fetch the footer fragment. Metadata-independent: /content first (local
 * preview), then the site root (DA/EDS).
 * @returns {Promise<Document|null>}
 */
async function fetchFooterFragment() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  // resolve relative media against the fragment URL, not the current page
  doc.querySelectorAll('img[src], source[srcset]').forEach((el) => {
    const attr = el.hasAttribute('src') ? 'src' : 'srcset';
    const value = el.getAttribute(attr);
    if (!/^([a-z]+:|\/)/i.test(value)) el.setAttribute(attr, new URL(value, resp.url).href);
  });
  return doc;
}

const isImageOnlyLink = (a) => a.querySelector('img, picture, svg') && !a.textContent.trim();

const isExternal = (a) => {
  try {
    return new URL(a.href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Classify a fragment section by its content.
 * @param {Element} section
 * @returns {'social'|'quote'|'legal'|'links'}
 */
function classifySection(section) {
  const links = [...section.querySelectorAll('a')];
  const paragraphs = [...section.querySelectorAll(':scope > p')];
  const hasDataLink = links.some((a) => /\.json$/i.test(new URL(a.href, window.location.href).pathname));
  if (hasDataLink || paragraphs.some((p) => PRICE_PATTERN.test(p.textContent.trim()))) return 'quote';
  if (links.length && links.every(isImageOnlyLink)) return 'social';
  const hasPlainText = paragraphs.some((p) => !p.querySelector('a') && p.textContent.trim());
  if (hasPlainText) return 'legal';
  return 'links';
}

function decorateLinks(container) {
  container.querySelectorAll('a[href]').forEach((a) => {
    if (isExternal(a)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    if (isImageOnlyLink(a)) {
      const img = a.querySelector('img');
      if (img?.alt && !a.getAttribute('aria-label')) a.setAttribute('aria-label', img.alt);
    }
  });
}

function buildList(section, className) {
  const list = section.querySelector('ul, ol') || document.createElement('ul');
  if (!list.children.length) {
    section.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      li.append(a);
      list.append(li);
    });
  }
  list.className = className;
  return list;
}

function buildLegal(section) {
  const bar = document.createElement('div');
  bar.className = 'footer-legal';
  [...section.querySelectorAll(':scope > p')].forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('img')) return;
    const imageLink = [...p.querySelectorAll('a')].find(isImageOnlyLink);
    if (imageLink && p.querySelectorAll('a').length === 1 && !p.textContent.trim()) {
      p.className = 'footer-logo';
    } else if (p.querySelector('a')) {
      p.className = 'footer-legal-links';
    } else {
      p.className = 'footer-copyright';
    }
    bar.append(p);
  });
  return bar;
}

function renderQuote(tile, values) {
  const set = (cls, text) => {
    if (text === undefined) return;
    const el = tile.querySelector(`.${cls}`);
    if (el) el.textContent = text;
  };
  set('footer-quote-code', values.code);
  if (values.price !== undefined) {
    set('footer-quote-price', `$${String(values.price).replace(/^\$/, '')}`);
  }
  set('footer-quote-asat', values.asAt);
}

function buildQuote(section) {
  const source = takeDataSource(section);
  const paragraphs = [...section.querySelectorAll(':scope > p')].filter((p) => p.textContent.trim());
  const link = section.querySelector('a[href]');
  const priceIndex = paragraphs.findIndex((p) => PRICE_PATTERN.test(p.textContent.trim()));
  const code = paragraphs.find((p, i) => i < priceIndex || (priceIndex < 0 && i === 0));
  const price = priceIndex >= 0 ? paragraphs[priceIndex] : null;
  const asAt = paragraphs.find((p) => p !== code && p !== price);

  const tile = document.createElement(link ? 'a' : 'div');
  tile.className = 'footer-quote';
  if (link) {
    tile.href = link.getAttribute('href');
    if (link.title) tile.title = link.title;
  }
  [[code, 'footer-quote-code'], [price, 'footer-quote-price'], [asAt, 'footer-quote-asat']]
    .forEach(([p, cls]) => {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = p ? p.textContent.trim() : '';
      tile.append(span);
    });

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-aside';
  wrapper.setAttribute('aria-live', 'polite');
  wrapper.append(tile);

  if (source) {
    fetchJson(source).then((json) => {
      const quote = normaliseQuote(json);
      if (quote) renderQuote(tile, quote);
    });
  }
  return wrapper;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const doc = await fetchFooterFragment();
  if (!doc) return;

  const inner = document.createElement('div');
  inner.className = 'footer-inner';
  const main = document.createElement('div');
  main.className = 'footer-main';
  const asides = [];

  [...doc.body.children].filter((el) => el.tagName === 'DIV').forEach((section) => {
    const type = classifySection(section);
    if (type === 'social') main.append(buildList(section, 'footer-social'));
    else if (type === 'links') main.append(buildList(section, 'footer-links'));
    else if (type === 'legal') main.append(buildLegal(section));
    else asides.push(buildQuote(section));
  });

  inner.append(main, ...asides);
  decorateLinks(inner);
  block.replaceChildren(inner);
}
