/* eslint-disable */
/* global WebImporter */

/**
 * releases-list parser — the ASX releases list (yourir feed snapshot) on
 * /investor-centre/asx-releases: `.asx-releases__list_container .results-list__item`
 * (date + heading link). Block table (blocks/releases-list): one row per release,
 * date | title. The block paginates client-side (default 10 per page), so the source's
 * static "Showing 1-15 of N" text and its JS-only pager are dropped.
 */

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

// Live feed: the source loads its yourir app (https://yourir.info/<appID>.js) through its tag
// manager, so the ID isn't in the captured page; this is Transurban's yourir app ID. The
// symbol comes from the items (data-yourir-id="tcl.asx/<fileID>"). With Feed + App ID rows
// the block loads live releases and keeps the snapshot rows below as the offline fallback.
const YOURIR_APP_ID = 'a50955429d255a58';
const SOURCE_PAGE_SIZE = '15';

export default function parse(element, { document }) {
  const scope = element.closest('.asx-releases, .module--asx-releases') || element.parentElement || element;
  const items = [...element.querySelectorAll('.results-list__item')]
    .filter((item) => !item.closest('script'));

  const cells = items.map((item) => {
    const date = text(item.querySelector('.results-list__item__date'));
    const titleEl = item.querySelector('.results-list__item__title');
    const a = titleEl && titleEl.querySelector('a');
    let title = text(titleEl);
    if (a && text(a)) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href') || '#';
      link.textContent = text(a);
      title = link;
    }
    return [date, title];
  }).filter(([date, title]) => date || (typeof title === 'string' ? title : text(title)));

  // the source's static count and JS-driven pager would be dead content: drop them
  scope.querySelectorAll('.results-list__description, .results-list__pagination, script[type="text/html"]')
    .forEach((n) => { if (!element.contains(n) || n.tagName === 'SCRIPT') n.remove(); });

  if (!cells.length) return;
  const idAttr = (items.find((i) => i.getAttribute('data-yourir-id')) || element.querySelector('[data-yourir-id]'));
  const symbol = idAttr ? (idAttr.getAttribute('data-yourir-id') || '').split('/')[0] : '';
  const config = [['Page size', SOURCE_PAGE_SIZE]];
  if (symbol) config.push(['Feed', symbol], ['App ID', YOURIR_APP_ID]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'releases-list', cells: [...config, ...cells] });
  element.replaceWith(block);
}
