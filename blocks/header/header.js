// desktop layout (horizontal bar + hover dropdowns) starts at 1200px
const isDesktop = window.matchMedia('(width >= 1200px)');

const SECTION_NAMES = ['utility', 'brand', 'sections', 'tools'];

/**
 * Fetches the nav fragment from the site root. Only a page served under /content
 * (the local migration preview) looks for it under /content first.
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchNav() {
  let resp = null;
  if (window.location.pathname.startsWith('/content/')) resp = await fetch('/content/nav.plain.html');
  if (!resp || !resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: resp.url };
}

/**
 * Builds a DOM tree from the nav fragment and resolves relative media paths
 * against the fragment URL.
 * @param {string} html fragment markup
 * @param {string} base fragment URL
 * @returns {HTMLElement}
 */
function parseFragment(html, base) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  tmp.querySelectorAll('img[src], source[srcset]').forEach((el) => {
    const attr = el.hasAttribute('src') ? 'src' : 'srcset';
    const value = el.getAttribute(attr);
    if (value && !/^(https?:|data:|\/)/.test(value)) {
      el.setAttribute(attr, new URL(value, base).href);
    }
  });
  return tmp;
}

function createIcon(name) {
  const span = document.createElement('span');
  span.className = `nav-icon nav-icon-${name}`;
  span.setAttribute('aria-hidden', 'true');
  return span;
}

/* ---------- desktop dropdowns + mobile slide-in panels ---------- */

function closeAllDrops(nav, except) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    if (drop !== except) drop.setAttribute('aria-expanded', 'false');
  });
}

function closeSubpanels(nav) {
  nav.querySelectorAll('.nav-drop.is-panel-open').forEach((drop) => {
    drop.classList.remove('is-panel-open');
    const trigger = drop.querySelector(':scope > a');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Decorates every top-level list item that owns a nested list as a dropdown.
 * Desktop: hover/focus opens the panel, the label link navigates.
 * Mobile: tapping the label slides in a sub-panel with a back row and the
 * section landing link (cloned from the label).
 * @param {HTMLElement} nav
 * @param {HTMLElement} sections
 */
function decorateSections(nav, sections) {
  const list = sections.querySelector('ul');
  if (!list) return;
  list.classList.add('nav-list');
  [...list.children].forEach((item) => {
    item.classList.add('nav-item');
    const trigger = item.querySelector(':scope > a');
    const sub = item.querySelector(':scope > ul');
    if (!trigger || !sub) return;

    item.classList.add('nav-drop');
    item.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const panel = document.createElement('div');
    panel.className = 'nav-panel';
    sub.classList.add('nav-panel-list');

    // mobile-only panel chrome: back row + section title (re-uses the label link)
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'nav-back';
    back.append(createIcon('chevron-left'), document.createTextNode('Back'));
    const title = document.createElement('a');
    title.className = 'nav-panel-title';
    title.href = trigger.href;
    title.textContent = trigger.textContent;
    title.setAttribute('aria-hidden', 'true');
    title.tabIndex = -1;
    const content = document.createElement('div');
    content.className = 'nav-panel-content';
    content.append(sub);
    panel.append(back, title, content);
    item.append(panel);

    // desktop hover
    item.addEventListener('mouseenter', () => {
      if (!isDesktop.matches) return;
      closeAllDrops(nav, item);
      item.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', () => {
      if (!isDesktop.matches) return;
      item.setAttribute('aria-expanded', 'false');
    });
    item.addEventListener('focusin', () => {
      if (!isDesktop.matches) return;
      closeAllDrops(nav, item);
      item.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('focusout', (e) => {
      if (!isDesktop.matches || item.contains(e.relatedTarget)) return;
      item.setAttribute('aria-expanded', 'false');
    });

    // mobile: label opens the slide-in panel instead of navigating
    trigger.addEventListener('click', (e) => {
      if (isDesktop.matches) return;
      e.preventDefault();
      item.classList.add('is-panel-open');
      trigger.setAttribute('aria-expanded', 'true');
      title.removeAttribute('aria-hidden');
      title.tabIndex = 0;
      back.focus();
    });
    back.addEventListener('click', () => {
      item.classList.remove('is-panel-open');
      trigger.setAttribute('aria-expanded', 'false');
      title.setAttribute('aria-hidden', 'true');
      title.tabIndex = -1;
      trigger.focus();
    });
  });
}

/* ---------- search ---------- */

function toggleSearch(nav, force) {
  const button = nav.querySelector('.nav-search-toggle');
  const panel = nav.querySelector('.nav-search-panel');
  if (!button || !panel) return;
  const open = force !== undefined ? force : button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-label', open ? 'Hide search' : 'Show search');
  panel.hidden = !open;
  if (open) panel.querySelector('input').focus();
}

/**
 * Turns the tools section (search link + placeholder paragraph) into a search
 * toggle and a drop-down search form.
 * @param {HTMLElement} nav
 * @param {HTMLElement} tools
 */
function decorateTools(nav, tools) {
  const link = tools.querySelector('a');
  if (!link) return;
  const paragraphs = [...tools.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
  const placeholder = paragraphs.length ? paragraphs[0].textContent.trim() : '';
  const label = link.textContent.trim();

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nav-search-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'nav-search');
  button.setAttribute('aria-label', 'Show search');
  button.append(createIcon('search'), createIcon('close'));

  const panel = document.createElement('div');
  panel.className = 'nav-search-panel';
  panel.id = 'nav-search';
  panel.hidden = true;
  const form = document.createElement('form');
  form.action = link.href;
  form.method = 'get';
  form.setAttribute('role', 'search');
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'q';
  input.id = 'nav-search-input';
  input.placeholder = placeholder;
  input.autocomplete = 'off';
  const inputLabel = document.createElement('label');
  inputLabel.htmlFor = input.id;
  inputLabel.className = 'nav-visually-hidden';
  inputLabel.textContent = placeholder || label;
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'nav-search-submit';
  submit.textContent = label;
  form.append(inputLabel, input, submit);
  panel.append(form);

  tools.textContent = '';
  tools.append(button);
  nav.append(panel);
  button.addEventListener('click', () => toggleSearch(nav));
}

/* ---------- mobile drawer ---------- */

function toggleMenu(nav, force) {
  const open = force !== undefined ? force : nav.getAttribute('aria-expanded') !== 'true';
  const button = nav.querySelector('.nav-hamburger button');
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (button) button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('nav-open', open && !isDesktop.matches);
  if (!open) closeSubpanels(nav);
}

function onKeydown(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  if (!nav) return;
  toggleSearch(nav, false);
  if (isDesktop.matches) closeAllDrops(nav);
  else if (nav.getAttribute('aria-expanded') === 'true') {
    toggleMenu(nav, false);
    nav.querySelector('.nav-hamburger button').focus();
  }
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const data = await fetchNav();
  if (!data) return;
  const fragment = parseFragment(data.html, data.base);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  const parts = {};
  [...fragment.children].forEach((section, i) => {
    const name = SECTION_NAMES[i] || `extra-${i}`;
    section.className = `nav-${name}`;
    parts[name] = section;
  });

  // brand: unwrap the logo link from its paragraph
  if (parts.brand) {
    const brandLink = parts.brand.querySelector('a');
    if (brandLink) {
      brandLink.setAttribute('aria-label', brandLink.querySelector('img')?.alt || 'Home');
      parts.brand.replaceChildren(brandLink);
    }
  }
  if (parts.utility) {
    const list = parts.utility.querySelector('ul');
    if (list) list.classList.add('nav-utility-list');
  }
  if (parts.sections) decorateSections(nav, parts.sections);
  if (parts.tools) decorateTools(nav, parts.tools);

  // hamburger (mobile only)
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  const hamburgerButton = document.createElement('button');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'nav-drawer');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.append(createIcon('hamburger'));
  hamburger.append(hamburgerButton);
  hamburgerButton.addEventListener('click', () => toggleMenu(nav));

  // drawer: holds sections + utility links (mobile off-canvas; display: contents on desktop)
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.id = 'nav-drawer';
  if (parts.sections) drawer.append(parts.sections);
  if (parts.utility) drawer.append(parts.utility);

  const shade = document.createElement('div');
  shade.className = 'nav-shade';
  shade.addEventListener('click', () => toggleMenu(nav, false));

  const searchPanel = nav.querySelector('.nav-search-panel');
  nav.prepend(hamburger);
  if (parts.brand) nav.append(parts.brand);
  nav.append(drawer);
  if (parts.tools) nav.append(parts.tools);
  if (searchPanel) nav.append(searchPanel);
  nav.append(shade);
  nav.setAttribute('aria-expanded', 'false');

  // close everything when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, false);
    closeAllDrops(nav);
    closeSubpanels(nav);
    toggleSearch(nav, false);
  });
  window.addEventListener('keydown', onKeydown);
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) toggleSearch(nav, false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
