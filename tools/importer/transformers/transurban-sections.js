/* eslint-disable */
/* global WebImporter */

/**
 * Transurban sections transformer (shared by all templates).
 *
 * 1. Template sections (payload.template.sections: { id, name, selector[], style,
 *    blocks, defaultContent }):
 *    beforeTransform: resolve each section element (selectors tried in order),
 *    then walk sections in reverse and insert an <hr> before every non-first
 *    section while the parser target elements still exist. Styled sections get
 *    a temporary data-excat-section-id marker on their <hr>; a styled first
 *    section gets a temporary marked <hr> too.
 *    afterTransform: walk sections in reverse and add a Section Metadata block
 *    (style) after the marker <hr> or the surviving section element, then drop
 *    the marker attribute and the first section's temporary <hr>.
 *
 * 2. Bands (every template, beforeTransform while parser targets still exist):
 *    each `#main > div > div` component is classified and runs of consecutive
 *    components with the same style become their own section:
 *      - `legal`  component holding ol.legal-accordion (terms-of-use, privacy);
 *                 each such <ol> also gets start="N" from its class start-N
 *                 (N is the clause number the source prefixes to items: N.1, N.2)
 *      - `grey`   light backgrounds (#f3f3f3, #f2f2f2, #eee, #e1ddda, #acb8b6 ...)
 *      - `dark`   slate / charcoal / dark teal (#313e48, #2c2a29, #0b4c45 ...)
 *      - `black`  near-black (#222, rgb(34,34,34), #101010)
 *      - `green`  brand greens (#0e893c, #0d9d4f, #009d4e)
 *    The colour comes from the component's outermost .module / .content-banner
 *    (inline background-color, or module--grey|dark|black|green,
 *    content-banner--dark|grey|green|bg-theme classes). White/none = no band.
 *    Never split inside a block (data-excat-block); components that are, or
 *    contain, a block with its own fill (hero-banner, alert-banner, author-bio,
 *    columns-media boxed i.e. on a non-grey band) get no band.
 *    News articles: the .news-article__leading paragraph (20px/34px on the
 *    source) becomes its own section with Style `lead`.
 *    afterTransform: a Section Metadata block (style) goes after each band <hr>.
 *
 * 3. afterTransform: sections left with no content (only <hr>s and/or Section
 *    Metadata, e.g. a band that starts right at a template section break) are
 *    collapsed so no empty section is emitted.
 */

const MARKER_ATTR = 'data-excat-section-id';
const BAND_ATTR = 'data-excat-band';
const BAND_END_ATTR = 'data-excat-band-end';

// Blocks that paint their own background: a coloured band that IS one of these keeps the
// block styling and needs no section style.
const SELF_FILLED_BLOCKS = ['hero-banner', 'alert-banner', 'author-bio'];

function toSelectorList(selector) {
  if (Array.isArray(selector)) return selector.filter(Boolean);
  return selector ? [selector] : [];
}

function safeQuery(root, selector) {
  try {
    return root.querySelector(selector);
  } catch (e) {
    return null;
  }
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

function overlaps(a, b) {
  return a === b || a.contains(b) || b.contains(a);
}

/**
 * Resolve one element per section. A candidate that is, contains or sits
 * inside an element already claimed by another section is skipped and the
 * next selector is tried (e.g. "#inner-wrap > div.root.responsivegrid" wraps
 * the page header, so "#main" is used for main-content).
 */
function resolveSectionElements(root, sections) {
  const claimed = [];
  return sections.map((section) => {
    const selectors = toSelectorList(section.selector);
    for (let i = 0; i < selectors.length; i += 1) {
      const el = safeQuery(root, selectors[i]);
      if (el && !claimed.some((c) => overlaps(c, el))) {
        claimed.push(el);
        return el;
      }
    }
    return null;
  });
}

function hasStyle(section) {
  const { style } = section || {};
  if (Array.isArray(style)) return style.filter(Boolean).length > 0;
  return typeof style === 'string' && style.trim().length > 0;
}

function styleValue(section) {
  return Array.isArray(section.style) ? section.style.filter(Boolean).join(', ') : section.style.trim();
}

/* ---------- band colour classification ---------- */

function parseColor(value) {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  let m = v.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  m = v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,/]+([\d.]+%?))?/);
  if (m) {
    if (m[4] !== undefined) {
      const a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      if (a < 0.5) return null; // (mostly) transparent
    }
    return [m[1], m[2], m[3]].map(Number);
  }
  if (/\b(white)\b/.test(v)) return [255, 255, 255];
  if (/\b(black)\b/.test(v)) return [0, 0, 0];
  return null;
}

/** Map an rgb triple to an existing section style (styles/styles.css), or null for white. */
function classifyRgb([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (min >= 0xf9) return null; // white / near-white: default section
  const saturated = max - min > 60;
  if (saturated && g === max && g > r + 40 && g >= b && lum > 0.25) return 'green';
  if (lum >= 0.6) return 'grey';
  if (max <= 0x22) return 'black'; // #222, #101010
  if (lum < 0.4) return 'dark'; // #313e48, #2c2a29, #0b4c45
  return saturated && g === max ? 'green' : 'grey';
}

const CLASS_STYLES = [
  [/(^|-)(grey|gray|light)$/, 'grey'],
  [/(^|-)(dark|slate|charcoal)$/, 'dark'],
  [/(^|-)black$/, 'black'],
  [/(^|-)(green|bg-theme)$/, 'green'],
];

/** Returns { style } when el declares a background (style may be null = white), else null. */
function backgroundOf(el) {
  const inline = el.getAttribute('style') || '';
  const m = inline.match(/background(?:-color)?\s*:\s*([^;]+)/i);
  if (m) {
    const rgb = parseColor(m[1]);
    if (rgb) return { style: classifyRgb(rgb) };
  }
  const classes = [...el.classList].filter((c) => /^(module|content-banner)--/.test(c));
  // explicit modifiers first; content-banner--bg-theme only means "themed" and is refined by --dark etc.
  for (let i = 0; i < CLASS_STYLES.length; i += 1) {
    const [re, style] = CLASS_STYLES[i];
    if (style === 'green') continue;
    if (classes.some((c) => re.test(c))) return { style };
  }
  if (classes.some((c) => CLASS_STYLES[3][0].test(c))) return { style: 'green' };
  if (classes.some((c) => /--white$/.test(c))) return { style: null };
  return null;
}

function normText(el) {
  return (el.textContent || '').replace(/[\s ]+/g, '').length;
}

/** Background style of a component: its outermost .module/.content-banner that covers it. */
function componentColor(component) {
  const total = normText(component);
  const candidates = [component, ...safeQueryAll(component, '.module, .content-banner, [style*="background"]')];
  for (let i = 0; i < candidates.length; i += 1) {
    const el = candidates[i];
    const bg = backgroundOf(el);
    if (bg && normText(el) >= total * 0.9) return bg.style;
  }
  return null;
}

/** Name of the block at element (pageBlocks from the import script, else null). */
function blockNameOf(el, pageBlocks) {
  const hit = (pageBlocks || []).find((b) => b.element === el);
  return hit ? hit.name : null;
}

function bandStyleOf(component, pageBlocks) {
  // never split inside a block
  const outerBlock = component.parentElement && component.parentElement.closest('[data-excat-block]');
  if (outerBlock) return null;
  if (component.querySelector('ol.legal-accordion')) return 'legal';
  const style = componentColor(component);
  if (!style) return null;
  const blocks = [component, ...safeQueryAll(component, '[data-excat-block]')]
    .filter((el) => el.hasAttribute('data-excat-block'));
  const names = blocks.map((el) => blockNameOf(el, pageBlocks)).filter(Boolean);
  if (names.some((n) => SELF_FILLED_BLOCKS.includes(n))) return null;
  // columns-media turns a dark panel into its own boxed fill
  if (style !== 'grey' && names.includes('columns-media')) return null;
  // no import-script context: a content banner is always a hero-banner block
  if (component.matches('.banner') || component.querySelector(':scope > .content-banner')) return null;
  return style;
}

function legalStartNumbers(root) {
  safeQueryAll(root, 'ol.legal-accordion').forEach((ol) => {
    const cls = [...ol.classList].find((c) => /^start-\d+$/.test(c));
    if (cls && !ol.hasAttribute('start')) ol.setAttribute('start', cls.slice(6));
  });
}

function insertBands(root, document, pageBlocks) {
  legalStartNumbers(root);
  const components = safeQueryAll(root, '#main > div > div');
  const styles = components.map((c) => bandStyleOf(c, pageBlocks));
  const runs = [];
  components.forEach((c, i) => {
    const style = styles[i];
    if (!style) return;
    const last = runs[runs.length - 1];
    if (last && last.style === style && last.end.nextElementSibling === c) last.end = c;
    else runs.push({ style, start: c, end: c });
  });
  const runStarts = new Set(runs.map((r) => r.start));
  runs.forEach(({ style, start, end }) => {
    const hr = document.createElement('hr');
    hr.setAttribute(BAND_ATTR, style);
    start.before(hr);
    if (!runStarts.has(end.nextElementSibling)) {
      const close = document.createElement('hr');
      close.setAttribute(BAND_END_ATTR, 'true');
      end.after(close);
    }
  });

  // news article lead paragraph -> own `lead` section
  safeQueryAll(root, '.news-article__leading').forEach((lead) => {
    if (!normText(lead) || lead.closest('[data-excat-block]')) return;
    if (components.some((c, i) => styles[i] && c.contains(lead))) return;
    const hr = document.createElement('hr');
    hr.setAttribute(BAND_ATTR, 'lead');
    lead.before(hr);
    const close = document.createElement('hr');
    close.setAttribute(BAND_END_ATTR, 'true');
    lead.after(close);
  });
}

function addBandMetadata(root, document) {
  safeQueryAll(root, `hr[${BAND_ATTR}]`).forEach((hr) => {
    const style = hr.getAttribute(BAND_ATTR);
    hr.removeAttribute(BAND_ATTR);
    if (!style || !hr.parentNode) return;
    hr.after(WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: { style },
    }));
  });
  safeQueryAll(root, `hr[${BAND_END_ATTR}]`).forEach((hr) => hr.removeAttribute(BAND_END_ATTR));
}

/* ---------- empty section collapse ---------- */

const MEDIA_TAGS = ['IMG', 'PICTURE', 'IFRAME', 'VIDEO', 'AUDIO', 'SVG', 'OBJECT', 'EMBED', 'INPUT', 'SELECT', 'TEXTAREA', 'CANVAS'];

function isSectionMetadata(el) {
  if (el.tagName !== 'TABLE') return false;
  const cell = el.querySelector('th, td');
  return Boolean(cell) && /^section[\s-]*metadata$/i.test(cell.textContent.trim());
}

/** Segments of root split at <hr>: [{ open: hr|null, close: hr|null, metas: [], content: bool }] */
function segments(root, document) {
  const segs = [{ open: null, close: null, metas: [], content: false }];
  const walker = document.createTreeWalker(root, 5 /* SHOW_ELEMENT | SHOW_TEXT */);
  let skip = null;
  let node = walker.nextNode();
  while (node) {
    if (skip && skip.contains(node)) {
      node = walker.nextNode();
      continue;
    }
    skip = null;
    const seg = segs[segs.length - 1];
    if (node.nodeType === 3) {
      if (node.textContent.trim()) seg.content = true;
    } else if (node.tagName === 'HR') {
      seg.close = node;
      segs.push({ open: node, close: null, metas: [], content: false });
    } else if (isSectionMetadata(node)) {
      seg.metas.push(node);
      skip = node;
    } else if (MEDIA_TAGS.includes(node.tagName.toUpperCase())) {
      seg.content = true;
      skip = node;
    }
    node = walker.nextNode();
  }
  return segs;
}

function collapseEmptySections(root, document) {
  for (let guard = 0; guard < 200; guard += 1) {
    const segs = segments(root, document);
    if (segs.length < 2) return;
    const empty = segs.find((s) => !s.content && (s.open || s.close));
    if (!empty) return;
    empty.metas.forEach((t) => t.remove());
    (empty.open || empty.close).remove();
  }
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = (template && Array.isArray(template.sections)) ? template.sections : [];
  const useTemplateSections = sections.length >= 2 || sections.some(hasStyle);

  const document = (payload && payload.document) || element.ownerDocument;

  if (hookName === 'beforeTransform') {
    if (useTemplateSections) {
      const elements = resolveSectionElements(element, sections);
      const firstFound = elements.findIndex(Boolean);
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = elements[i];
        if (el && el.parentNode) {
          const isFirst = i === firstFound;
          if (!isFirst || hasStyle(section)) {
            const hr = document.createElement('hr');
            if (hasStyle(section)) hr.setAttribute(MARKER_ATTR, section.id || `section-${i}`);
            if (isFirst) hr.setAttribute('data-excat-first-section', 'true');
            el.parentNode.insertBefore(hr, el);
          }
        }
      }
    }
    insertBands(element, document, payload && payload.pageBlocks);
  }

  if (hookName === 'afterTransform') {
    if (useTemplateSections) {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (hasStyle(section)) {
          const id = section.id || `section-${i}`;
          const marker = element.querySelector(`hr[${MARKER_ATTR}="${id}"]`);
          let anchor = marker;
          if (!anchor) {
            const selectors = toSelectorList(section.selector);
            for (let s = 0; s < selectors.length && !anchor; s += 1) {
              anchor = safeQuery(element, selectors[s]);
            }
          }
          if (anchor && anchor.parentNode) {
            const metadata = WebImporter.Blocks.createBlock(document, {
              name: 'Section Metadata',
              cells: { style: styleValue(section) },
            });
            anchor.after(metadata);
          }
        }
      }
      element.querySelectorAll(`hr[${MARKER_ATTR}]`).forEach((hr) => hr.removeAttribute(MARKER_ATTR));
      // the first section's temporary <hr> would open an empty section
      element.querySelectorAll('hr[data-excat-first-section]').forEach((hr) => hr.remove());
    }
    addBandMetadata(element, document);
    collapseEmptySections(element, document);
  }
}
