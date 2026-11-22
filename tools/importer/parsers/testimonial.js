/* eslint-disable */
/* global WebImporter */

/**
 * testimonial parser.
 * Source: a featuredCTA feature tile used as a single profile
 *   .feature-tile > .feature-tile__image-container img.feature-tile__image (photo)
 *   .feature-tile__content > .feature-tile__title (optional)
 *     > .feature-tile__text: spacer <p><b>&nbsp;</b></p>s, <p><b>Name</b></p>,
 *       bio <p>, quote <p><i>"..."</i><br></p>
 *     > .feature-tile__cta-container a (optional)
 * The cached selector points at the image container, the page mapping may
 * point at the surrounding div.richContentContainer; both resolve to the tile.
 * Block table (blocks/testimonial/testimonial.js): one row,
 * photo cell | text cell (name, bio, quote in italics).
 */

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function findTile(element) {
  if (element.matches('.feature-tile')) return element;
  return element.querySelector('.feature-tile') || element.closest('.feature-tile') || element;
}

function cleanInline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('script, style, svg, [class*="icon"]').forEach((n) => n.remove());
  clone.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
  [clone, ...clone.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
  });
  // drop trailing line breaks
  while (clone.lastChild && (clone.lastChild.nodeName === 'BR'
    || (clone.lastChild.nodeType === 3 && !clone.lastChild.textContent.trim()))) {
    clone.lastChild.remove();
  }
  return clone;
}

export default function parse(element, { document }) {
  const tile = findTile(element);
  const scope = tile; // profile parts live anywhere inside the tile

  // photo
  const imageCell = [];
  const srcImg = scope.querySelector('.feature-tile__image-container img, img.feature-tile__image, img');
  if (srcImg && srcImg.getAttribute('src')) {
    const img = document.createElement('img');
    img.src = srcImg.getAttribute('src');
    img.alt = srcImg.getAttribute('alt') || '';
    imageCell.push(img);
  }

  // text: title (if any), then the copy paragraphs
  const textCell = [];
  const title = scope.querySelector('.feature-tile__title, .feature-tile__title_image');
  if (title && text(title)) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = text(title);
    p.append(strong);
    textCell.push(p);
  }
  const body = scope.querySelector('.feature-tile__text');
  if (body) {
    [...body.children].forEach((child) => {
      if (!text(child) && !child.querySelector('img')) return; // spacer paragraphs
      textCell.push(cleanInline(child));
    });
  }
  scope.querySelectorAll('.feature-tile__cta-container a[href]').forEach((a) => {
    if (!text(a)) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(a);
    p.append(link);
    textCell.push(p);
  });

  const cells = [[imageCell, textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'testimonial', cells });
  // element is the image container inside the tile: drop the tile's copy too
  if (!element.contains(tile)) {
    tile.querySelectorAll('.feature-tile__content').forEach((n) => n.remove());
  }
  element.replaceWith(block);
}
