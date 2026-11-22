/* eslint-disable */
/* global WebImporter */

// Import script for template "content-page".
// Sample URL: https://www.transurban.com/investor-centre/share-price

import tableDataParser from './parsers/table-data.js';
import articleShareTagsParser from './parsers/article-share-tags.js';
import transurbanCleanupTransformer from './transformers/transurban-cleanup.js';
import transurbanSectionsTransformer from './transformers/transurban-sections.js';

const PAGE_TEMPLATE = {
  "name": "sidebar-content-page",
  "urls": [
    "https://www.transurban.com/investor-centre/distributions-and-tax/amit-faq",
    "https://www.transurban.com/investor-centre/distributions-and-tax/distribution-components",
    "https://www.transurban.com/investor-centre/distributions-and-tax/distribution-reinvestment-plan",
    "https://www.transurban.com/investor-centre/distributions-and-tax/tax-guides",
    "https://www.transurban.com/investor-centre/distributions-and-tax/trust-distributions"
  ],
  "description": "Content page with a left-hand section navigation sidebar beside headings, body copy and FAQ-style text",
  "blocks": [
    {
      "name": "table-data",
      "instances": [
        ".rich-text .scrolltable"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/distributions-and-tax/distribution-components": [
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(4)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(7)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(16)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(19)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(29)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(32)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(42)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(45)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(55)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(58)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(69)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(72)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(82)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(85)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(93)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(98)",
          "#main > div > div:nth-child(1) > div > div > div > div:nth-child(101)",
          "#main > div > div:nth-child(2) > div > div > div > div:nth-child(4)",
          "#main > div > div:nth-child(2) > div > div > div > div:nth-child(7)",
          "#main > div > div:nth-child(2) > div > div > div > div:nth-child(15)",
          "#main > div > div:nth-child(3) > div > div > div > div:nth-child(3)",
          "#main > div > div:nth-child(3) > div > div > div > div:nth-child(6)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(4)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(7)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(15)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(20)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(23)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(34)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(37)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(47)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(50)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(57)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(63)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(66)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(73)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(78)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(81)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(88)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(94)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(97)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(104)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(108)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(111)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(118)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(124)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(127)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(131)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(136)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(139)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(143)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(148)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(151)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(155)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(158)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(160)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(164)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(168)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(170)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(174)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(177)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(179)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(183)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(187)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(189)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(193)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(196)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(198)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(202)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(206)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(208)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(212)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(215)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(217)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(221)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(225)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(227)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(231)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(234)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(236)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(240)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(244)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(247)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(251)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(254)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(259)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(262)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(266)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(269)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(274)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(277)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(280)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(283)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(288)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(291)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(294)",
          "#main > div > div:nth-child(4) > div > div > div > div:nth-child(297)"
        ],
        "https://www.transurban.com/investor-centre/distributions-and-tax/distribution-reinvestment-plan": [
          "#main > div > div > div > div > div > div"
        ],
        "https://www.transurban.com/investor-centre/distributions-and-tax/trust-distributions": [
          "#main > div > div.richtext.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div"
        ]
      }
    },
    {
      "name": "article-share-tags",
      "instances": [
        ".news-article__actions-container"
      ],
      "pageInstances": {}
    }
  ],
  "sections": [
    {
      "id": "section-nav",
      "name": "section-nav",
      "selector": [
        "div.content-container.cf > div.aside"
      ],
      "style": "section-nav",
      "blocks": [],
      "defaultContent": [
        "div.aside a",
        "div.aside li"
      ]
    },
    {
      "id": "main-content",
      "name": "main-content",
      "selector": [
        "div.content-container.cf > div.content-column",
        "#main"
      ],
      "style": null,
      "blocks": [
        "table-data",
        "article-share-tags"
      ],
      "defaultContent": [
        "#main .rich-text",
        "#main h1",
        "#main h2",
        "#main h3",
        "#main p",
        "#main ol",
        "#main ul"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.transurban.com/investor-centre/distributions-and-tax/amit-faq": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/distributions-and-tax/distribution-components": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/distributions-and-tax/distribution-reinvestment-plan": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/distributions-and-tax/tax-guides": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/distributions-and-tax/trust-distributions": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ]
  }
};

const parsers = {
  'table-data': tableDataParser,
  'article-share-tags': articleShareTagsParser,
};

// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [transurbanSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
// Page corrections (transurban-page-corrections.js, when it exists) run last.
const correctionTransformers = [];
const transformers = [transurbanCleanupTransformer, ...lateTransformers, ...correctionTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

// SVG images: the importer's default convertIcons rule replaces every <img> whose src ends in .svg
// with an ":icon-name:" code, which would lose the cards-icon icons (there is no matching /icons
// file). That rule only runs inside the importer's default transformDOM; this script implements
// transform() and deliberately never calls WebImporter.rules.convertIcons, so .svg images stay
// normal <img> elements whose source URLs are made absolute by adjustImageUrls like any other image.

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    // No WebImporter.rules.convertIcons here: .svg images stay <img> (see the SVG note above).

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
