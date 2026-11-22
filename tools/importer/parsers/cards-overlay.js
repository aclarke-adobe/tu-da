/* eslint-disable */
/* global WebImporter */

/**
 * cards-overlay parser.
 * Sources: div.contentContainer / div.richContentContainer grid of
 * .featuredCTA .feature-tile--with-image tiles: image
 * (.feature-tile__image-container img), title (.feature-tile__title),
 * text (.feature-tile__text), CTA (.feature-tile__cta-container a).
 * Option tinted: tiles whose .feature-tile__mask is a strong colour tint
 * (chromatic background-color, opacity >= 0.5) rather than a black/white/grey wash.
 * Block table (blocks/cards-overlay/cards-overlay.js): one row per tile,
 * image cell | body cell (heading, text, optional link).
 */

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function cleanInline(el) {
  el.querySelectorAll('svg, script, style, .icon').forEach((n) => n.remove());
  el.querySelectorAll('a').forEach((a) => { if (!text(a)) a.remove(); });
  [el, ...el.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
  });
  return el;
}

function isTint(mask) {
  if (!mask) return false;
  const style = mask.getAttribute('style') || '';
  const op = style.match(/opacity\s*:\s*([\d.]+)/i);
  const col = style.match(/background-color\s*:\s*rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!op || !col) return false;
  const [r, g, b] = col.slice(1, 4).map(Number);
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return parseFloat(op[1]) >= 0.5 && chroma > 24;
}

function tileBody(document, tile) {
  const body = [];
  const titleWrap = tile.querySelector('.feature-tile__title');
  const titleText = text(titleWrap);
  if (titleText) {
    const src = titleWrap.querySelector('h1, h2, h3, h4, h5, h6');
    let tag = src ? src.tagName.toLowerCase() : 'h2';
    if (!src) {
      const cls = titleWrap.querySelector('[class^="h"], [class*=" h"]');
      const m = cls && cls.className.match(/\bh([1-6])\b/);
      if (m) tag = `h${m[1]}`;
    }
    const h = document.createElement(tag);
    h.textContent = titleText;
    body.push(h);
  }

  const textWrap = tile.querySelector('.feature-tile__text');
  if (textWrap && text(textWrap)) {
    const blocks = [...textWrap.children].filter((c) => c.matches('p, ul, ol, h1, h2, h3, h4, h5, h6'));
    if (blocks.length) {
      blocks.forEach((b) => { if (text(b)) body.push(cleanInline(b)); });
    } else {
      const p = document.createElement('p');
      p.append(...[...textWrap.childNodes]);
      cleanInline(p);
      // drop a trailing <br>
      while (p.lastChild && p.lastChild.nodeName === 'BR') p.lastChild.remove();
      body.push(p);
    }
  }

  const ctas = [...tile.querySelectorAll('.feature-tile__cta-container a[href]')].filter((a) => text(a));
  if (ctas.length) {
    const p = document.createElement('p');
    ctas.forEach((a, i) => {
      if (i) p.append(' ');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = text(a);
      p.append(link);
    });
    body.push(p);
  }
  return body;
}

export default function parse(element, { document }) {
  const cells = [];

  const tiles = [...element.querySelectorAll('.feature-tile')]
    .filter((t) => !t.parentElement.closest('.feature-tile'));

  let tinted = tiles.length > 0;
  tiles.forEach((tile) => {
    const srcImg = tile.querySelector('.feature-tile__image-container img, img.feature-tile__image');
    let imageCell = '';
    if (srcImg && srcImg.getAttribute('src')) {
      const img = document.createElement('img');
      img.src = srcImg.getAttribute('src');
      img.alt = srcImg.getAttribute('alt') || '';
      imageCell = img;
    }
    if (!isTint(tile.querySelector('.feature-tile__mask'))) tinted = false;
    cells.push([imageCell, tileBody(document, tile)]);
  });

  const name = tinted ? 'cards-overlay (tinted)' : 'cards-overlay';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
