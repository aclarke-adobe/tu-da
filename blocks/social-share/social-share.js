/*
 * Social Share Block
 * Row of share buttons for the current page. Authors list the networks as
 * links or plain names (Twitter/X, Facebook, LinkedIn, WhatsApp, Email), one
 * per cell, paragraph or list item. An empty block shows the default set
 * (Twitter, Facebook, LinkedIn, WhatsApp). Authored icons are kept; otherwise
 * each network gets a 24px brand-coloured tile (source AddToAny kit).
 */
import { buildShareLink, collectNetworks, resolveNetwork } from '../../scripts/social-share.js';

/* white glyphs on a 32x32 viewBox (source AddToAny icons) */
const GLYPHS = {
  twitter: '<path fill="#fff" d="M28 8.557a10 10 0 0 1-2.828.775 4.93 4.93 0 0 0 2.166-2.725 9.7 9.7 0 0 1-3.13 1.194 4.92 4.92 0 0 0-3.593-1.55 4.924 4.924 0 0 0-4.794 6.049c-4.09-.21-7.72-2.17-10.15-5.15a4.94 4.94 0 0 0-.665 2.477c0 1.71.87 3.214 2.19 4.1a5 5 0 0 1-2.23-.616v.06c0 2.39 1.7 4.38 3.952 4.83-.414.115-.85.174-1.297.174q-.476-.001-.928-.086a4.935 4.935 0 0 0 4.6 3.42 9.9 9.9 0 0 1-6.114 2.107q-.597 0-1.175-.068a13.95 13.95 0 0 0 7.55 2.213c9.056 0 14.01-7.507 14.01-14.013q0-.32-.015-.637c.96-.695 1.795-1.56 2.455-2.55z"/>',
  facebook: '<path fill="#fff" d="M28 16c0-6.627-5.373-12-12-12S4 9.373 4 16c0 5.628 3.875 10.35 9.101 11.647v-7.98h-2.474V16H13.1v-1.58c0-4.085 1.849-5.978 5.859-5.978.76 0 2.072.15 2.608.298v3.325c-.283-.03-.775-.045-1.386-.045-1.967 0-2.728.745-2.728 2.683V16h3.92l-.673 3.667h-3.247v8.245C23.395 27.195 28 22.135 28 16"/>',
  linkedin: '<path fill="#fff" d="M6.227 12.61h4.19v13.48h-4.19zm2.095-6.7a2.43 2.43 0 0 1 0 4.86c-1.344 0-2.428-1.09-2.428-2.43s1.084-2.43 2.428-2.43m4.72 6.7h4.02v1.84h.058c.56-1.058 1.927-2.176 3.965-2.176 4.238 0 5.02 2.792 5.02 6.42v7.395h-4.183v-6.56c0-1.564-.03-3.574-2.178-3.574-2.18 0-2.514 1.7-2.514 3.46v6.668h-4.187z"/>',
  whatsapp: '<path fill="#fff" fill-rule="evenodd" d="M16.21 4.41C9.973 4.41 4.917 9.465 4.917 15.7c0 2.134.592 4.13 1.62 5.832L4.5 27.59l6.25-2.002a11.24 11.24 0 0 0 5.46 1.404c6.234 0 11.29-5.055 11.29-11.29 0-6.237-5.056-11.292-11.29-11.292m0 20.69c-1.91 0-3.69-.57-5.173-1.553l-3.61 1.156 1.173-3.49a9.35 9.35 0 0 1-1.79-5.512c0-5.18 4.217-9.4 9.4-9.4s9.397 4.22 9.397 9.4c0 5.188-4.214 9.4-9.398 9.4zm5.293-6.832c-.284-.155-1.673-.906-1.934-1.012-.265-.106-.455-.16-.658.12s-.78.91-.954 1.096c-.176.186-.345.203-.628.048-.282-.154-1.2-.494-2.264-1.517-.83-.795-1.373-1.76-1.53-2.055s0-.445.15-.584c.134-.124.3-.326.45-.488.15-.163.203-.28.306-.47.104-.19.06-.36-.005-.506-.066-.147-.59-1.587-.81-2.173-.218-.586-.46-.498-.63-.505-.168-.007-.358-.038-.55-.045-.19-.007-.51.054-.78.332-.277.274-1.05.943-1.1 2.362-.055 1.418.926 2.826 1.064 3.023.137.2 1.874 3.272 4.76 4.537 2.888 1.264 2.9.878 3.43.85.53-.027 1.734-.633 2-1.297s.287-1.24.22-1.363c-.07-.123-.26-.203-.54-.357z" clip-rule="evenodd"/>',
  email: '<path fill="#fff" d="M27 21.775v-9.940s-10.414 7.174-11.234 7.393S5 11.835 5 11.835v9.940c0 1.380.292 1.668 1.665 1.668h18.670c1.373 0 1.665-.288 1.665-1.668m-.015-11.732c0-1.003-.297-1.543-1.715-1.543H6.730c-1.418 0-1.715.540-1.715 1.543l.030.250s10.375 7.140 10.955 7.330 10.980-7.330 10.980-7.330z"/>',
};

function buildTile(network) {
  const tile = document.createElement('span');
  tile.className = 'social-share-tile';
  tile.innerHTML = `<svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${GLYPHS[network] || ''}</svg>`;
  return tile;
}

export default function decorate(block) {
  const icons = {};
  const names = {};
  block.querySelectorAll('a, p, li').forEach((node) => {
    const key = resolveNetwork(`${node.getAttribute('href') || ''} ${node.textContent}`);
    if (!key) return;
    const icon = node.querySelector('picture, img, .icon');
    if (icon && !icons[key]) icons[key] = icon;
    const text = node.textContent.trim();
    if (text && !names[key]) names[key] = text;
  });

  const ul = document.createElement('ul');
  ul.className = 'social-share-list';
  ul.setAttribute('aria-label', 'Share this page');
  collectNetworks(block).forEach((network) => {
    const li = document.createElement('li');
    const a = buildShareLink(network);
    a.append(icons[network] || buildTile(network));
    const label = document.createElement('span');
    label.className = 'social-share-label';
    label.textContent = names[network] || a.title.replace('Share on ', '');
    a.append(label);
    li.append(a);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
