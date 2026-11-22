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
  const block = WebImporter.Blocks.createBlock(document, { name: 'releases-list', cells });
  element.replaceWith(block);
}
