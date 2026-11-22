/* eslint-disable */
/* global WebImporter */

/**
 * cards-icon parser.
 * Sources (div.richContentContainer grid):
 *   - .featuredImageCTA .feature-tile: icon (.feature-tile__image-container img),
 *     title (.feature-tile__title / .feature-tile__title_image), text <p>s,
 *     CTA (.feature-tile__cta-container a)
 *   - option tiles: filled tiles (no image, coloured .feature-tile__content,
 *     whole tile wrapped in a.feature-tile-anchor, icon as span.icon--<name>)
 *   - fallback: grid columns without tiles (e.g. investor calendar / ASX
 *     releases / reporting summary) become text-only items.
 *   - tile text wrapped by a.feature-tile-anchor keeps that link (on the title,
 *     else on the wrapped paragraphs); .rich-text outside the tiles/columns is
 *     emitted as default content before (or after) the block.
 * Block table (blocks/cards-icon/cards-icon.js): one row per item,
 * icon cell | body cell (title, optional text, optional link).
 */

const ICON_MODIFIERS = /^icon--(white|black|small|medium|large|arrow-right|arrow-left)$/;

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function link(document, href, label) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  return a;
}

function para(document, ...children) {
  const p = document.createElement('p');
  p.append(...children);
  return p;
}

/** Copy of a paragraph keeping text, links and inline formatting, minus icons/empty anchors. */
function cleanInline(document, el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('svg, script, style, [class*="icon"]').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => { if (!text(a)) a.remove(); });
  [clone, ...clone.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
    n.removeAttribute('role');
  });
  return clone;
}

function iconFor(document, tile) {
  const img = tile.querySelector('.feature-tile__image-container img, img.feature-tile__image');
  if (img && img.getAttribute('src')) {
    const out = document.createElement('img');
    out.src = img.getAttribute('src');
    out.alt = img.getAttribute('alt') || '';
    return out;
  }
  const span = tile.querySelector('span[class*="icon--"]');
  if (span) {
    const name = [...span.classList]
      .filter((c) => c.startsWith('icon--') && !ICON_MODIFIERS.test(c))
      .map((c) => c.slice(6))[0];
    if (name) return para(document, `:${name}:`);
  }
  return '';
}

/** Feature-tile shape the block decorates itself: heading + one short plain-link paragraph. */
function isFeatureShape(body) {
  if (body.length !== 2 || !/^H[1-6]$/.test(body[0].tagName) || body[1].tagName !== 'P') return false;
  const links = body[1].querySelectorAll('a');
  return links.length === 1 && text(links[0]) === text(body[1]) && text(links[0]).length <= 40;
}

function tileBody(document, tile) {
  const body = [];
  const titleEl = tile.querySelector('.feature-tile__title, .feature-tile__title_image');
  const titleText = text(titleEl);
  const anchor = (titleEl && titleEl.closest('a.feature-tile-anchor[href]'))
    || tile.querySelector('a.feature-tile-anchor[href]');

  const content = tile.querySelector('.feature-tile__content') || tile;
  const paras = [...content.querySelectorAll('p, ul, ol')]
    .filter((p) => !p.closest('.feature-tile__cta-container') && !p.parentElement.closest('p, ul, ol'))
    .map((p) => ({ src: p, el: cleanInline(document, p) }))
    .filter(({ el }) => text(el));

  const ctas = [...tile.querySelectorAll('.feature-tile__cta-container a[href]')]
    .filter((a) => text(a))
    .map((a) => para(document, link(document, a.getAttribute('href'), text(a))));

  let h = null;
  if (titleText) {
    h = document.createElement('h3');
    h.textContent = titleText;
  }
  const plain = [...(h ? [h] : []), ...paras.map(({ el }) => el), ...ctas];
  // feature tile (title + one short CTA): the block links the title itself
  // ...and a lone body link to the same page already carries the title's link
  const bodyLinks = plain.slice(h ? 1 : 0).flatMap((el) => [...el.querySelectorAll('a[href]')]);
  const redundant = anchor && bodyLinks.length === 1
    && bodyLinks[0].getAttribute('href') === anchor.getAttribute('href');
  const linkTitle = h && anchor && !redundant && !isFeatureShape(plain);
  if (linkTitle) h.replaceChildren(link(document, anchor.getAttribute('href'), titleText));

  // text wrapped by the tile anchor (no own link) keeps that link, unless the title carries it
  paras.forEach(({ src, el }) => {
    const wrap = src.closest('a.feature-tile-anchor[href]');
    if (!wrap || linkTitle || el.querySelector('a') || el.tagName !== 'P') return;
    const a = link(document, wrap.getAttribute('href'), '');
    a.append(...el.childNodes);
    el.append(a);
  });

  if (h) body.push(h);
  body.push(...paras.map(({ el }) => el), ...ctas);
  return body;
}

/** Rich text in the component but outside the tiles/columns: default content around the block. */
function introContent(document, element, items) {
  const before = [];
  const after = [];
  if (!items.length) return { before, after };
  const first = items[0];
  [...element.querySelectorAll('.rich-text')]
    .filter((rt) => !rt.parentElement.closest('.rich-text') && !items.some((i) => i.contains(rt)))
    .forEach((rt) => {
      const out = [];
      [...rt.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
        .filter((n) => !n.parentElement.closest('h1, h2, h3, h4, h5, h6, p, ul, ol'))
        .forEach((n) => {
          const c = cleanInline(document, n);
          if (text(c)) out.push(c);
        });
      // eslint-disable-next-line no-bitwise
      const isBefore = rt.compareDocumentPosition(first) & 4; // first follows rt
      (isBefore ? before : after).push(...out);
    });
  return { before, after };
}

/** Text-only column content (no feature tile), flattened in document order. */
function columnBody(document, col) {
  const out = [];
  let releases = null;
  const walk = (node) => {
    [...node.children].forEach((el) => {
      if (el.matches('script, style, svg, template')) return;
      if (/^H[1-6]$/.test(el.tagName)) {
        if (text(el)) {
          const h = document.createElement(el.tagName.toLowerCase());
          h.textContent = text(el);
          out.push(h);
        }
        return;
      }
      if (el.matches('.ec-calendar__list__item__title')) {
        if (text(el)) {
          const strong = document.createElement('strong');
          strong.textContent = text(el);
          out.push(para(document, strong));
        }
        return;
      }
      if (el.matches('.results-list__item')) {
        if (!releases) {
          releases = document.createElement('ul');
          out.push(releases);
        }
        const li = document.createElement('li');
        const date = text(el.querySelector('.results-list__item__date'));
        const title = text(el.querySelector('.results-list__item__title'));
        li.textContent = [date, title].filter(Boolean).join(' – ');
        if (li.textContent) releases.append(li);
        return;
      }
      if (el.matches('p, ul, ol')) {
        const c = cleanInline(document, el);
        if (text(c)) out.push(c);
        return;
      }
      if (el.matches('a[href]')) {
        if (text(el)) out.push(para(document, link(document, el.getAttribute('href'), text(el))));
        return;
      }
      walk(el);
    });
  };
  walk(col);
  return out;
}

export default function parse(element, { document }) {
  const cells = [];

  const tiles = [...element.querySelectorAll('.feature-tile')]
    .filter((t) => !t.parentElement.closest('.feature-tile'));

  let isTiles = false;
  let intro = { before: [], after: [] };
  if (tiles.length) {
    isTiles = tiles.every((t) => {
      const content = t.querySelector('.feature-tile__content');
      const hasImage = !!t.querySelector('.feature-tile__image-container img');
      const filled = content && /background-color/i.test(content.getAttribute('style') || '');
      const wrapped = content && content.parentElement.matches('a.feature-tile-anchor');
      return !hasImage && (filled || wrapped);
    });
    tiles.forEach((t) => {
      cells.push([iconFor(document, t), tileBody(document, t)]);
    });
    intro = introContent(document, element, tiles);
  } else {
    const cols = [...element.querySelectorAll('.gridItem')]
      .filter((g) => !g.parentElement.closest('.gridItem'));
    (cols.length ? cols : [element]).forEach((col) => {
      const body = columnBody(document, col);
      if (body.length) cells.push(['', body]);
    });
    if (cols.length) intro = introContent(document, element, cols);
  }

  const name = isTiles ? 'cards-icon (tiles)' : 'cards-icon';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(...intro.before, block, ...intro.after);
}
