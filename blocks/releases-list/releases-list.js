/*
 * Releases List Block
 * A dated list of releases (ASX announcements) with a client-side pager.
 * Authoring rows (config rows: key cell, case-insensitive, before the releases):
 *   Page size | 10          optional (default 10, 15 in feed mode)
 *   Feed      | tcl.asx     optional yourir symbol \ both together switch on feed mode:
 *   App ID    | a5095...    optional yourir app ID /  live, server-side paged list
 *   date | title            one row per release; the title is usually a link
 * Works with the releases-filter block: that block hides filtered-out items with
 * the `hidden` attribute and dispatches `releases-filter:change` on document.
 * Paging hides off-page items with a class so the two never fight over `hidden`.
 * Feed mode renders the authored rows first, then replaces them with the live
 * page from the yourir API; the filter values are sent to the API instead.
 * If the first fetch fails the authored rows stay, paged client-side.
 */

const DEFAULT_PAGE_SIZE = 10;
const FEED_PAGE_SIZE = 15;
const FEED_API = 'https://yourir.info/api/v5/symbols';
const FEED_FILES = 'https://yourir.info/resources';
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

const CONFIG_KEYS = ['page size', 'feed', 'app id', 'appid'];

function readRows(block) {
  const config = {};
  const rows = [...block.children];
  while (rows.length) {
    const [keyCell, valueCell] = rows[0].children;
    const key = keyCell?.textContent.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!CONFIG_KEYS.includes(key)) break;
    const value = valueCell?.textContent.trim() || '';
    if (key === 'page size') config.pageSize = parseInt(value, 10);
    else if (key === 'feed') config.symbol = value.toLowerCase();
    else config.appId = value;
    rows.shift();
  }
  const feed = config.symbol && config.appId
    ? { symbol: config.symbol, appId: config.appId } : null;
  const fallbackSize = feed ? FEED_PAGE_SIZE : DEFAULT_PAGE_SIZE;
  const pageSize = config.pageSize > 0 ? config.pageSize : fallbackSize;
  const releases = rows.map((row) => {
    const [dateCell, titleCell] = row.children;
    const date = dateCell?.textContent.trim() || '';
    const link = titleCell?.querySelector('a[href]');
    const title = (link || titleCell)?.textContent.trim() || '';
    return { date, title, link };
  }).filter((r) => r.date || r.title);
  return { pageSize, releases, feed };
}

/** "2026-11-19 08:32:17" -> { iso: "2026-11-19", text: "19 November 2026" } */
function feedDate(time) {
  const m = String(time || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return { iso: null, text: '' };
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  const text = date.toLocaleDateString('en-AU', { dateStyle: 'long', timeZone: 'UTC' });
  return { iso: `${m[1]}-${m[2]}-${m[3]}`, text };
}

/** document link in the source's style: .../TCL_October_2026_traffic.pdf */
function feedFileUrl({ symbol, appId }, fileID, heading, fileType) {
  const code = symbol.split('.')[0].toUpperCase();
  const name = `${code}_${heading.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '')}`;
  const type = (fileType || 'pdf').toLowerCase();
  return `${FEED_FILES}/${encodeURIComponent(appId)}/announcements/${encodeURIComponent(symbol)}/`
    + `${encodeURIComponent(fileID)}/${encodeURIComponent(name)}.${encodeURIComponent(type)}`;
}

/** column arrays -> one record per item */
function feedItems(feed, items = {}) {
  const headings = items.heading || [];
  return headings.map((heading, i) => {
    const { iso, text } = feedDate(items.time?.[i]);
    const fileID = items.fileID?.[i];
    const fileType = String(items.fileType?.[i] || '').toLowerCase();
    return {
      date: text,
      iso,
      title: String(heading || '').trim(),
      href: fileID ? feedFileUrl(feed, String(fileID), String(heading || ''), fileType) : null,
      fileType,
      priceSensitive: Number(items.priceSensitive?.[i]) === 1,
    };
  }).filter((r) => r.date || r.title);
}

function buildFeedItem({
  date, iso, title, href, fileType, priceSensitive,
}) {
  const li = document.createElement('li');
  li.className = 'releases-list-item';
  if (priceSensitive) li.classList.add('releases-list-item-price-sensitive');
  if (date) {
    const dateEl = document.createElement(iso ? 'time' : 'span');
    if (iso) dateEl.dateTime = iso;
    dateEl.className = 'releases-list-date';
    dateEl.textContent = date;
    li.append(dateEl);
  }
  const titleEl = document.createElement('div');
  titleEl.className = 'releases-list-title';
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = title;
    if (fileType) {
      const hint = document.createElement('span');
      hint.className = 'releases-list-hint';
      hint.textContent = ` (${fileType.toUpperCase()})`;
      a.append(hint);
    }
    titleEl.append(a);
  } else {
    titleEl.textContent = title;
  }
  li.append(titleEl);
  return li;
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
  const { pageSize, releases, feed } = readRows(block);

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

  // feed mode: 'loading' until the first fetch, then 'live' or 'offline' (static fallback)
  let mode = 'static';
  if (feed) {
    mode = 'loading';
    block.dataset.feed = feed.symbol;
    block.dataset.feedStatus = 'loading';
    block.classList.add('releases-list-feed');
  }

  const setUrlPage = () => {
    const url = new URL(window.location.href);
    if (page > 1) url.searchParams.set('page', page);
    else url.searchParams.delete('page');
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  };

  const renderPager = (pages) => {
    pager.replaceChildren();
    pager.hidden = pages <= 1;
    if (pages <= 1) return;
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
  };

  const renderCount = (start, end, total) => {
    count.textContent = total
      ? `Showing ${start + 1}–${end} of ${total.toLocaleString('en-AU')}`
      : 'No releases match your search.';
  };

  // client-side paging of the rows in the list (static mode and feed fallback)
  const renderStatic = () => {
    const items = [...list.children];
    const visible = items.filter((item) => !item.hidden);
    const total = visible.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.min(Math.max(1, page), pages);
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);

    items.forEach((item) => item.classList.add('releases-list-off-page'));
    visible.slice(start, end).forEach((item) => item.classList.remove('releases-list-off-page'));

    renderCount(start, end, total);
    renderPager(pages);
    setUrlPage();
  };

  // feed mode before the first response: show the authored rows, keep ?page=N untouched
  const renderLoading = () => {
    [...list.children].forEach((item, i) => item.classList.toggle('releases-list-off-page', i >= pageSize));
  };

  const render = () => {
    if (mode === 'static' || mode === 'offline') renderStatic();
    else if (mode === 'loading') renderLoading();
  };

  // filter values: from the URL at load, then from releases-filter:change
  let filters = Object.fromEntries(['q', 'category', 'year'].map((k) => [k, params.get(k) || '']));
  let controller;
  let lastQuery;

  const feedUrl = (targetPage) => {
    const url = new URL(`${FEED_API}/${encodeURIComponent(feed.symbol)}/announcements`);
    const year = String(filters.year || '').trim();
    const search = String(filters.q || '').trim();
    Object.entries({
      appID: feed.appId,
      includeEmbargoed: 1,
      includeOtherIssuers: 0,
      includeRetracted: 0,
      liveness: 'live',
      order: 'desc',
      page: targetPage,
      pageSize,
      priceSensitiveOnly: /price sensitive/i.test(filters.category || '') ? 1 : 0,
    }).forEach(([k, v]) => url.searchParams.set(k, v));
    if (search) url.searchParams.set('search', search);
    // the API rejects range together with year
    if (/^\d{4}$/.test(year)) url.searchParams.set('year', year);
    else url.searchParams.set('range', 'all');
    return url.href;
  };

  const goOffline = (error) => {
    // eslint-disable-next-line no-console
    console.warn('releases-list: feed unavailable, showing the authored releases', error);
    mode = 'offline';
    block.dataset.feedStatus = 'offline';
    renderStatic();
    // let the filter hide the authored rows client-side now
    document.dispatchEvent(new CustomEvent('releases-list:offline', { detail: { block } }));
  };

  const load = async (targetPage) => {
    const query = feedUrl(targetPage);
    if (query === lastQuery) return;
    lastQuery = query;
    controller?.abort();
    const current = new AbortController();
    controller = current;
    list.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(query, { signal: current.signal });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json || !json.items) throw new Error(json?.message || `HTTP ${res.status}`);
      const total = Number(json.totalCount) || 0;
      const pages = Number(json.pageCount) || Math.ceil(total / pageSize);
      if (total && targetPage > pages) {
        // deep link past the last page: show the last page instead
        lastQuery = null;
        load(pages);
        return;
      }
      const items = feedItems(feed, json.items);
      mode = 'live';
      block.dataset.feedStatus = 'live';
      page = Number(json.page) || targetPage;
      list.replaceChildren(...items.map(buildFeedItem));
      const start = (page - 1) * pageSize;
      renderCount(start, start + items.length, total);
      renderPager(pages);
      setUrlPage();
    } catch (error) {
      if (current.signal.aborted) return;
      lastQuery = null;
      if (mode === 'loading') goOffline(error);
      else {
        // eslint-disable-next-line no-console
        console.warn('releases-list: feed request failed', error);
      }
    } finally {
      if (controller === current) list.removeAttribute('aria-busy');
    }
  };

  const isFeed = () => mode === 'loading' || mode === 'live';

  pager.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button || button.disabled) return;
    const target = Number(button.dataset.page);
    if (!target || target === page) return;
    if (isFeed()) {
      load(target);
    } else {
      page = target;
      renderStatic();
    }
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
    if (isFeed()) {
      filters = { ...state };
      load(page);
    } else {
      renderStatic();
    }
  });

  render();
  if (feed) load(page);
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => setTimeout(render, 0), { once: true });
  }
}
