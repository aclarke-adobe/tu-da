/* eslint-disable */
/* global WebImporter */

/**
 * alert-banner parser.
 * Source: div.alert-v2 > .module--alert > ... > .alert__contents with
 *   .alert__icon (span.icon.icon--<name> containing an inline svg),
 *   .alert__details (p with text and a.alert__details-link),
 *   a.alert__close (dropped; the block renders its own dismiss button).
 * Block table (blocks/alert-banner/alert-banner.js):
 *   one row: icon cell (optional, :name: icon notation) | message cell (text with link).
 */

const ICON_MODIFIERS = /^icon--(white|black|small|medium|large|theme-.*|arrow-right|arrow-left)$/;

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function iconCell(document, root) {
  const img = root.querySelector('.alert__icon img[src]');
  if (img) {
    const out = document.createElement('img');
    out.src = img.getAttribute('src');
    out.alt = img.getAttribute('alt') || '';
    return out;
  }
  const span = root.querySelector('.alert__icon span[class*="icon--"]');
  if (span) {
    const name = [...span.classList]
      .filter((c) => c.startsWith('icon--') && !ICON_MODIFIERS.test(c))
      .map((c) => c.slice(6))[0];
    if (name) {
      const p = document.createElement('p');
      p.textContent = `:${name}:`;
      return p;
    }
  }
  return '';
}

/** Rebuild a paragraph as clean text + links, collapsing whitespace. */
function cleanParagraph(document, srcP) {
  const p = document.createElement('p');
  const parts = [];
  srcP.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      const t = node.textContent.replace(/[\s ]+/g, ' ');
      if (t.trim()) parts.push(t.trim());
    } else if (node.nodeType === 1) {
      if (node.matches('svg, script, style, .icon')) return;
      if (node.tagName === 'A') {
        const label = text(node);
        const href = node.getAttribute('href');
        if (!label || !href) return;
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        parts.push(a);
      } else if (['STRONG', 'B', 'EM', 'I'].includes(node.tagName)) {
        const label = text(node);
        if (!label) return;
        const el = document.createElement(node.tagName.toLowerCase());
        el.textContent = label;
        parts.push(el);
      } else {
        const label = text(node);
        if (label) parts.push(label);
      }
    }
  });
  parts.forEach((part, i) => {
    if (i > 0) p.append(' ');
    p.append(part);
  });
  return p.childNodes.length ? p : null;
}

export default function parse(element, { document }) {
  const details = element.querySelector('.alert__details');
  const message = [];

  if (details) {
    const paras = [...details.querySelectorAll('p')];
    paras.forEach((srcP) => {
      const p = cleanParagraph(document, srcP);
      if (p) message.push(p);
    });
    if (!paras.length) {
      const p = cleanParagraph(document, details);
      if (p) message.push(p);
    }
    // Link outside any paragraph (defensive)
    const link = details.querySelector('a.alert__details-link[href]');
    if (link && !link.closest('p')) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = text(link);
      if (text(link) && !message.some((m) => m.querySelector(`a[href="${a.href}"]`))) {
        const p = document.createElement('p');
        p.append(a);
        message.push(p);
      }
    }
  }

  if (!message.length) {
    element.remove();
    return;
  }

  const cells = [[iconCell(document, element), message]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'alert-banner', cells });
  element.replaceWith(block);
}
