/* eslint-disable */
/* global WebImporter */

/**
 * cards-news parser.
 * Source (news articles, "More from our newsroom"): div.filtercontent >
 * .module--article-filter with server-rendered tiles
 * a.feature-tile.feature-tile--news[href] (one per article):
 *   .feature-tile__image-container img, .feature-tile__date,
 *   .feature-tile__title, .feature-tile__text.
 * Ignored: the hidden .article-filter__no-data-for-keyword message and the
 * handlebars <script id="news-article-template"> markup ({{...}} placeholders).
 * Block table (blocks/cards-news/cards-news.js, library "Cards" convention):
 * 2 columns, one row per tile: image cell | text cell (date paragraph,
 * linked headline, excerpt).
 */

const PLACEHOLDER_ALT = /feature tile img alt text/i;

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function isTemplate(value) {
  return /\{\{/.test(value || '');
}

export default function parse(element, { document }) {
  const cells = [];

  const tiles = [...element.querySelectorAll('.feature-tile--news')]
    .filter((tile) => !tile.closest('script, template, .article-filter__no-data-for-keyword'))
    .filter((tile) => !isTemplate(tile.getAttribute('href')) && !isTemplate(text(tile.querySelector('.feature-tile__title'))));

  tiles.forEach((tile) => {
    const title = text(tile.querySelector('.feature-tile__title'));
    let href = tile.matches('a[href]') ? tile.getAttribute('href') : '';
    if (!href) {
      const inner = tile.querySelector('a[href]');
      href = inner ? inner.getAttribute('href') : '';
    }

    // image cell
    let imageCell = '';
    const srcImg = tile.querySelector('.feature-tile__image-container img, img.feature-tile__image');
    const imgSrc = srcImg && srcImg.getAttribute('src');
    if (imgSrc && !isTemplate(imgSrc)) {
      const img = document.createElement('img');
      img.src = imgSrc;
      const alt = srcImg.getAttribute('alt') || '';
      img.alt = PLACEHOLDER_ALT.test(alt) ? title : alt;
      imageCell = img;
    }

    // text cell
    const body = [];
    const date = text(tile.querySelector('.feature-tile__date'));
    if (date) {
      const p = document.createElement('p');
      p.textContent = date;
      body.push(p);
    }
    if (title) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        h.append(a);
      } else {
        h.textContent = title;
      }
      body.push(h);
    }
    const excerpt = text(tile.querySelector('.feature-tile__text'));
    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt;
      body.push(p);
    }

    if (!imageCell && !body.length) return;
    cells.push([imageCell, body.length ? body : '']);
  });

  if (!cells.length) cells.push(['', '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });

  // Keep the list's visible heading ("From our newsroom") as default content above the cards;
  // skip the hidden "No articles found" message and any handlebars template text.
  const heading = [...element.querySelectorAll('h1, h2, h3, h4')]
    .find((h) => {
      const t = text(h);
      return t && !/no articles found/i.test(t) && !isTemplate(t) && !h.closest('.feature-tile');
    });
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = text(heading);
    element.replaceWith(h, block);
  } else {
    element.replaceWith(block);
  }
}
