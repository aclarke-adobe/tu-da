/*
 * Accordion Block
 * One row per item: label cell, body cell. Each label becomes a button that
 * toggles its body panel (WAI-ARIA accordion pattern). A body that is only a
 * link to a page path (e.g. /fragments/...) is loaded as a fragment.
 */
import { loadFragment } from '../fragment/fragment.js';

function fragmentPath(body) {
  const links = body.querySelectorAll('a[href]');
  if (links.length !== 1 || body.textContent.trim() !== links[0].textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  return url.pathname.includes('/fragments/') ? url.pathname : null;
}

function setExpanded(button, expanded) {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', String(expanded));
  button.closest('.accordion-item').classList.toggle('is-open', expanded);
  if (panel) panel.hidden = !expanded;
}

export default async function decorate(block) {
  const prefix = block.id || `accordion-${[...document.querySelectorAll('.accordion')].indexOf(block) + 1}`;
  const loads = [];

  [...block.children].forEach((row, i) => {
    const [label, body] = row.children;
    if (!label || !label.textContent.trim()) {
      row.remove();
      return;
    }
    const id = `${prefix}-item-${i + 1}`;

    const title = document.createElement('span');
    title.className = 'accordion-item-title';
    // a single wrapping paragraph/heading in the label cell is unwrapped
    const only = label.children.length === 1 && label.firstElementChild;
    title.append(...(only && only.textContent.trim() === label.textContent.trim()
      ? only.childNodes : label.childNodes));

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'accordion-item-label';
    button.id = `${id}-button`;
    button.setAttribute('aria-controls', `${id}-panel`);
    button.setAttribute('aria-expanded', 'false');
    button.append(title);

    const panel = body || document.createElement('div');
    panel.className = 'accordion-item-body';
    panel.id = `${id}-panel`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    panel.hidden = true;

    row.className = 'accordion-item';
    row.replaceChildren(button, panel);

    const path = fragmentPath(panel);
    if (path) {
      loads.push(loadFragment(path).then((fragment) => {
        if (fragment) panel.replaceChildren(...fragment.childNodes);
      }));
    }
  });

  block.addEventListener('click', (e) => {
    const button = e.target.closest('.accordion-item-label');
    if (!button || !block.contains(button)) return;
    setExpanded(button, button.getAttribute('aria-expanded') !== 'true');
  });

  await Promise.all(loads);
}
