/*
 * Downloads Block
 * List of downloadable documents. One row per document:
 *   cell 1: document link (link text = title)
 *   cell 2: date (plain text, optional)
 * Renders ul > li with the link and the date below it. The file type is
 * derived from the URL extension and exposed as `downloads-item-<ext>`,
 * `data-file-type` and a visually hidden hint in the link.
 * Rows without a link or text are dropped; rows with text but no link are
 * kept as plain items.
 */

const FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'xlsm', 'csv', 'ppt', 'pptx', 'zip', 'txt', 'rtf'];

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december'];

function getFileType(href) {
  try {
    const { pathname } = new URL(href, window.location.href);
    const match = pathname.toLowerCase().match(/\.([a-z0-9]+)$/);
    if (match && FILE_TYPES.includes(match[1])) return match[1];
  } catch { /* ignore malformed URLs */ }
  return '';
}

/* "13 AUGUST 2026" / "13 Aug 2026" -> "2026-08-13"; '' if not recognised */
function toIsoDate(text) {
  const match = text.trim().match(/^(\d{1,2})\s+([a-z]+)\.?,?\s+(\d{4})$/i);
  if (!match) return '';
  const [, day, monthText, year] = match;
  const month = MONTHS.findIndex((m) => m.startsWith(monthText.toLowerCase())
    && monthText.length >= 3);
  if (month < 0) return '';
  return `${year}-${String(month + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function buildDate(text) {
  const iso = toIsoDate(text);
  const el = document.createElement(iso ? 'time' : 'span');
  if (iso) el.dateTime = iso;
  el.className = 'downloads-date';
  el.textContent = text;
  return el;
}

function buildItem(row) {
  const [titleCell, dateCell] = [...row.children];
  if (!titleCell) return null;

  const li = document.createElement('li');
  li.className = 'downloads-item';

  const link = titleCell.querySelector('a[href]');
  if (link) {
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.className = 'downloads-link';
    a.textContent = link.textContent.trim() || a.href;
    if (link.title && link.title !== a.textContent) a.title = link.title;
    if (link.target) a.target = link.target;
    if (a.target === '_blank') a.rel = 'noopener';

    const type = getFileType(a.href);
    if (type) {
      li.classList.add(`downloads-item-${type}`);
      li.dataset.fileType = type;
      const hint = document.createElement('span');
      hint.className = 'downloads-hint';
      hint.textContent = ` (${type.toUpperCase()}, opens document)`;
      a.append(hint);
    }
    li.append(a);
  } else {
    const text = titleCell.textContent.trim();
    if (!text) return null;
    const span = document.createElement('span');
    span.className = 'downloads-title';
    span.textContent = text;
    li.append(span);
  }

  const dateText = dateCell ? dateCell.textContent.trim() : '';
  if (dateText) li.append(buildDate(dateText));

  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'downloads-list';
  [...block.children].forEach((row) => {
    const li = buildItem(row);
    if (li) ul.append(li);
  });
  block.replaceChildren(ul);
}
