/* eslint-disable */
/* global WebImporter */

/**
 * cards-video parser.
 * Source: div.richContentContainer grid; each card is a
 * .video-embed-container > div.video holding a <p><iframe></p> and a caption <p>.
 * Block table (blocks/cards-video/cards-video.js): one row per card,
 * caption cell | video cell (video link).
 */

function videoUrl(src) {
  let href = src.trim();
  if (href.startsWith('//')) href = `https:${href}`;
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, '');
    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      const m = url.pathname.match(/\/embed\/([^/?]+)/);
      if (m) return `https://www.youtube.com/watch?v=${m[1]}`;
    }
    return url.href;
  } catch (e) {
    return href;
  }
}

export default function parse(element, { document }) {
  const cells = [];

  let items = [...element.querySelectorAll('.video-embed-container .video')];
  if (!items.length) items = [...element.querySelectorAll('.gridItem')].filter((g) => g.querySelector('iframe'));

  items.forEach((item) => {
    const iframe = item.querySelector('iframe');
    const src = iframe && (iframe.getAttribute('src') || iframe.getAttribute('data-src'));
    if (!src) return;

    const caption = [];
    [...item.querySelectorAll('h1, h2, h3, h4, h5, h6, p')].forEach((n) => {
      if (n.querySelector('iframe')) return;
      if (!n.textContent.replace(/[\s ]/g, '')) return;
      n.removeAttribute('style');
      n.removeAttribute('class');
      caption.push(n);
    });

    const a = document.createElement('a');
    a.href = videoUrl(src);
    // short label: the caption already titles the card (decorate uses it for the iframe title)
    const frameTitle = (iframe.getAttribute('title') || '').trim();
    a.textContent = frameTitle && !/youtube video player/i.test(frameTitle) ? frameTitle : 'Video';

    cells.push([caption, [a]]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video', cells });
  element.replaceWith(block);
}
