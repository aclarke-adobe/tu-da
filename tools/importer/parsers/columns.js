/* eslint-disable */
/* global WebImporter */

/**
 * columns parser.
 * Source: div.richContentContainer > .module > .grid > .grid__row >
 *   .gridItem > .grid__column > .richtext .rich-text (one rich-text column
 *   per grid item, e.g. lists of councils per state).
 * Block table (blocks/columns/columns.js): one row per .grid__row, one cell
 * per grid column holding that column's rich text (paragraphs, lists,
 * headings, images, links). Rows are padded to the widest row.
 */

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
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
    if (!t.isConnected || !clone.contains(t)) return;
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
  // trailing <br> inside paragraphs
  clone.querySelectorAll('p > br:last-child').forEach((br) => {
    if (!br.nextSibling || !text({ textContent: br.nextSibling.textContent || '' })) br.remove();
  });
  return [...clone.childNodes].filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
}

function columnContent(document, column) {
  const riches = [...column.querySelectorAll('.rich-text')];
  const nodes = [];
  if (riches.length) {
    riches.forEach((r) => nodes.push(...richContent(document, r)));
  } else if (text(column) || column.querySelector('img')) {
    nodes.push(...richContent(document, column));
  }
  return nodes;
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
    const cells = columns.map((c) => columnContent(document, c));
    if (cells.some((c) => c.length)) rows.push(cells);
  });

  const width = Math.max(1, ...rows.map((r) => r.length));
  const cells = rows.map((r) => {
    while (r.length < width) r.push('');
    return r;
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
