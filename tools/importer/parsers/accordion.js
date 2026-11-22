/* eslint-disable */
/* global WebImporter */

/**
 * accordion parser.
 * Sources: div.richContentContainer / div.contentaccordion / ul.ec-calendar__list
 * holding .cmp-accordion__item (title: .cmp-accordion__title, body:
 * .cmp-accordion__panel with one or more .rich-text columns).
 * Block table (blocks/accordion/accordion.js): one row per item, label | body.
 * A body with an embedded video iframe (another block) is moved into a
 * fragment (params.fragments) holding the text plus an embed-video block; the
 * body cell then holds only the /fragments/ link. Text/link bodies stay inline
 * (multi-column link lists are flattened in document order).
 */

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'item';
}

function isEmpty(el) {
  return !el.textContent.replace(/[\s ]/g, '') && !el.querySelector('img, iframe');
}

function cleanNode(el) {
  el.querySelectorAll('svg, .icon, script, style').forEach((n) => n.remove());
  [el, ...el.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    if (n.tagName !== 'A') n.removeAttribute('class');
  });
  return el;
}

/** Rich text children of a panel, in document order, flattened across columns. */
function panelContent(panel) {
  const out = [];
  const texts = [...panel.querySelectorAll('.rich-text')];
  const roots = texts.length ? texts : [panel.querySelector('.ec-calendar__list__item__content') || panel];
  roots.forEach((rt) => {
    [...rt.children].forEach((child) => {
      if (isEmpty(child)) return;
      out.push(cleanNode(child));
    });
  });
  return out;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const fragments = params && Array.isArray(params.fragments) ? params.fragments : null;

  const items = [...element.querySelectorAll('.cmp-accordion__item')]
    .filter((item) => !item.parentElement.closest('.cmp-accordion__item'));

  items.forEach((item) => {
    const titleEl = item.querySelector('.cmp-accordion__title');
    const panel = item.querySelector('.cmp-accordion__panel');
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!title && !panel) return;

    const label = document.createElement('p');
    label.textContent = title;

    let body = panel ? panelContent(panel) : [];

    const hasVideo = body.some((n) => n.matches('iframe') || n.querySelector('iframe'));
    if (hasVideo && fragments) {
      const fragEl = document.createElement('div');
      body.forEach((n) => {
        const frames = n.matches('iframe') ? [n] : [...n.querySelectorAll('iframe')];
        if (!frames.length) {
          fragEl.append(n);
          return;
        }
        // text around the iframe stays as default content
        frames.forEach((f) => f.remove());
        if (!isEmpty(n)) fragEl.append(n);
        frames.forEach((f) => {
          const src = f.getAttribute('src') || f.getAttribute('data-src');
          if (!src) return;
          const a = document.createElement('a');
          a.href = src.startsWith('//') ? `https:${src}` : src;
          a.textContent = a.href;
          const video = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells: [[a]] });
          fragEl.append(video);
        });
      });
      // same question repeated on a page shares one fragment; differing content gets a suffix
      const base = `/fragments/accordion/${slugify(title)}`;
      let path = base;
      let n = 1;
      let existing = fragments.find((f) => f.path === path);
      while (existing && existing.element.textContent.trim() !== fragEl.textContent.trim()) {
        n += 1;
        path = `${base}-${n}`;
        existing = fragments.find((f) => f.path === path);
      }
      if (!existing) fragments.push({ element: fragEl, path });
      const link = document.createElement('a');
      link.href = path;
      link.textContent = path;
      body = [link];
    } else if (hasVideo) {
      // no fragment channel: keep the video as a plain link inline
      body.forEach((n) => {
        const frames = n.matches('iframe') ? [n] : [...n.querySelectorAll('iframe')];
        frames.forEach((f) => {
          const src = f.getAttribute('src') || '';
          const a = document.createElement('a');
          a.href = src.startsWith('//') ? `https:${src}` : src;
          a.textContent = f.getAttribute('title') || a.href;
          f.replaceWith(a);
        });
      });
    }

    cells.push([label, body]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
