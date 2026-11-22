/* eslint-disable */
/* global WebImporter */

/**
 * social-share parser.
 * Source: AddToAny kit div.a2a_kit > a.a2a_button_<network> (svg icon span +
 *   span.a2a_label "Twitter" / "Facebook" / "LinkedIn" / "WhatsApp" / ...).
 *   The hrefs are AddToAny placeholders (https://www.transurban.com/#twitter)
 *   that only work with the AddToAny script, so they are not kept.
 * Block table (blocks/social-share/social-share.js): one row, one cell with a
 * paragraph per network name; the block builds the real share URLs for the
 * current page. Order and selection follow the source kit.
 */

const NETWORKS = {
  twitter: 'Twitter',
  x: 'Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  email: 'Email',
};

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

export default function parse(element, { document }) {
  const kit = element.matches('.a2a_kit') ? element : (element.querySelector('.a2a_kit') || element);
  const names = [];
  kit.querySelectorAll('a').forEach((a) => {
    const cls = [...a.classList].find((c) => c.startsWith('a2a_button_'));
    const key = cls ? cls.replace('a2a_button_', '').toLowerCase() : '';
    const probe = `${key} ${a.getAttribute('href') || ''} ${text(a)}`.toLowerCase();
    const hit = Object.keys(NETWORKS).find((k) => (k === 'x' ? key === 'x' : probe.includes(k)))
      || (/mailto:/.test(probe) ? 'email' : null);
    if (hit && !names.includes(NETWORKS[hit])) names.push(NETWORKS[hit]);
  });
  if (!names.length) names.push('Twitter', 'Facebook', 'LinkedIn', 'WhatsApp');

  const content = names.map((n) => {
    const p = document.createElement('p');
    p.textContent = n;
    return p;
  });

  const cells = [[content]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'social-share', cells });
  element.replaceWith(block);
}
