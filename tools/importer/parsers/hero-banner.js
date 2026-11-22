/* eslint-disable */
/* global WebImporter */

/**
 * hero-banner parser.
 * Sources (catalog instances):
 *   - div.banner > .content-banner (image via __image-container background,
 *     __title heading, __subtitle text, __cta link)
 *   - div.contentContainer > ... > .banner.section > .content-banner
 *   - div.richContentContainer > .module[style=background-image] with a
 *     .featuredCTA .feature-tile (title/text/cta) or a .rich-text column
 *   - option share-price-panel: a .featuredshareprice .investor-tile column
 *   - option featured: source .content-banner--featured (tall hero). The block
 *     README documents one option at a time and the featured / share-price-panel
 *     styles conflict, so share-price-panel wins when both apply.
 *   - option callout: photo-background .richContentContainer rich-text module
 *     (no .banner/.content-banner/.feature-tile) holding only an h2 and CTA
 *     link(s), no foreground image (e.g. "Discover more about Transurban")
 * Block table (blocks/hero-banner/hero-banner.js):
 *   row: background image (optional) | row: content | row: share price panel
 */

function bgUrl(el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const m = style.match(/background-image\s*:\s*url\(\s*(?:&quot;|["'])?([^"')]+?)(?:&quot;|["'])?\s*\)/i);
  return m ? m[1].trim() : null;
}

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  return img;
}

function cleanLink(document, a) {
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = a.textContent.replace(/\s+/g, ' ').trim();
  return link;
}

function ctaParagraph(document, links) {
  const valid = links.filter((a) => a.getAttribute('href') && a.textContent.trim());
  if (!valid.length) return null;
  const p = document.createElement('p');
  valid.forEach((a, i) => {
    if (i) p.append(' ');
    p.append(cleanLink(document, a));
  });
  return p;
}

function hasText(el) {
  return el.textContent.replace(/ /g, ' ').trim().length > 0;
}

function collectContent(document, root) {
  const out = [];
  const pushHeading = (wrap) => {
    const h = wrap.querySelector('h1, h2, h3, h4, h5, h6');
    if (h && hasText(h)) {
      const nh = document.createElement(h.tagName.toLowerCase());
      nh.textContent = h.textContent.replace(/\s+/g, ' ').trim();
      out.push(nh);
    }
  };
  [...root.children].forEach((child) => {
    const cls = child.classList;
    if (cls.contains('content-banner__title') || cls.contains('feature-tile__title')) {
      pushHeading(child);
    } else if (cls.contains('content-banner__subtitle')) {
      if (hasText(child)) {
        const p = document.createElement('p');
        p.textContent = child.textContent.replace(/\s+/g, ' ').trim();
        out.push(p);
      }
    } else if (cls.contains('feature-tile__text')) {
      [...child.children].forEach((c) => {
        if (hasText(c)) out.push(c);
      });
      if (!child.children.length && hasText(child)) {
        const p = document.createElement('p');
        p.textContent = child.textContent.trim();
        out.push(p);
      }
    } else if (cls.contains('feature-tile__cta-container') || child.matches('a.btn')) {
      const links = child.matches('a') ? [child] : [...child.querySelectorAll('a')];
      const p = ctaParagraph(document, links);
      if (p) out.push(p);
    } else if (/^H[1-6]$/.test(child.tagName)) {
      if (hasText(child)) {
        const nh = document.createElement(child.tagName.toLowerCase());
        nh.textContent = child.textContent.replace(/\s+/g, ' ').trim();
        out.push(nh);
      }
    } else if (child.matches('p, ul, ol')) {
      if (hasText(child)) out.push(child);
    }
  });
  // trailing CTAs that sit outside the content wrapper children
  return out;
}

function buildPanel(document, tile) {
  const out = [];
  const label = tile.querySelector('.investor-tile__share-label');
  if (label && hasText(label)) {
    const h = document.createElement('h2');
    h.textContent = label.textContent.replace(/\s+/g, ' ').trim();
    out.push(h);
  }
  const price = tile.querySelector('.investor-tile__share-price .price');
  if (price && hasText(price)) {
    const p = document.createElement('p');
    p.textContent = price.textContent.replace(/\s+/g, '').trim();
    out.push(p);
  }
  const asAt = tile.querySelector('.investor-tile__share-price-update-time');
  if (asAt && hasText(asAt)) {
    const p = document.createElement('p');
    p.textContent = asAt.textContent.replace(/\s+/g, ' ').trim();
    out.push(p);
  }
  const items = [...tile.querySelectorAll('.investor-tile__share-info .share-info-item')];
  if (items.length) {
    const ul = document.createElement('ul');
    items.forEach((item) => {
      const l = item.querySelector('.label');
      const v = item.querySelector('.value');
      const li = document.createElement('li');
      li.textContent = `${l ? l.textContent.trim() : ''}: ${v ? v.textContent.replace(/\s+/g, '').trim() : ''}`;
      ul.append(li);
    });
    out.push(ul);
  }
  const href = tile.matches('a[href]') ? tile.getAttribute('href') : null;
  if (href) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = 'View share price';
    p.append(a);
    out.push(p);
  }
  return out;
}

/**
 * Photo-background rich-text module (not a .banner/.content-banner/feature tile)
 * whose content is just an h2 plus link-only CTA paragraph(s), no foreground image.
 */
function isCallout(element, root, imgSrc, content, fgImgs) {
  if (!element.matches('.richContentContainer')) return false;
  if (element.querySelector('.banner, .content-banner, .feature-tile, .investor-tile')) return false;
  if (!root.classList.contains('rich-text') || !imgSrc || fgImgs.length) return false;
  const headings = content.filter((c) => /^H[1-6]$/.test(c.tagName));
  if (headings.length !== 1 || headings[0].tagName !== 'H2') return false;
  const rest = content.filter((c) => c !== headings[0]);
  if (!rest.length) return false;
  return rest.every((c) => {
    const links = [...c.querySelectorAll('a[href]')];
    const linkText = links.map((a) => a.textContent).join('').replace(/\s/g, '');
    return c.tagName === 'P' && links.length > 0 && !c.querySelector('img')
      && c.textContent.replace(/\s/g, '') === linkText;
  });
}

export default function parse(element, { document }) {
  const cells = [];

  const panelSource = element.querySelector('.featuredshareprice .investor-tile, .investor-tile');

  // background image
  let imgSrc = bgUrl(element.querySelector('.content-banner__image-container'));
  if (!imgSrc) {
    const styled = [element, ...element.querySelectorAll('[style*="background-image"]')]
      .find((el) => !el.closest('.investor-tile') && bgUrl(el));
    imgSrc = bgUrl(styled);
  }
  if (!imgSrc) {
    const img = element.querySelector('.content-banner img, .feature-tile__image img');
    if (img) imgSrc = img.getAttribute('src');
  }

  // content
  const root = element.querySelector('.content-banner__content-wrapper')
    || element.querySelector('.feature-tile__content')
    || element.querySelector('.rich-text')
    || element;
  let content = collectContent(document, root);
  // content-banner CTA links may sit directly in the wrapper (handled) or deeper
  if (root.classList.contains('rich-text') || root === element) {
    // rich-text CTA containers are nested in a div; collectContent handles direct ones
    const nestedCtas = [...root.querySelectorAll('.feature-tile__cta-container')]
      .filter((c) => c.parentElement !== root);
    nestedCtas.forEach((c) => {
      const p = ctaParagraph(document, [...c.querySelectorAll('a')]);
      if (p) content.push(p);
    });
  }
  if (!content.length) {
    const h = element.querySelector('h1, h2, h3');
    if (h) content = [h];
  }

  // foreground images (e.g. a logo/title image in the rich text) lead the content cell;
  // the background image (CSS or image container) stays in the image row
  const fgImgs = [...root.querySelectorAll('img')].filter((img) => {
    const src = img.getAttribute('src');
    return src && src !== imgSrc
      && !img.closest('.content-banner__image-container, .feature-tile__image, .investor-tile')
      && !content.some((c) => c.contains(img));
  });
  if (fgImgs.length) {
    content = [...fgImgs.map((img) => {
      const p = document.createElement('p');
      p.append(makeImg(document, img.getAttribute('src'), img.getAttribute('alt')));
      return p;
    }), ...content];
  }

  content.forEach((c) => {
    [c, ...c.querySelectorAll('[style], [class]')].forEach((n) => {
      n.removeAttribute('style');
      n.removeAttribute('class');
    });
  });

  const heading = content.find((c) => /^H[1-6]$/.test(c.tagName));
  if (imgSrc) {
    cells.push([makeImg(document, imgSrc, heading ? heading.textContent.trim() : '')]);
  }
  cells.push([content]);

  let name = 'hero-banner';
  let withPanel = false;
  if (panelSource) {
    const panel = buildPanel(document, panelSource);
    if (panel.length) {
      cells.push([panel]);
      name = 'hero-banner (share-price-panel)';
      withPanel = true;
    }
  }
  if (!withPanel) {
    if (element.matches('.content-banner--featured') || element.querySelector('.content-banner--featured')) {
      name = 'hero-banner (featured)';
    } else if (isCallout(element, root, imgSrc, content, fgImgs)) {
      name = 'hero-banner (callout)';
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
