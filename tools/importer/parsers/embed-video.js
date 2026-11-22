/* eslint-disable */
/* global WebImporter */

/**
 * embed-video parser.
 * Sources: div.video.embed, div.richContentContainer:has(.module--video-embed),
 * or the bare .video-embed-container > div.video; the video is the iframe src.
 * Block table (blocks/embed-video/embed-video.js): one cell holding the video
 * link (optional poster image above it).
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
  const iframe = element.matches('iframe') ? element : element.querySelector('.video iframe, iframe');
  const src = iframe && (iframe.getAttribute('src') || iframe.getAttribute('data-src'));

  const content = [];
  const poster = element.querySelector('.video img, .video-embed-container img');
  if (poster && poster.getAttribute('src')) {
    const img = document.createElement('img');
    img.src = poster.getAttribute('src');
    img.alt = poster.getAttribute('alt') || '';
    content.push(img);
  }
  if (src) {
    const a = document.createElement('a');
    a.href = videoUrl(src);
    a.textContent = a.href;
    const title = iframe.getAttribute('title');
    if (title && !/youtube video player/i.test(title)) a.title = title;
    content.push(a);
  }
  cells.push([content]);

  // News articles: the source is a rich-text <p> holding the iframe, which can
  // also carry a caption/link after it (e.g. "<br><a>See the full length tunnel
  // tour</a>"). The block only reads its first link, so keep that leftover
  // content as a paragraph after the block instead of dropping it.
  let trailing = null;
  if (element.matches('p')) {
    const rest = element.cloneNode(true);
    rest.querySelectorAll('iframe').forEach((n) => n.remove());
    while (rest.firstChild && (rest.firstChild.nodeName === 'BR'
      || (rest.firstChild.nodeType === 3 && !rest.firstChild.textContent.replace(/[\s ]+/g, '')))) {
      rest.firstChild.remove();
    }
    if (rest.textContent.replace(/[\s ]+/g, '') || rest.querySelector('img')) {
      trailing = document.createElement('p');
      trailing.append(...rest.childNodes);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  if (trailing) element.replaceWith(block, trailing);
  else element.replaceWith(block);
}
