/* eslint-disable */
/* global WebImporter */

// Import script for template "content-page".
// Sample URL: https://www.transurban.com/investor-centre/share-price

import tableDataParser from './parsers/table-data.js';
import transurbanCleanupTransformer from './transformers/transurban-cleanup.js';
import transurbanSectionsTransformer from './transformers/transurban-sections.js';

const PAGE_TEMPLATE = {
  "name": "text-page",
  "urls": [
    "https://www.transurban.com/campaigns/m2-m7-survey",
    "https://www.transurban.com/campaigns/sydney-marathon/sydney-marathon-competition-2025/2025-sydney-marathon-competition---thank-you",
    "https://www.transurban.com/campaigns/sydney-marathon/sydney-marathon-competition-2025/sydney-marathon-competition-2025-tcs",
    "https://www.transurban.com/corporate-governance",
    "https://www.transurban.com/customers/toll-road-ready/fuel-smart-egift-card-terms",
    "https://www.transurban.com/customers/toll-road-ready/prezzee-fuel-smart-e-gift-cards-monthly-giveaway-tcs",
    "https://www.transurban.com/privacy",
    "https://www.transurban.com/terms-of-use",
    "https://www.transurban.com/transurban-credit-reporting-policy"
  ],
  "description": "Text-only page of headings and paragraphs, used for legal, terms and policy content",
  "blocks": [
    {
      "name": "table-data",
      "instances": [
        ".rich-text .scrolltable"
      ],
      "pageInstances": {
        "https://www.transurban.com/customers/toll-road-ready/prezzee-fuel-smart-e-gift-cards-monthly-giveaway-tcs": [
          "#main > div > div > div > div > div > div:nth-child(67)",
          "#main > div > div > div > div > div > div:nth-child(81)"
        ],
        "https://www.transurban.com/privacy": [
          "#main > div > div:nth-child(1) > div > div > div > ol.legal-accordion.start-17 .scrolltable"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "main-content",
      "name": "main-content",
      "selector": [
        "#inner-wrap > div.root.responsivegrid",
        "#main"
      ],
      "style": null,
      "blocks": [
        "table-data"
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
    "https://www.transurban.com/campaigns/m2-m7-survey": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/sydney-marathon/sydney-marathon-competition-2025/2025-sydney-marathon-competition---thank-you": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/sydney-marathon/sydney-marathon-competition-2025/sydney-marathon-competition-2025-tcs": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/corporate-governance": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/customers/toll-road-ready/fuel-smart-egift-card-terms": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/customers/toll-road-ready/prezzee-fuel-smart-e-gift-cards-monthly-giveaway-tcs": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/privacy": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/terms-of-use": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/transurban-credit-reporting-policy": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ]
  }
};

const parsers = {
  'table-data': tableDataParser,
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
