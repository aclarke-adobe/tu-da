/*
 * Releases List Block
 * A dated list of releases (ASX announcements) with a client-side pager.
 * Authoring rows:
 *   Page size | 10          optional first row (default 10)
 *   date | title            one row per release; the title is usually a link
 * Works with the releases-filter block: that block hides filtered-out items with
 * the `hidden` attribute and dispatches `releases-filter:change` on document.
 * Paging hides off-page items with a class so the two never fight over `hidden`.
 */

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_BUTTONS = 5;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december'];
const ARROW_LEFT = 'M9.406 11.24h10.039c.763 0 1.388.57 1.388 1.265s-.625 1.264-1.388 1.264H9.406v2.263c0 .57-.75.848-1.18.443l-3.861-3.528a.608.608 0 010-.897l3.86-3.528c.431-.404 1.181-.114 1.181.443v2.276z';
const ARROW_RIGHT = 'M15.594 11.24H5.555c-.763 0-1.388.57-1.388 1.265s.625 1.264 1.388 1.264h10.039v2.263c0 .57.75.848 1.18.443l3.861-3.528a.608.608 0 000-.897l-3.86-3.528c-.431-.404-1.181-.114-1.181.443v2.276z';

const arrow = (d) => `<svg class="releases-list-arrow" viewBox="0 0 25 25" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/></svg>`;

/** "19 November 2026" -> "2026-11-19" (null when not parseable) */
function toIsoDate(text) {
  const m = text.trim().match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\.?,?\s+(\d{4})$/i);
  if (!m) return null;
  const name = m[2].toLowerCase();
  const month = MONTHS.findIndex((mo) => mo === name || (name.length >= 3 && mo.startsWith(name)));
  const day = Number(m[1]);
  if (month < 0 || day < 1 || day > 31) return null;
  return `${m[3]}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function readRows(block) {
  let pageSize = DEFAULT_PAGE_SIZE;
  const rows = [...block.children];
  const first = rows[0]?.children;
  if (first?.[0]?.textContent.trim().toLowerCase() === 'page size') {
    const size = parseInt(first[1]?.textContent.trim(), 10);
    if (size > 0) pageSize = size;
    rows.shift();
  }
  const releases = rows.map((row) => {
    const [dateCell, titleCell] = row.children;
    const date = dateCell?.textContent.trim() || '';
    const link = titleCell?.querySelector('a[href]');
    const title = (link || titleCell)?.textContent.trim() || '';
    return { date, title, link };
  }).filter((r) => r.date || r.title);
  return { pageSize, releases };
}

function buildItem({ date, title, link }) {
  const li = document.createElement('li');
  li.className = 'releases-list-item';
  if (date) {
    const iso = toIsoDate(date);
    const dateEl = document.createElement(iso ? 'time' : 'span');
    if (iso) dateEl.dateTime = iso;
    dateEl.className = 'releases-list-date';
    dateEl.textContent = date;
    li.append(dateEl);
  }
  if (title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'releases-list-title';
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      if (link.title) a.title = link.title;
      if (link.target) a.target = link.target;
      a.textContent = title;
      titleEl.append(a);
    } else {
      titleEl.textContent = title;
    }
    li.append(titleEl);
  }
  return li;
}

function pageButton(label, page, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.page = page;
  button.innerHTML = label;
  return button;
}

export default function decorate(block) {
  const { pageSize, releases } = readRows(block);

  const list = document.createElement('ul');
  list.className = 'releases-list-items';
  list.tabIndex = -1;
  list.setAttribute('aria-label', 'Releases');
  releases.forEach((r) => list.append(buildItem(r)));

  const count = document.createElement('p');
  count.className = 'releases-list-count';
  count.setAttribute('aria-live', 'polite');

  const pager = document.createElement('nav');
  pager.className = 'releases-list-pager';
  pager.setAttribute('aria-label', 'Pagination');
  pager.hidden = true;

  block.replaceChildren(list, count, pager);

  const params = new URLSearchParams(window.location.search);
  let page = Math.max(1, parseInt(params.get('page'), 10) || 1);

  const setUrlPage = () => {
    const url = new URL(window.location.href);
    if (page > 1) url.searchParams.set('page', page);
    else url.searchParams.delete('page');
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  };

  const render = () => {
    const items = [...list.children];
    const visible = items.filter((item) => !item.hidden);
    const total = visible.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.min(Math.max(1, page), pages);
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);

    items.forEach((item) => item.classList.add('releases-list-off-page'));
    visible.slice(start, end).forEach((item) => item.classList.remove('releases-list-off-page'));

    count.textContent = total
      ? `Showing ${start + 1}–${end} of ${total.toLocaleString('en-AU')}`
      : 'No releases match your search.';

    pager.replaceChildren();
    pager.hidden = pages <= 1;
    if (pages > 1) {
      const prev = pageButton(`${arrow(ARROW_LEFT)}<span>Previous</span>`, page - 1, 'releases-list-prev');
      prev.disabled = page === 1;
      pager.append(prev);
      const centred = page - Math.floor(MAX_PAGE_BUTTONS / 2);
      const first = Math.max(1, Math.min(centred, pages - MAX_PAGE_BUTTONS + 1));
      const last = Math.min(pages, first + MAX_PAGE_BUTTONS - 1);
      for (let n = first; n <= last; n += 1) {
        const btn = pageButton(String(n), n, 'releases-list-page');
        btn.setAttribute('aria-label', `Page ${n}`);
        if (n === page) btn.setAttribute('aria-current', 'page');
        pager.append(btn);
      }
      const next = pageButton(`<span>Next</span>${arrow(ARROW_RIGHT)}`, page + 1, 'releases-list-next');
      next.disabled = page === pages;
      pager.append(next);
    }
    setUrlPage();
  };

  pager.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button || button.disabled) return;
    const target = Number(button.dataset.page);
    if (!target || target === page) return;
    page = target;
    render();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.focus({ preventScroll: true });
    list.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  // the filter re-applies the URL filters at load: keep a deep-linked ?page=N for that
  // first change, reset to page 1 on every change after
  let initialFilters = true;
  document.addEventListener('releases-filter:change', (e) => {
    const state = e.detail || {};
    const fromUrl = initialFilters
      && Object.entries(state).every(([k, v]) => (params.get(k) || '') === (v || ''));
    initialFilters = false;
    if (!fromUrl) page = 1;
    render();
  });

  render();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => setTimeout(render, 0), { once: true });
  }
}
