/* eslint-disable */
/* global WebImporter */

/**
 * releases-filter parser.
 * Source: .module--asx-releases .results-filter with a search input
 * (placeholder) and <select>s (announcement type, year).
 * Block table (blocks/releases-filter/releases-filter.js): key/value rows
 *   Search   | placeholder
 *   Category | list: all-label, then options
 *   Year     | list: all-label, then options
 */

function keyFor(select) {
  const id = `${select.getAttribute('name') || ''} ${select.id || ''}`.toLowerCase();
  if (/year/.test(id)) return 'Year';
  if (/filter|type|category/.test(id)) return 'Category';
  const label = select.id && select.ownerDocument.querySelector(`label[for="${select.id}"]`);
  const text = label ? label.textContent.replace(/^search by\s*/i, '').trim() : '';
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Filter';
}

export default function parse(element, { document }) {
  const cells = [];

  const input = element.querySelector('input[type="text"], input[type="search"], input:not([type])');
  if (input) {
    cells.push(['Search', input.getAttribute('placeholder') || 'Search']);
  }

  element.querySelectorAll('select').forEach((select) => {
    const values = [...select.querySelectorAll('option')]
      .map((o) => o.textContent.trim())
      .filter(Boolean);
    if (!values.length) return;
    const ul = document.createElement('ul');
    values.forEach((v) => {
      const li = document.createElement('li');
      li.textContent = v;
      ul.append(li);
    });
    cells.push([keyFor(select), ul]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'releases-filter', cells });
  element.replaceWith(block);
}
