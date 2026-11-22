/* eslint-disable */
/* global WebImporter */

/**
 * article-share-tags parser ("list + link").
 * Sources:
 *   - .module--article-filter .article-filter__filters-container:
 *     ul.article-filter__filters > li > a.tag (filter keywords, href "#")
 *   - cached catalog instances: .content-header .breadcrumbs ul (li > a / span)
 *   - any wrapper holding a <ul> of links
 * Block table (blocks/article-share-tags/article-share-tags.js): one row;
 * optional "Share" cell (only when the source has share links) | tags cell
 * (one list item per tag; links kept when they point somewhere real).
 */

const NETWORKS = [
  ['facebook', /facebook\.com/i],
  ['x', /(twitter|x)\.com/i],
  ['linkedin', /linkedin\.com/i],
  ['email', /^mailto:/i],
];

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function realHref(a) {
  const href = a && a.getAttribute('href');
  if (!href || href === '#' || href.startsWith('#') || /^javascript:/i.test(href)) return null;
  return href;
}

export default function parse(element, { document }) {
  const cells = [];

  // share control
  const shareLinks = [...element.querySelectorAll('a[href]')]
    .filter((a) => /facebook\.com\/sharer|(twitter|x)\.com\/intent|linkedin\.com\/(sharing|shareArticle)|addthis\.com|sharethis\.com/i.test(a.getAttribute('href') || '')
      || a.closest('.social-share, .share-links, [class*="social-share"], [class*="share-bar"]'));
  const networks = [];
  shareLinks.forEach((a) => {
    const href = a.getAttribute('href') || '';
    const hit = NETWORKS.find(([, re]) => re.test(href));
    if (hit && !networks.includes(hit[0])) networks.push(hit[0]);
  });
  let shareCell = null;
  if (shareLinks.length) {
    shareCell = [];
    const p = document.createElement('p');
    p.textContent = 'Share';
    shareCell.push(p);
    if (networks.length) {
      const ul = document.createElement('ul');
      networks.forEach((n) => {
        const li = document.createElement('li');
        li.textContent = n;
        ul.append(li);
      });
      shareCell.push(ul);
    }
  }

  // tags
  const list = element.matches('ul')
    ? element
    : element.querySelector('ul.article-filter__filters, .breadcrumbs ul, ul[itemprop="breadcrumb"], ul');
  const sources = list
    ? [...list.children].filter((li) => li.matches('li'))
    : [...element.querySelectorAll('a')].filter((a) => !shareLinks.includes(a));

  const tags = document.createElement('ul');
  sources.forEach((item) => {
    if (shareLinks.some((a) => item.contains(a))) return;
    const label = text(item);
    if (!label) return;
    const a = item.matches('a') ? item : item.querySelector('a');
    const li = document.createElement('li');
    const href = realHref(a);
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      li.append(link);
    } else {
      li.textContent = label;
    }
    tags.append(li);
  });

  const row = [];
  if (shareCell) row.push(shareCell);
  if (tags.children.length) row.push(tags);
  if (!row.length) row.push('');
  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-share-tags', cells });
  element.replaceWith(block);
}
