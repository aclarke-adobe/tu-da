/*
 * Cards Video Block
 * One row per item: caption cell (heading or text), video cell (YouTube/Vimeo
 * link, optional poster image). Cells may be in either order. Videos are
 * embedded lazily when they scroll into view; a poster image turns into a
 * click-to-play placeholder.
 */
import { videoSource, createVideoFrame, whenVisible } from '../../scripts/video-embed.js';

function findVideoLink(cell) {
  return [...cell.querySelectorAll('a[href]')].find((a) => videoSource(a.href));
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const videoCell = cells.find(findVideoLink);
    const li = document.createElement('li');
    li.className = 'cards-video-card';

    const caption = document.createElement('div');
    caption.className = 'cards-video-card-caption';
    cells.filter((c) => c !== videoCell).forEach((c) => caption.append(...c.childNodes));

    if (videoCell) {
      const link = findVideoLink(videoCell);
      const title = caption.textContent.trim() || link.textContent.trim() || 'Embedded video';
      const media = document.createElement('div');
      media.className = 'cards-video-card-video';
      const poster = videoCell.querySelector('picture');

      if (poster) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cards-video-card-play';
        button.setAttribute('aria-label', `Play ${title}`);
        media.append(poster, button);
        media.addEventListener('click', () => {
          media.replaceChildren(createVideoFrame(videoSource(link.href, true).src, title));
        }, { once: true });
      } else {
        whenVisible(media, () => media.append(createVideoFrame(videoSource(link.href).src, title)));
      }
      li.append(media);
    }

    // source order: video on top, caption underneath
    if (caption.textContent.trim()) li.append(caption);

    if (li.children.length) ul.append(li);
  });

  block.replaceChildren(ul);
}
