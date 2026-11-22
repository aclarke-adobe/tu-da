/*
 * Cards Icon Block
 * One row per item: icon cell (image or :icon:), body cell (title, optional
 * text, optional link/button).
 * - A card ending in one short plain link after an unlinked title and/or text
 *   paragraphs linking to the same page (feature tile) gets the link as an arrow
 *   pill CTA; its icon and title link there, its linked text reads as text.
 * - A linked title (h3 > a) keeps the heading colour; a leading link to the same
 *   page in the next paragraph reads as text, other links stay green.
 * - Option `tiles`: filled tiles; a tile with a single link is wrapped in it,
 *   so the whole tile is the link.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

// longest link text treated as a CTA label rather than a descriptive text link
const CTA_MAX_LENGTH = 40;

// source CTA arrow (icon--arrow-right)
const ARROW_SVG = '<svg class="cards-icon-card-cta-arrow" viewBox="0 0 25 25" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15.594 13.76H5.556c-.764 0-1.39-.57-1.39-1.265s.626-1.264 1.39-1.264h10.038V8.967c0-.569.75-.847 1.18-.442l3.861 3.527a.608.608 0 010 .898l-3.86 3.528c-.431.404-1.181.114-1.181-.443V13.76z"/></svg>';

function hasMedia(el) {
  return !!el.querySelector('picture, img, svg, .icon');
}

function isIconCell(cell) {
  return hasMedia(cell) && cell.textContent.trim() === '';
}

/** The link of a paragraph that holds nothing but that one plain (non-button) link. */
function plainLinkOnly(p) {
  if (!p || p.tagName !== 'P') return null;
  const links = p.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const [a] = links;
  if (a.classList.contains('button') || hasMedia(a)) return null;
  const text = a.textContent.trim();
  return text && p.textContent.trim() === text ? a : null;
}

function linkTo(href, ...children) {
  const a = document.createElement('a');
  a.href = href;
  a.append(...children);
  return a;
}

/** Long descriptive links authored bold stay text links, not pills. */
function unbuttonLongLinks(li) {
  li.querySelectorAll('a.button').forEach((a) => {
    if (a.textContent.trim().length <= CTA_MAX_LENGTH) return;
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    a.closest('p.button-wrapper')?.classList.remove('button-wrapper');
  });
}

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

/** Linked text that belongs to the tile (source: the whole tile is one anchor) reads as text. */
function markTextLink(a) {
  a.classList.add('cards-icon-card-text-link');
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  a.closest('p.button-wrapper')?.classList.remove('button-wrapper');
}

/**
 * Linked title (h3 > a): the source tile anchor also wraps the first line of
 * the following paragraph, so a leading link there to the same page is text.
 */
function decorateLinkedTitle(body) {
  const heading = [...body.children].find(isHeading);
  const titleLink = heading?.querySelector('a[href]');
  if (!titleLink) return;
  const p = heading.nextElementSibling;
  if (!p || p.tagName !== 'P') return;
  const first = p.firstElementChild;
  if (first?.tagName !== 'A' || first.href !== titleLink.href) return;
  if (p.textContent.trimStart().indexOf(first.textContent.trim()) !== 0) return;
  markTextLink(first);
}

/**
 * Feature tile: one short CTA link last, after an unlinked title and/or text
 * paragraphs linking to the same page; the icon (and title) link where the CTA does.
 */
function decorateFeature(li) {
  unbuttonLongLinks(li);
  const body = li.querySelector('.cards-icon-card-body');
  if (!body) return;
  decorateLinkedTitle(body);
  const children = [...body.children];
  if (children.length < 2) return;
  const p = children.pop();
  const cta = plainLinkOnly(p);
  if (!cta || cta.textContent.trim().length > CTA_MAX_LENGTH) return;
  const headings = children.filter(isHeading);
  const texts = children.filter((el) => el.tagName === 'P');
  if (headings.length > 1 || headings.length + texts.length !== children.length) return;
  if (headings.some((h) => h.querySelector('a'))) return;
  const textLinks = texts.flatMap((t) => [...t.querySelectorAll('a[href]')]);
  if (textLinks.some((a) => a.href !== cta.href || hasMedia(a))) return;

  cta.classList.add('cards-icon-card-cta');
  p.classList.add('cards-icon-card-cta-wrapper');
  texts.forEach((t) => t.classList.add('cards-icon-card-text'));
  textLinks.forEach(markTextLink);

  // source: titled feature tiles carry the arrow, text-only ones a plain pill
  const [heading] = headings;
  if (heading) {
    cta.insertAdjacentHTML('beforeend', ARROW_SVG);
    const titleLink = linkTo(cta.href);
    titleLink.className = 'cards-icon-card-title-link';
    heading.replaceWith(titleLink);
    titleLink.append(heading);
  }

  const icon = li.querySelector('.cards-icon-card-icon');
  if (icon && icon.firstElementChild) {
    const iconLink = linkTo(cta.href, ...icon.childNodes);
    iconLink.tabIndex = -1;
    iconLink.setAttribute('aria-hidden', 'true');
    icon.append(iconLink);
  }
}

/** Tile: a tile whose only link is its title (the link fills its element) becomes that link. */
function decorateTile(li) {
  const links = li.querySelectorAll('a[href]');
  if (links.length !== 1) return;
  const [link] = links;
  if (link.parentElement.textContent.trim() !== link.textContent.trim()) return;
  const tileLink = linkTo(link.href);
  tileLink.className = 'cards-icon-card-link';
  if (link.title) tileLink.title = link.title;
  if (link.target) tileLink.target = link.target;
  const wrapper = link.closest('p.button-wrapper');
  link.replaceWith(...link.childNodes);
  if (wrapper) wrapper.classList.remove('button-wrapper');
  tileLink.append(...li.childNodes);
  li.append(tileLink);
  li.classList.add('cards-icon-card-linked');
}

/** Column count on desktop: up to 4 in a row, rows of 3 unless the items fill rows of 4. */
function columns(count) {
  if (count <= 4) return count;
  return count % 4 === 0 ? 4 : 3;
}

export default function decorate(block) {
  const tiles = block.classList.contains('tiles');
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || hasMedia(c));
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-icon-card';
    cells.forEach((cell) => {
      cell.className = isIconCell(cell) ? 'cards-icon-card-icon' : 'cards-icon-card-body';
      li.append(cell);
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });

  [...ul.children].forEach((li) => (tiles ? decorateTile(li) : decorateFeature(li)));

  ul.classList.add(`cards-icon-cols-${Math.max(1, columns(ul.children.length))}`);
  block.replaceChildren(ul);
}
