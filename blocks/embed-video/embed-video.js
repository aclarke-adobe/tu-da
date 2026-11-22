/*
 * Embed Video Block
 * One cell with a YouTube or Vimeo link, optionally a poster image.
 * Without a poster the iframe loads when the block scrolls into view; with a
 * poster it loads (autoplaying) on click. Unknown URLs fall back to a
 * generic iframe.
 */
import { videoSource, createVideoFrame, whenVisible } from '../../scripts/video-embed.js';

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  const { href } = link;
  const poster = block.querySelector('picture');
  const title = (link.title || link.textContent.trim() || 'Embedded video').replace(/^https?:\/\/\S+$/, 'Embedded video');

  const frame = document.createElement('div');
  frame.className = 'embed-video-frame';

  const load = (autoplay) => {
    const source = videoSource(href, autoplay);
    if (source) {
      block.classList.add(`embed-video-${source.provider}`);
      frame.replaceChildren(createVideoFrame(source.src, title));
    } else if (/^https?:/i.test(href)) {
      frame.replaceChildren(createVideoFrame(href, title));
    }
    block.classList.add('embed-video-is-loaded');
  };

  if (poster) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'embed-video-play';
    button.setAttribute('aria-label', `Play ${title}`);
    frame.classList.add('embed-video-placeholder');
    frame.append(poster, button);
    frame.addEventListener('click', () => load(true), { once: true });
  } else {
    whenVisible(block, () => load(false));
  }

  block.replaceChildren(frame);
}
