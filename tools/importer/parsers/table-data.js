/* eslint-disable */
/* global WebImporter */

/**
 * table-data parser.
 * Sources: div.richContentContainer:has(.scrolltable) (one or more rich-text
 * columns each holding a .scrolltable <table>) or a bare .rich-text .scrolltable.
 * Block table (blocks/table-data/table-data.js): one row per table row, one
 * cell per column (first row is the header row). Rows of every table in the
 * container are kept in document order; cells keep links, images and inline
 * formatting. Option `header` when the source table has <th> cells or a <thead>;
 * option `wide` when the source table spans the full content width.
 */

function cleanCell(document, td) {
  const cell = document.createElement('div');
  cell.append(...[...td.cloneNode(true).childNodes]);
  cell.querySelectorAll('script, style, svg, .shadow-before, .shadow-after').forEach((n) => n.remove());
  [...cell.querySelectorAll('*')].forEach((n) => {
    ['style', 'class', 'width', 'height', 'border', 'valign', 'align'].forEach((a) => n.removeAttribute(a));
  });
  // unwrap presentational spans
  cell.querySelectorAll('span').forEach((s) => s.replaceWith(...s.childNodes));
  return [...cell.childNodes];
}

export default function parse(element, { document }) {
  const cells = [];

  const tables = element.matches('table')
    ? [element]
    : [...element.querySelectorAll('table')].filter((t) => !t.parentElement.closest('table'));

  // option `header`: the table that supplies the block's first (header) row has real
  // header cells (<th> or a <thead>) in the source
  let hasHeaderCells = false;
  tables.forEach((table) => {
    const rows = [...table.querySelectorAll('tr')].filter((tr) => tr.closest('table') === table);
    const before = cells.length;
    rows.forEach((tr) => {
      const tds = [...tr.children].filter((c) => c.matches('td, th'));
      if (!tds.length) return;
      const row = tds.map((td) => cleanCell(document, td));
      if (row.every((c) => !c.some((n) => (n.textContent || '').trim() || (n.querySelector && n.querySelector('img'))))) return;
      cells.push(row);
    });
    if (!before && cells.length) {
      hasHeaderCells = [...table.querySelectorAll('thead, th')].some((n) => n.closest('table') === table);
    }
  });

  // pad rows to the widest row so the table stays rectangular
  const width = Math.max(0, ...cells.map((r) => r.length));
  cells.forEach((r) => { while (r.length < width) r.push(''); });

  // Edge Delivery blocks can't sit inside a list item (e.g. the contact table inside the
  // numbered privacy clauses): keep that table's content in place as plain paragraphs.
  if (element.closest('li')) {
    const nodes = cells.flat().flat().filter((n) => n && (typeof n !== 'string' || n.trim()));
    element.replaceWith(...nodes.map((n) => (typeof n === 'string' ? document.createTextNode(n) : n)));
    return;
  }

  // option `wide`: the source sets the table in a full-width rich text (.rich-text--full-width,
  // e.g. the NSW toll-reform tables) instead of the 800px text column
  const wide = !!(element.closest('.rich-text--full-width') || element.querySelector('.rich-text--full-width'));
  const options = [hasHeaderCells && 'header', wide && 'wide'].filter(Boolean);
  const name = options.length ? `table-data (${options.join(', ')})` : 'table-data';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
