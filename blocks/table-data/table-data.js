/*
 * Table Data Block
 * Bordered data table. Each block row becomes a table row; the first row is
 * the header row unless it is the only row. Cells keep their rich content
 * (headings, links, line breaks). Option `dark`: dark header styling. Option `wide`: full
 * content width with equal columns. An "icon <br> label" cell shows a 40px icon line.
 * The table scrolls horizontally on narrow screens.
 */

/**
 * "icon <br> label" in one paragraph (as imported) becomes an icon paragraph and a label
 * paragraph, the same shape Document Authoring stores, so one set of styles covers both.
 * @param {Element} cell
 */
function splitIconLine(cell) {
  const only = cell.children.length === 1 && cell.firstElementChild.tagName === 'P';
  const host = only ? cell.firstElementChild : cell;
  const icon = host.firstElementChild;
  if (!icon || !['PICTURE', 'IMG'].includes(icon.tagName)) return;
  if (icon.previousSibling && icon.previousSibling.textContent.trim()) return;
  const br = icon.nextElementSibling;
  if (!br || br.tagName !== 'BR') return;
  const iconP = document.createElement('p');
  iconP.append(icon);
  br.remove();
  const labelP = document.createElement('p');
  labelP.append(...host.childNodes);
  if (only) host.replaceWith(iconP, labelP);
  else cell.replaceChildren(iconP, labelP);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const table = document.createElement('table');
  const maxCols = Math.max(...rows.map((r) => r.children.length));
  const hasHeader = rows.length > 1;
  rows.forEach((row) => [...row.children].forEach(splitIconLine));

  // wide: equal columns, like the source's full-width tables
  if (block.classList.contains('wide') && maxCols > 1) {
    const colgroup = document.createElement('colgroup');
    for (let i = 0; i < maxCols; i += 1) {
      const col = document.createElement('col');
      col.style.width = `${(100 / maxCols).toFixed(3)}%`;
      colgroup.append(col);
    }
    table.append(colgroup);
  }

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
