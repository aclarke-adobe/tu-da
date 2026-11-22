/* eslint-disable */
/* global WebImporter */

/**
 * author-bio parser.
 * Source (news articles): div.richContentContainer holding two .featuredImageCTA
 * feature tiles in a grid row:
 *   - tile 1: .feature-tile__image-container img.feature-tile__image (headshot)
 *   - tile 2: .helper-text-large-bold / .feature-tile__title (author name) and a
 *     <div> of <p>s (role/bio, optional "Follow X on LinkedIn" link + icon img)
 * Block table (blocks/author-bio/author-bio.js): one row,
 * headshot image cell | text cell (name, bio paragraphs, social link).
 */

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

export default function parse(element, { document }) {
  const cells = [];

  // headshot: the first real feature-tile image (not the LinkedIn icon)
  // name: first non-empty title element across the tiles
  const nameEl = [...element.querySelectorAll('.helper-text-large-bold, .feature-tile__title, .feature-tile__title_image')]
    .find((el) => text(el));
  const name = text(nameEl);

  // the source alt is often copied from another author's tile (e.g. "Jeremy
  // Nassau" on Robert Deans' headshot), so describe the headshot by the name
  const headshotSrc = [...element.querySelectorAll('.feature-tile__image-container img, img.feature-tile__image')]
    .find((img) => img.getAttribute('src'));
  let imageCell = '';
  if (headshotSrc) {
    const img = document.createElement('img');
    img.src = headshotSrc.getAttribute('src');
    img.alt = name.replace(/^by\s+/i, '') || headshotSrc.getAttribute('alt') || '';
    imageCell = img;
  }

  const body = [];
  if (name) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = name;
    p.append(strong);
    body.push(p);
  }

  // bio paragraphs: <p>s inside the tile contents (excluding the name element)
  const seen = new Set();
  element.querySelectorAll('.feature-tile__content p').forEach((src) => {
    if (nameEl && nameEl.contains(src)) return;
    if (seen.has(src)) return;
    seen.add(src);
    const p = src.cloneNode(true);
    // drop decorative icons (e.g. linkedin.png) and line breaks next to them
    p.querySelectorAll('img, svg, br, script, style').forEach((n) => n.remove());
    [p, ...p.querySelectorAll('*')].forEach((n) => {
      n.removeAttribute('style');
      n.removeAttribute('class');
      n.removeAttribute('target');
    });
    p.querySelectorAll('a').forEach((a) => { if (!text(a) || !a.getAttribute('href')) a.replaceWith(...a.childNodes); });
    // trim whitespace/&nbsp; spacers left where the icon was
    [p.firstChild, p.lastChild].forEach((n) => {
      if (n && n.nodeType === 3) n.textContent = n.textContent.replace(/^[\s ]+|[\s ]+$/g, '');
    });
    if (!text(p)) return;
    body.push(p);
  });

  cells.push([imageCell, body.length ? body : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'author-bio', cells });
  element.replaceWith(block);
}
