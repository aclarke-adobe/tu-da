/* eslint-disable */
/* global WebImporter */

/**
 * columns-media parser.
 * Source: div.richContentContainer > .module (optional background-color) >
 *   .grid > .grid__row > .gridItem > .grid__column > .richtext .rich-text.
 *   One grid column is text (anchor, h2, paragraphs, lists, links, logos,
 *   sometimes a .scrolltable of icon + label rows), the other is an image
 *   (often preceded by an empty <p>&nbsp;</p>). Either order.
 * Block table (blocks/columns-media/columns-media.js): one row per
 * .grid__row, text cell | media cell in source order.
 * Variant: 'columns-media (boxed)' when the module sits on a dark filled
 * panel (e.g. background-color #0b4c45); light grey or no background is the
 * plain variant.
 */

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

/** Turn a (scroll)table inside a column into a list: blocks must not nest. */
function tableToList(document, table) {
  const ul = document.createElement('ul');
  [...table.querySelectorAll('tr')].forEach((tr) => {
    const cells = [...tr.children];
    if (cells.length === 1 && cells[0].tagName === 'TH') return; // nested block header row
    const li = document.createElement('li');
    cells.forEach((td) => {
      td.querySelectorAll('img').forEach((img) => li.append(img));
      const t = text(td);
      if (t) {
        if (li.childNodes.length) li.append(' ');
        li.append(t);
      }
    });
    if (li.childNodes.length) ul.append(li);
  });
  return ul;
}

/** Clean copy of a rich-text container's content as a list of nodes. */
function richContent(document, rich) {
  const clone = rich.cloneNode(true);
  clone.querySelectorAll('script, style, noscript, .shadow-before, .shadow-after').forEach((n) => n.remove());
  clone.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
  clone.querySelectorAll('.scrolltable, table').forEach((t) => {
    if (!clone.contains(t)) return;
    const table = t.tagName === 'TABLE' ? t : t.querySelector('table');
    if (table) t.replaceWith(tableToList(document, table));
    else t.replaceWith(...t.childNodes);
  });
  [clone, ...clone.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
    n.removeAttribute('width');
    n.removeAttribute('border');
  });
  clone.querySelectorAll('p').forEach((p) => {
    if (!text(p) && !p.querySelector('img')) p.remove();
  });
  clone.querySelectorAll('p > br:last-child').forEach((br) => br.remove());
  return [...clone.childNodes].filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
}

function columnContent(document, column) {
  const riches = [...column.querySelectorAll('.rich-text')];
  const nodes = [];
  (riches.length ? riches : [column]).forEach((r) => nodes.push(...richContent(document, r)));
  return nodes;
}

function isDark(color) {
  const c = String(color || '').trim().toLowerCase();
  let r; let g; let b;
  let m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) {
    const hex = m[1].length === 3 ? m[1].split('').map((x) => x + x).join('') : m[1];
    [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  } else {
    m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return false;
    [r, g, b] = m.slice(1, 4).map(Number);
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function parse(element, { document }) {
  const rows = [];
  let gridRows = [...element.querySelectorAll('.grid__row')]
    .filter((r) => !r.parentElement.closest('.grid__row'));
  if (!gridRows.length) gridRows = [element];

  gridRows.forEach((gridRow) => {
    let columns = [...gridRow.querySelectorAll('.grid__column')]
      .filter((c) => c.closest('.grid__row') === gridRow);
    if (!columns.length) columns = [...gridRow.querySelectorAll('.rich-text')];
    const cells = columns.map((c) => columnContent(document, c)).filter((c) => c.length);
    if (cells.length) rows.push(cells);
  });

  // Hand-built panels (inline-styled div with a floated image and text, as in some news
  // articles) have no grid or rich-text wrapper: split the element into a text cell and an
  // optional image cell, so the row still has the two columns the block expects.
  if (!rows.length) {
    const imgs = [...element.querySelectorAll('img')];
    const clone = element.cloneNode(true);
    clone.querySelectorAll('img').forEach((i) => i.remove());
    const textNodes = richContent(document, clone);
    const media = imgs.map((i) => {
      const img = document.createElement('img');
      img.src = i.getAttribute('src');
      img.alt = i.getAttribute('alt') || '';
      return img;
    });
    if (textNodes.length || media.length) rows.push([textNodes, media.length ? media : '']);
  }

  const width = Math.max(2, ...rows.map((r) => r.length));
  const cells = rows.map((r) => {
    while (r.length < width) r.push('');
    return r;
  });

  // A hand-built panel carries its own inline background colour.
  const module = element.matches('.module') ? element : (element.querySelector('.module') || element);
  const bg = module && (module.style?.backgroundColor
    || ((module.getAttribute('style') || '').match(/background-color\s*:\s*([^;]+)/i) || [])[1]);
  const name = isDark(bg) ? 'columns-media (boxed)' : 'columns-media';

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
