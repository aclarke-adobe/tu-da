/*
 * Tabs Panels Block
 * One row per tab: label cell, panel cell. A panel whose only content is a
 * link to a /fragments/ page is loaded from that fragment, so panels can hold
 * other blocks (document lists, maps, cards). Option `light`: light tab style.
 * Keyboard: arrow keys, Home and End move between tabs.
 */
import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let blockCount = 0;

function fragmentPath(panel) {
  const links = panel.querySelectorAll('a[href]');
  if (links.length !== 1 || panel.textContent.trim() !== links[0].textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname;
}

export default async function decorate(block) {
  blockCount += 1;
  const prefix = `tabs-panels-${blockCount}`;
  const tablist = document.createElement('div');
  tablist.className = 'tabs-panels-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children].filter((row) => row.firstElementChild?.textContent.trim());
  [...block.children].forEach((row) => {
    if (!rows.includes(row)) row.remove();
  });

  const buttons = [];
  const panels = [];
  const loads = [];

  const select = (index, focus) => {
    buttons.forEach((b, i) => {
      b.setAttribute('aria-selected', String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((p, i) => p.setAttribute('aria-hidden', String(i !== index)));
    if (focus) buttons[index].focus();
  };

  rows.forEach((row, i) => {
    const [label, content] = row.children;
    const id = `${prefix}-${toClassName(label.textContent) || i}`;

    const panel = content || document.createElement('div');
    panel.className = 'tabs-panels-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.tabIndex = 0;
    row.replaceWith(panel);
    panels.push(panel);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-panels-tab';
    button.id = `tab-${id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.append(...(label.querySelector('p') && label.children.length === 1
      ? label.firstElementChild.childNodes : label.childNodes));
    button.addEventListener('click', () => select(i));
    buttons.push(button);
    tablist.append(button);

    const path = fragmentPath(panel);
    if (path) {
      panel.classList.add('tabs-panels-panel-fragment');
      loads.push(loadFragment(path).then((fragment) => {
        if (fragment) panel.replaceChildren(...fragment.childNodes);
      }));
    }
  });

  tablist.addEventListener('keydown', (e) => {
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    const last = buttons.length - 1;
    const next = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next, true);
  });

  block.prepend(tablist);
  if (buttons.length) select(0);
  await Promise.all(loads);
}
