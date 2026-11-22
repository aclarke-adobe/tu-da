/* eslint-disable */
/* global WebImporter */

/**
 * Transurban cleanup transformer (shared by all templates).
 *
 * beforeTransform (catalog replay only; chrome is still in place so catalog
 * selectors resolve exactly as they did when captured):
 *   1. template.pageCleanup[pageUrl]: each selector in order, removed only when
 *      it matches exactly one element (none or several -> skipped).
 *   2. Catalog cleanup.rules[] for the template: every match outside main is
 *      removed, but only on pages the rule does NOT list (listed pages are
 *      already handled by their explicit pageCleanup selectors).
 *
 * afterTransform: site chrome (header, footer, accessibility links,
 * announcements, breadcrumbs, cookie/consent, modal overlays), non-content
 * elements and tracking attributes. HTML comments are never touched.
 */

// Catalog cleanup rules per template (from migration-work/catalog-template.json
// cleanup.rules[]; listedPages = pages the catalog lists for the rule).
// Add an entry when another template is migrated.
const CATALOG_CLEANUP_RULES = {
  'content-page': [
    {
      "rule": "body [class*=\"popup\"]:not(nav *)",
      "listedPages": [
        "/about-us/board-of-directors",
        "/about-us/board-of-directors/craig-drummond",
        "/about-us/board-of-directors/jane-wilson",
        "/about-us/board-of-directors/marina-go",
        "/about-us/board-of-directors/mark-birrell",
        "/about-us/board-of-directors/michael-wright",
        "/about-us/board-of-directors/patricia-cross",
        "/about-us/board-of-directors/robert-whitfield",
        "/about-us/board-of-directors/sarah-ryan",
        "/about-us/board-of-directors/tim-reed",
        "/about-us/executive-committee",
        "/about-us/executive-committee/sarah-hack",
        "/about-us/reporting",
        "/about-us/reporting/non-financial-reports-archive",
        "/archive/sustainability-old/community-grants/grant-program-recipients",
        "/campaigns/1h18-achievements",
        "/campaigns/fy18-achievements",
        "/campaigns/lep-one-year-on",
        "/communities/partnerships-and-grants/driver-training-programs",
        "/corporate-governance/whistleblower-service",
        "/investor-centre",
        "/investor-centre/asx-releases",
        "/investor-centre/debt-investors-navigation",
        "/investor-centre/distributions-tax-navigation",
        "/investor-centre/investor-calendar",
        "/investor-centre/investor-day-2021",
        "/investor-centre/investor-day-2021/northconnex",
        "/investor-centre/investor-day-2022",
        "/investor-centre/reporting-suite",
        "/investor-centre/share-price",
        "/news/linktgo-gps-technology",
        "/newsroom",
        "/partners",
        "/roads-and-projects/brisbane/qld-maintenance-projects",
        "/roads-and-projects/cavs/smartroads",
        "/suppliers",
        "/suppliers/access-faq",
        "/suppliers/permitted-registration",
        "/suppliers/permitted-registration/add-new-company-site-agreement",
        "/suppliers/permitted-registration/extend-company-expiry-date",
        "/suppliers/permitted-registration/link-company-site-agreement"
      ]
    },
    {
      "rule": "body [class*=\"modal\"]:not(nav *)",
      "listedPages": [
        "/about-us/board-of-directors",
        "/about-us/board-of-directors/craig-drummond",
        "/about-us/board-of-directors/jane-wilson",
        "/about-us/board-of-directors/marina-go",
        "/about-us/board-of-directors/mark-birrell",
        "/about-us/board-of-directors/michael-wright",
        "/about-us/board-of-directors/patricia-cross",
        "/about-us/board-of-directors/robert-whitfield",
        "/about-us/board-of-directors/sarah-ryan",
        "/about-us/board-of-directors/tim-reed",
        "/about-us/executive-committee",
        "/about-us/executive-committee/sarah-hack",
        "/about-us/reporting",
        "/about-us/reporting/non-financial-reports-archive",
        "/archive/sustainability-old/community-grants/grant-program-recipients",
        "/campaigns/1h18-achievements",
        "/campaigns/fy18-achievements",
        "/campaigns/lep-one-year-on",
        "/communities/partnerships-and-grants/driver-training-programs",
        "/corporate-governance/whistleblower-service",
        "/investor-centre",
        "/investor-centre/asx-releases",
        "/investor-centre/debt-investors-navigation",
        "/investor-centre/distributions-tax-navigation",
        "/investor-centre/investor-calendar",
        "/investor-centre/investor-day-2021",
        "/investor-centre/investor-day-2021/northconnex",
        "/investor-centre/investor-day-2022",
        "/investor-centre/reporting-suite",
        "/investor-centre/share-price",
        "/news/linktgo-gps-technology",
        "/newsroom",
        "/partners",
        "/roads-and-projects/brisbane/qld-maintenance-projects",
        "/roads-and-projects/cavs/smartroads",
        "/suppliers",
        "/suppliers/access-faq",
        "/suppliers/permitted-registration",
        "/suppliers/permitted-registration/add-new-company-site-agreement",
        "/suppliers/permitted-registration/extend-company-expiry-date",
        "/suppliers/permitted-registration/link-company-site-agreement"
      ]
    }
  ],
};

const MAIN_SELECTOR = 'main, #main, [role="main"]';

// Site chrome removed after parsers have run.
const CHROME_SELECTORS = [
  '#inner-wrap > div:nth-child(1)', // global header experience fragment
  '.globalheader',
  '#inner-wrap > div:has(> .xfpage .globalfooter)', // global footer experience fragment
  'div.globalfooter',
  '#top', // accessibility "jump to" links
  'ul.accessibility-links',
  '#yourir-default-announcement',
  '.breadcrumbs',
  '[itemprop="breadcrumb"]',
  '#modal',
  '.modal-bg',
  '.shade-bg',
  '.page-warning',
  '#react-components-root',
  '#onetrust-consent-sdk',
  '[id^="_hjSafeContext"]',
  '[id^="destination_publishing_iframe"]',
];

// Broad consent/overlay patterns: removed only outside main so authored copy
// that merely mentions cookies or consent is never touched.
const OUTSIDE_MAIN_SELECTORS = [
  '[id*="cookie"]',
  '[class*="cookie"]',
  '[id*="consent"]',
  '[class*="consent"]',
  '[class*="modal"]',
  '[class*="popup"]',
];

const NON_CONTENT_SELECTORS = [
  'script',
  'style',
  'noscript',
  'link',
  'iframe[aria-hidden="true"]',
  'iframe[style*="display: none"]',
];

const TRACKING_ATTRS = /^(on[a-z]+|data-(analytics|track|tracking|gtm|ga|adobe|dtm|yourir|cmp-data-layer)[\w-]*|data-cmp-data-layer)$/i;

function normalizePath(url) {
  if (!url) return null;
  try {
    const u = new URL(url, 'https://www.transurban.com');
    let p = u.pathname.replace(/\.html?$/i, '').replace(/\/+$/, '');
    return (p || '/').toLowerCase();
  } catch (e) {
    return null;
  }
}

function getPageUrl(element, payload) {
  const doc = (payload && payload.document) || element.ownerDocument || element;
  const candidates = [
    payload && payload.params && payload.params.originalURL,
    payload && payload.originalURL,
    payload && payload.url,
  ];
  if (doc && doc.querySelector) {
    const canonical = doc.querySelector('link[rel="canonical"]');
    const ogUrl = doc.querySelector('meta[property="og:url"]');
    candidates.push(canonical && canonical.getAttribute('href'));
    candidates.push(ogUrl && ogUrl.getAttribute('content'));
  }
  try {
    const href = doc && doc.location && doc.location.href;
    if (href && /^https?:/i.test(href) && !/localhost|127\.0\.0\.1/i.test(href)) candidates.push(href);
  } catch (e) { /* ignore */ }
  return candidates.find((c) => typeof c === 'string' && c.trim()) || null;
}

// Find the entry of a URL-keyed map (pageCleanup / pageInstances style) for this page.
function findPageEntry(map, pagePath) {
  if (!map || !pagePath) return null;
  const key = Object.keys(map).find((k) => normalizePath(k) === pagePath);
  return key ? map[key] : null;
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

function isInsideOrContainsMain(el, mains) {
  return mains.some((m) => m === el || m.contains(el) || el.contains(m));
}

function replayPageCleanup(root, template, pagePath) {
  const selectors = findPageEntry(template && template.pageCleanup, pagePath);
  if (!Array.isArray(selectors)) return;
  selectors.forEach((selector) => {
    const matches = safeQueryAll(root, selector);
    if (matches.length === 1) matches[0].remove();
  });
}

function applyCatalogRules(root, template, pagePath) {
  const rules = (template && Array.isArray(template.cleanupRules) && template.cleanupRules)
    || CATALOG_CLEANUP_RULES[template && template.name]
    || [];
  if (!rules.length) return;
  const mains = safeQueryAll(root, MAIN_SELECTOR);
  rules.forEach(({ rule, listedPages = [] }) => {
    if (!rule) return;
    if (pagePath && listedPages.some((p) => normalizePath(p) === pagePath)) return;
    safeQueryAll(root, rule).forEach((el) => {
      if (!el.isConnected) return;
      if (isInsideOrContainsMain(el, mains)) return;
      el.remove();
    });
  });
}

function removeChrome(root) {
  const mains = safeQueryAll(root, MAIN_SELECTOR);
  CHROME_SELECTORS.forEach((selector) => {
    safeQueryAll(root, selector).forEach((el) => {
      if (!el.isConnected) return;
      // never drop main or an ancestor of it
      if (mains.some((m) => el === m || el.contains(m))) return;
      el.remove();
    });
  });
  OUTSIDE_MAIN_SELECTORS.forEach((selector) => {
    safeQueryAll(root, selector).forEach((el) => {
      if (!el.isConnected || isInsideOrContainsMain(el, mains)) return;
      el.remove();
    });
  });
  WebImporter.DOMUtils.remove(root, NON_CONTENT_SELECTORS);
}

function stripTrackingAttributes(root) {
  safeQueryAll(root, '*').forEach((el) => {
    [...el.attributes].forEach(({ name }) => {
      if (TRACKING_ATTRS.test(name)) el.removeAttribute(name);
    });
  });
}

// Internal page links: make site links relative and drop the AEM ".html" extension, which
// Edge Delivery page paths don't have. Documents (PDFs etc.) and other sites keep their URLs.
const SITE_HOSTS = /^https?:\/\/(www\.)?transurban\.com/i;
function normalizeInternalLinks(root) {
  safeQueryAll(root, 'a[href]').forEach((a) => {
    let href = a.getAttribute('href');
    if (!href || /^(mailto|tel|javascript):/i.test(href) || href.startsWith('#')) return;
    if (SITE_HOSTS.test(href)) href = href.replace(SITE_HOSTS, '') || '/';
    if (!href.startsWith('/') || href.startsWith('//')) return;
    // Documents (PDFs etc.) stay on the source site: make them absolute so they keep working.
    if (href.startsWith('/content/dam/')) {
      a.setAttribute('href', `https://www.transurban.com${href}`);
      return;
    }
    // AEM-internal page paths leak into some authored links: map them to the public path.
    href = href.replace(/^\/content\/transurban\/en_au(\/content)?(?=\/|$)/i, '') || '/';
    href = href.replace(/\.html(?=$|[?#])/i, '');
    a.setAttribute('href', href);
  });
}

// Layout spacer GIFs (e.g. /content/dam/mylo/images/edm/spacer.gif on the homepage news band)
// are not content: drop them, then any wrapper (picture, link, paragraph, div, list item, table
// cell content) they leave empty. Wrappers holding an <hr> section break or a table are kept.
const SPACER_SELECTOR = 'img[src*="spacer.gif"], img[data-src*="spacer.gif"]';
const SPACER_WRAPPERS = ['PICTURE', 'A', 'P', 'SPAN', 'DIV', 'LI', 'FIGURE', 'CENTER'];
function isEmptyWrapper(el) {
  return !el.textContent.replace(/[\s ]+/g, '')
    && !el.querySelector('img, picture, iframe, video, svg, hr, table, input, select, textarea, object, embed, canvas');
}
function removeSpacerImages(root) {
  safeQueryAll(root, SPACER_SELECTOR).forEach((img) => {
    let parent = img.parentElement;
    img.remove();
    while (parent && parent !== root && SPACER_WRAPPERS.includes(parent.tagName) && isEmptyWrapper(parent)) {
      const next = parent.parentElement;
      parent.remove();
      parent = next;
    }
  });
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  if (hookName === 'beforeTransform') {
    const pagePath = normalizePath(getPageUrl(element, payload));
    replayPageCleanup(element, template, pagePath);
    applyCatalogRules(element, template, pagePath);
  }
  if (hookName === 'afterTransform') {
    removeChrome(element);
    stripTrackingAttributes(element);
    normalizeInternalLinks(element);
    // Inline data-URI images (third-party widget icons such as the FlippingBook play button)
    // can't be stored as authored assets; drop them and any link or paragraph left empty.
    // The importer later turns inline background images into <img>, so clear data-URI
    // backgrounds here too.
    safeQueryAll(element, '[style*="data:"]').forEach((el) => {
      el.style.removeProperty('background-image');
      el.style.removeProperty('background');
      if (/url\(\s*['"]?data:/i.test(el.getAttribute('style') || '')) el.removeAttribute('style');
    });
    safeQueryAll(element, 'img[src^="data:"]').forEach((img) => {
      const holder = img.closest('picture') || img;
      const p = holder.closest('p');
      holder.remove();
      if (p && !p.textContent.trim() && !p.querySelector('img, picture, iframe')) p.remove();
    });
    removeSpacerImages(element);
  }
}
