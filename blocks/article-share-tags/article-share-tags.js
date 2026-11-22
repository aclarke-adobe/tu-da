/*
 * Article Share Tags Block
 * Article footer bar: a Share control plus topic tag pills.
 * Rows (any order, cells optional):
 *   - a cell whose text starts with "Share" -> share control label; any network
 *     names/links in that cell choose the networks offered
 *   - every other cell -> tags (links or plain text, one per paragraph/list item)
 */
import { buildShareLink, collectNetworks } from '../../scripts/social-share.js';

function collectTags(cell) {
  const items = cell.querySelectorAll('li, p');
  const nodes = items.length ? [...items] : [cell];
  return nodes
    .filter((n) => !n.querySelector('li, p'))
    .map((n) => {
      const link = n.querySelector('a');
      return { text: (link || n).textContent.trim(), href: link?.href };
    })
    .filter((t) => t.text);
}

function buildShare(label, networks, id) {
  const wrap = document.createElement('div');
  wrap.className = 'article-share-tags-share';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'article-share-tags-share-button';
  button.textContent = label;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', id);

  const menu = document.createElement('div');
  menu.className = 'article-share-tags-share-menu';
  menu.id = id;
  menu.hidden = true;
  networks.forEach((n) => {
    const a = buildShareLink(n);
    a.textContent = a.title.replace('Share on ', '');
    menu.append(a);
  });

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };

  button.addEventListener('click', async () => {
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share({ title: document.title, url: window.location.href });
        return;
      } catch (e) {
        // fall through to menu
      }
    }
    setOpen(menu.hidden);
  });
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) setOpen(false);
  });

  wrap.append(button, menu);
  return wrap;
}

let counter = 0;

export default function decorate(block) {
  counter += 1;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const shareCell = cells.find((c) => /^share\b/i.test(c.textContent.trim()));
  const tagCells = cells.filter((c) => c !== shareCell);

  const bar = document.createElement('div');
  bar.className = 'article-share-tags-bar';

  const label = shareCell?.querySelector('p, strong')?.textContent.trim().split(/\s+/)[0] || 'Share';
  bar.append(buildShare(label, collectNetworks(shareCell), `article-share-tags-menu-${counter}`));

  const tags = tagCells.flatMap(collectTags);
  if (tags.length) {
    const ul = document.createElement('ul');
    ul.className = 'article-share-tags-tags';
    ul.setAttribute('aria-label', 'Topics');
    tags.forEach(({ text, href }) => {
      const li = document.createElement('li');
      const tag = document.createElement(href ? 'a' : 'span');
      tag.className = 'article-share-tags-tag';
      tag.textContent = text;
      if (href) tag.href = href;
      li.append(tag);
      ul.append(li);
    });
    bar.append(ul);
  }

  block.replaceChildren(bar);
}
