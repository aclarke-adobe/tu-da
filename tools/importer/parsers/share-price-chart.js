/* eslint-disable */
/* global WebImporter */

/**
 * share-price-chart parser.
 * The catalog maps three parts of one yourir chart widget (.share-price-chart):
 *   - .yourir-chart-panel-plots (the plotted chart)      -> option line-chart
 *   - .share-price-chart__chart-controls--range buttons -> Ranges / Default
 *   - .share-price-chart__chart-controls--type buttons  -> Compare
 * Whichever part is parsed first builds the single block for the widget and
 * removes the other parts, so one widget yields one block. Parts already
 * detached by that first pass are skipped.
 * Block table (blocks/share-price-chart/share-price-chart.js): key/value rows
 *   Title | text; Ranges | list; Default | range; (Compare | list, kept for
 *   authors, not read by the block). No .json data source exists on the
 *   source page, so no Data row is written.
 */

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function list(document, values) {
  const ul = document.createElement('ul');
  values.forEach((v) => {
    const li = document.createElement('li');
    li.textContent = v;
    ul.append(li);
  });
  return ul;
}

export default function parse(element, { document }) {
  // a sibling part already produced this widget's block
  if (!element.isConnected) return;

  const container = element.closest('.share-price-chart') || element;
  const find = (sel) => (element.matches(sel) ? element : container.querySelector(sel));

  const plots = find('.yourir-chart-panel-plots');
  const range = find('.share-price-chart__chart-controls--range');
  const type = find('.share-price-chart__chart-controls--type');

  const cells = [];

  const titleEl = container.querySelector('.share-price-chart__title h1, .share-price-chart__title h2, .share-price-chart__title');
  const title = text(titleEl) || 'Share price';
  cells.push(['Title', title]);

  if (range) {
    const buttons = [...range.querySelectorAll('button')].filter((b) => text(b));
    if (buttons.length) {
      cells.push(['Ranges', list(document, buttons.map(text))]);
      const active = buttons.find((b) => b.classList.contains('yourir-active') || b.getAttribute('aria-pressed') === 'true');
      if (active) cells.push(['Default', text(active)]);
    }
  }

  if (type) {
    const toggles = [...type.querySelectorAll('button')].map(text).filter(Boolean);
    if (toggles.length) cells.push(['Compare', list(document, toggles)]);
  }

  const name = plots ? 'share-price-chart (line-chart)' : 'share-price-chart';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });

  // one block per widget: drop the sibling parts this block now represents
  [plots, range, type].forEach((part) => {
    if (part && part !== element && part.isConnected && !part.contains(element)) part.remove();
  });

  // The live chart's SVG axis labels and date range are generated data, not authored content:
  // replace the whole widget so none of it leaks into the page as stray paragraphs.
  if (container !== element && container.isConnected) {
    container.replaceWith(block);
    if (element.isConnected) element.remove();
  } else {
    element.replaceWith(block);
  }
}
