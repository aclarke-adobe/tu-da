/* eslint-disable */
/* global WebImporter */

/**
 * tabs-panels parser.
 * Source: div.tabsContainer > .cmp-tabs with li.cmp-tabs__tab (label in
 * .tab-label) and div.cmp-tabs__tabpanel panels (nested AEM grids of rich text).
 * Option light: the tab nav uses the white theme (.nav.theme--white).
 * Block table (blocks/tabs-panels/tabs-panels.js): one row per tab,
 * label | panel. A panel holding a multi-column layout (another block:
 * columns) is moved into a fragment on params.fragments and the panel cell
 * holds only the /fragments/ link; plain rich-text panels stay inline.
 */

function slugify(text) {
  return text.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'tab';
}

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function clean(el) {
  el.querySelectorAll('svg, script, style, input, .icon').forEach((n) => n.remove());
  el.querySelectorAll('a').forEach((a) => { if (!text(a) && !a.querySelector('img')) a.remove(); });
  [el, ...el.querySelectorAll('*')].forEach((n) => {
    ['style', 'class', 'aria-label', 'target', 'rel'].forEach((a) => n.removeAttribute(a));
  });
  return el;
}

function columnsOf(row) {
  return [...row.querySelectorAll('.grid__column')].filter((c) => c.closest('.grid__row') === row);
}

/**
 * Flatten a panel into a list of content nodes and column-row markers
 * ({ columns: [[...nodes], ...] }) in document order.
 */
function collect(node, out) {
  [...node.children].forEach((child) => {
    if (child.matches('script, style, template, input')) return;
    if (child.matches('.grid__row')) {
      const cols = columnsOf(child);
      const nested = child.querySelector('.grid__row');
      if (cols.length > 1 && !nested) {
        const row = cols.map((c) => {
          const nodes = [];
          collect(c, nodes);
          return nodes.filter((n) => !n.columns);
        });
        out.push({ columns: row });
        return;
      }
    }
    if (child.matches('.rich-text')) {
      [...child.children].forEach((c) => {
        if (!text(c) && !c.querySelector('img, iframe')) return;
        out.push(clean(c));
      });
      return;
    }
    collect(child, out);
  });
}

function hasColumns(items) {
  return items.some((i) => i.columns);
}

/** Materialise markers: consecutive column rows become one columns block. */
function materialise(document, items) {
  const out = [];
  let pending = null;
  const flush = () => {
    if (!pending) return;
    const width = Math.max(...pending.map((r) => r.length));
    pending.forEach((r) => { while (r.length < width) r.push(''); });
    out.push(WebImporter.Blocks.createBlock(document, { name: 'columns', cells: pending }));
    pending = null;
  };
  items.forEach((item) => {
    if (item.columns) {
      if (!pending) pending = [];
      pending.push(item.columns);
    } else {
      flush();
      out.push(item);
    }
  });
  flush();
  return out;
}

function pagePath(params) {
  try {
    const u = params && params.originalURL ? new URL(params.originalURL) : null;
    if (!u) return '';
    return u.pathname.replace(/\.html?$/, '').replace(/\/+$/, '');
  } catch (e) {
    return '';
  }
}

export default function parse(element, { document, params }) {
  const cells = [];
  const fragments = params && Array.isArray(params.fragments) ? params.fragments : null;

  const tabs = [...element.querySelectorAll('.cmp-tabs__tab, [role="tab"]')]
    .filter((t, i, all) => all.indexOf(t) === i && text(t));
  const panels = [...element.querySelectorAll('.cmp-tabs__tabpanel, [role="tabpanel"]')]
    .filter((p, i, all) => all.indexOf(p) === i && !p.parentElement.closest('.cmp-tabs__tabpanel, [role="tabpanel"]'));

  const base = pagePath(params);

  tabs.forEach((tab, i) => {
    const label = text(tab.querySelector('.tab-label') || tab);
    const controls = tab.getAttribute('aria-controls');
    const panel = (controls && panels.find((p) => p.id === controls)) || panels[i];

    const items = [];
    if (panel) collect(panel, items);

    let body;
    if (hasColumns(items) && fragments) {
      const fragEl = document.createElement('div');
      fragEl.append(...materialise(document, items));
      const path = base
        ? `/fragments${base}/tabs-${slugify(label)}`
        : `/fragments/tabs/${slugify(label)}`;
      if (!fragments.some((f) => f.path === path)) fragments.push({ element: fragEl, path });
      const a = document.createElement('a');
      a.href = path;
      a.textContent = path;
      body = [a];
    } else {
      // inline: flatten any column rows in reading order
      body = [];
      items.forEach((item) => {
        if (item.columns) item.columns.forEach((col) => body.push(...col));
        else body.push(item);
      });
    }

    cells.push([label, body]);
  });

  const light = !!element.querySelector('.nav.theme--white, .theme--white .cmp-tabs__tablist');
  const name = light ? 'tabs-panels (light)' : 'tabs-panels';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
