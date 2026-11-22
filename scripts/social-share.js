/*
 * Shared social-share helpers used by social-share and article-share-tags.
 */

export const NETWORKS = {
  twitter: {
    label: 'X (Twitter)',
    match: ['twitter', '//x.com', 'www.x.com'],
    url: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
  },
  facebook: {
    label: 'Facebook',
    match: ['facebook'],
    url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  },
  linkedin: {
    label: 'LinkedIn',
    match: ['linkedin'],
    url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  },
  whatsapp: {
    label: 'WhatsApp',
    match: ['whatsapp', 'wa.me'],
    url: (u, t) => `https://api.whatsapp.com/send?text=${t}%20${u}`,
  },
  email: {
    label: 'Email',
    match: ['email', 'mailto'],
    url: (u, t) => `mailto:?subject=${t}&body=${u}`,
  },
};

export const DEFAULT_NETWORKS = ['twitter', 'facebook', 'linkedin', 'whatsapp'];

/**
 * Resolve a network key from free text or an href.
 * @param {string} value
 * @returns {string|null}
 */
export function resolveNetwork(value) {
  const v = String(value || '').toLowerCase();
  return Object.keys(NETWORKS)
    .find((key) => NETWORKS[key].match.some((m) => v.includes(m))) || null;
}

/**
 * Build a share link for the current page.
 * @param {string} network key of NETWORKS
 * @returns {HTMLAnchorElement}
 */
export function buildShareLink(network) {
  const cfg = NETWORKS[network];
  const u = encodeURIComponent(window.location.href);
  const t = encodeURIComponent(document.title);
  const a = document.createElement('a');
  a.href = cfg.url(u, t);
  a.className = `share-link share-link-${network}`;
  a.dataset.network = network;
  a.setAttribute('aria-label', `Share on ${cfg.label}`);
  a.title = `Share on ${cfg.label}`;
  if (network !== 'email') {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return a;
}

/**
 * Collect the networks an author listed in an element (links or plain text).
 * Falls back to DEFAULT_NETWORKS.
 * @param {Element} el
 * @returns {string[]}
 */
export function collectNetworks(el) {
  const found = [];
  const candidates = el
    ? [...el.querySelectorAll('a, li, p')].map((n) => `${n.getAttribute('href') || ''} ${n.textContent}`)
    : [];
  candidates.forEach((c) => {
    const key = resolveNetwork(c);
    if (key && !found.includes(key)) found.push(key);
  });
  return found.length ? found : [...DEFAULT_NETWORKS];
}
