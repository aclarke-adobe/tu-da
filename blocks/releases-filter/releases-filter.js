/*
 * Releases Filter Block
 * Search box and dropdown filters for a list of releases/announcements that
 * follows the block in the same section (list items, table rows, cards or any
 * block's items).
 * Configuration rows (first cell is the key, case-insensitive):
 *   Search   | placeholder text (omit the row to hide the search box)
 *   Category | "All announcements" label, then the options (list or comma-separated)
 *   Year     | "All years" label, then the options; use "auto" to derive the
 *              years (4-digit numbers) from the items, or a token like "2009+"
 *              for every year from the current year down to 2009
 *   Target   | optional CSS selector of the items to filter
 * Filter values are kept in the URL (?q=&category=&year=) and a
 * `releases-filter:change` event is dispatched on document with the values.
 * When the list is a live releases-list feed (`.releases-list[data-feed]`) the
 * items are not hidden here: the feed filters server-side from the event.
 */

const DEFAULT_TARGET = 'li, tbody tr, .cards-news-card';

function readConfig(block) {
  const config = { filters: [] };
  [...block.children].forEach((row) => {
    const [keyCell, valueCell] = row.children;
    const key = keyCell?.textContent.trim().toLowerCase();
    if (!key) return;
    if (key === 'search') {
      config.search = valueCell?.textContent.trim() || 'Search';
    } else if (key === 'target') {
      config.target = valueCell?.textContent.trim();
    } else {
      const list = valueCell?.querySelectorAll('li');
      let values = list?.length
        ? [...list].map((li) => li.textContent.trim())
        : (valueCell?.textContent || '').split(',').map((v) => v.trim());
      values = values.filter(Boolean);
      const allLabel = values.shift() || `All ${key}`;
      config.filters.push({ key, allLabel, values });
    }
  });
  return config;
}

const FEED_LIST = '.releases-list[data-feed]:not([data-feed-status="offline"])';

/** "2009+" -> current year down to 2009 */
function expandYears(values) {
  const current = new Date().getFullYear();
  return values.flatMap((v) => {
    const m = v.match(/^((?:19|20)\d{2})\s*\+$/);
    if (!m) return [v];
    const years = [];
    for (let y = current; y >= Number(m[1]); y -= 1) years.push(String(y));
    return years;
  }).filter((v, i, all) => all.indexOf(v) === i);
}

/** true when the filtered list is a releases-list in live feed mode */
function targetsFeed(block, selector) {
  const wrapper = block.closest('.releases-filter-wrapper') || block;
  const section = block.closest('.section') || document.querySelector('main');
  const walk = (start) => {
    let next = start;
    while (next) {
      if (next.matches(FEED_LIST) || next.querySelector(FEED_LIST)) return true;
      if (next.querySelector(selector)) return false;
      next = next.nextElementSibling;
    }
    return null;
  };
  let found = walk(wrapper.nextElementSibling);
  if (found === null && section !== wrapper) found = walk(section.nextElementSibling);
  return Boolean(found);
}

function findItems(block, selector) {
  const wrapper = block.closest('.releases-filter-wrapper') || block;
  const section = block.closest('.section') || document.querySelector('main');
  // the filtered list is the first element after the block that holds items
  const firstMatch = (start) => {
    let next = start;
    while (next) {
      const found = [...next.querySelectorAll(selector)];
      if (found.length) return found;
      next = next.nextElementSibling;
    }
    return [];
  };
  let items = firstMatch(wrapper.nextElementSibling);
  if (!items.length && section !== wrapper) items = firstMatch(section.nextElementSibling);
  return items.filter((el) => !el.querySelector(selector));
}

export default function decorate(block) {
  const config = readConfig(block);
  const params = new URLSearchParams(window.location.search);

  const form = document.createElement('form');
  form.className = 'releases-filter-form';
  form.setAttribute('role', 'search');
  form.addEventListener('submit', (e) => e.preventDefault());

  const controls = {};
  if (config.search !== undefined) {
    const input = document.createElement('input');
    input.type = 'search';
    input.name = 'q';
    input.placeholder = config.search;
    input.setAttribute('aria-label', config.search);
    input.value = params.get('q') || '';
    input.className = 'releases-filter-search';
    controls.q = input;
    const field = document.createElement('div');
    field.className = 'releases-filter-field';
    field.append(input);
    form.append(field);
  }

  config.filters.forEach((filter) => {
    const select = document.createElement('select');
    select.name = filter.key;
    select.className = `releases-filter-select releases-filter-${filter.key}`;
    select.setAttribute('aria-label', filter.allLabel);
    const all = document.createElement('option');
    all.value = '';
    all.textContent = filter.allLabel;
    select.append(all);
    controls[filter.key] = select;
    // visible label mirrors the selected option; the native select sits on top, transparent
    const label = document.createElement('span');
    label.className = 'releases-filter-select-label';
    label.setAttribute('aria-hidden', 'true');
    label.textContent = filter.allLabel;
    const wrap = document.createElement('span');
    wrap.className = 'releases-filter-select-wrap';
    wrap.append(label, select);
    const field = document.createElement('div');
    field.className = 'releases-filter-field';
    field.append(wrap);
    form.append(field);
  });

  const syncLabels = () => {
    form.querySelectorAll('select').forEach((select) => {
      const label = select.previousElementSibling;
      const option = select.options[select.selectedIndex];
      if (label && option) label.textContent = option.textContent;
    });
  };

  block.replaceChildren(form);

  let items = [];
  const selector = config.target || DEFAULT_TARGET;
  const populated = new Set();
  const populate = () => {
    config.filters.forEach((filter) => {
      if (populated.has(filter.key)) return;
      const select = controls[filter.key];
      let { values } = filter;
      if (values.length === 1 && values[0].toLowerCase() === 'auto') {
        const years = new Set();
        items.forEach((it) => (it.textContent.match(/\b(19|20)\d{2}\b/g) || []).forEach((y) => years.add(y)));
        values = [...years].sort().reverse();
        if (!values.length) return;
      } else {
        values = expandYears(values);
      }
      populated.add(filter.key);
      values.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        select.append(opt);
      });
      select.value = params.get(filter.key) || '';
    });
    syncLabels();
  };

  const apply = () => {
    items = findItems(block, selector);
    const state = Object.fromEntries(Object.entries(controls).map(([k, c]) => [k, c.value.trim()]));
    // a live feed filters server-side from the event: never hide its items
    const feed = targetsFeed(block, selector);
    items.forEach((item) => {
      if (feed) {
        item.hidden = false;
        return;
      }
      const text = item.textContent.toLowerCase();
      const visible = Object.values(state).every((v) => !v || text.includes(v.toLowerCase()));
      item.hidden = !visible;
    });
    const url = new URL(window.location.href);
    Object.entries(state).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    });
    window.history.replaceState(null, '', url);
    document.dispatchEvent(new CustomEvent('releases-filter:change', { detail: state }));
  };

  let timer;
  form.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 200);
  });
  form.addEventListener('change', () => {
    syncLabels();
    apply();
  });

  // items are decorated by blocks that may load after this one
  form.addEventListener('focusin', () => {
    items = findItems(block, selector);
    populate();
  });
  // a feed that fails falls back to its authored rows: filter those client-side
  document.addEventListener('releases-list:offline', () => {
    if (Object.values(controls).some((c) => c.value.trim())) apply();
  });
  const init = () => {
    items = findItems(block, selector);
    populate();
    if ([...params.keys()].some((k) => controls[k])) apply();
  };
  if (document.readyState === 'complete') setTimeout(init, 0);
  else window.addEventListener('load', init, { once: true });
}
