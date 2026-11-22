/*
 * Table Data Block
 * Bordered data table. Each block row becomes a table row; the first row is
 * the header row unless it is the only row. Cells keep their rich content
 * (headings, links, line breaks). Option `dark`: dark header styling.
 * The table scrolls horizontally on narrow screens.
 */

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const table = document.createElement('table');
  const maxCols = Math.max(...rows.map((r) => r.children.length));
  const hasHeader = rows.length > 1;

  let thead;
  if (hasHeader) {
    thead = document.createElement('thead');
    table.append(thead);
  }
  const tbody = document.createElement('tbody');
  table.append(tbody);

  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    const isHead = hasHeader && i === 0;
    const cells = [...row.children];
    cells.forEach((cell, j) => {
      const td = document.createElement(isHead ? 'th' : 'td');
      if (isHead) td.scope = 'col';
      if (j === cells.length - 1 && cells.length < maxCols) td.colSpan = maxCols - cells.length + 1;
      td.append(...cell.childNodes);
      tr.append(td);
    });
    (isHead ? thead : tbody).append(tr);
  });

  const scroller = document.createElement('div');
  scroller.className = 'table-data-scroll';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  scroller.setAttribute('aria-label', 'Table');
  scroller.append(table);
  block.replaceChildren(scroller);
}
