/* eslint-disable */
/* global WebImporter */

// Import script for template "content-page".
// Sample URL: https://www.transurban.com/investor-centre/share-price

import heroBannerParser from './parsers/hero-banner.js';
import accordionParser from './parsers/accordion.js';
import embedVideoParser from './parsers/embed-video.js';
import cardsVideoParser from './parsers/cards-video.js';
import cardsOverlayParser from './parsers/cards-overlay.js';
import cardsIconParser from './parsers/cards-icon.js';
import releasesFilterParser from './parsers/releases-filter.js';
import tableDataParser from './parsers/table-data.js';
import tabsPanelsParser from './parsers/tabs-panels.js';
import sharePriceChartParser from './parsers/share-price-chart.js';
import sharePriceQuoteParser from './parsers/share-price-quote.js';
import formParser from './parsers/form.js';
import articleShareTagsParser from './parsers/article-share-tags.js';
import transurbanCleanupTransformer from './transformers/transurban-cleanup.js';
import transurbanSectionsTransformer from './transformers/transurban-sections.js';

const PAGE_TEMPLATE = {
  "name": "content-page",
  "urls": [
    "https://www.transurban.com/about-us/board-of-directors",
    "https://www.transurban.com/about-us/board-of-directors/craig-drummond",
    "https://www.transurban.com/about-us/board-of-directors/jane-wilson",
    "https://www.transurban.com/about-us/board-of-directors/marina-go",
    "https://www.transurban.com/about-us/board-of-directors/mark-birrell",
    "https://www.transurban.com/about-us/board-of-directors/michael-wright",
    "https://www.transurban.com/about-us/board-of-directors/patricia-cross",
    "https://www.transurban.com/about-us/board-of-directors/robert-whitfield",
    "https://www.transurban.com/about-us/board-of-directors/sarah-ryan",
    "https://www.transurban.com/about-us/board-of-directors/tim-reed",
    "https://www.transurban.com/about-us/executive-committee",
    "https://www.transurban.com/about-us/executive-committee/sarah-hack",
    "https://www.transurban.com/about-us/reporting",
    "https://www.transurban.com/about-us/reporting/non-financial-reports-archive",
    "https://www.transurban.com/archive/sustainability-old/community-grants/grant-program-recipients",
    "https://www.transurban.com/campaigns/1h18-achievements",
    "https://www.transurban.com/campaigns/fy18-achievements",
    "https://www.transurban.com/campaigns/lep-one-year-on",
    "https://www.transurban.com/communities/partnerships-and-grants/driver-training-programs",
    "https://www.transurban.com/corporate-governance/whistleblower-service",
    "https://www.transurban.com/investor-centre",
    "https://www.transurban.com/investor-centre/asx-releases",
    "https://www.transurban.com/investor-centre/debt-investors-navigation",
    "https://www.transurban.com/investor-centre/distributions-tax-navigation",
    "https://www.transurban.com/investor-centre/investor-calendar",
    "https://www.transurban.com/investor-centre/investor-day-2021",
    "https://www.transurban.com/investor-centre/investor-day-2021/northconnex",
    "https://www.transurban.com/investor-centre/investor-day-2022",
    "https://www.transurban.com/investor-centre/reporting-suite",
    "https://www.transurban.com/investor-centre/share-price",
    "https://www.transurban.com/news/linktgo-gps-technology",
    "https://www.transurban.com/newsroom",
    "https://www.transurban.com/partners",
    "https://www.transurban.com/roads-and-projects/brisbane/qld-maintenance-projects",
    "https://www.transurban.com/roads-and-projects/cavs/smartroads",
    "https://www.transurban.com/suppliers",
    "https://www.transurban.com/suppliers/access-faq",
    "https://www.transurban.com/suppliers/permitted-registration",
    "https://www.transurban.com/suppliers/permitted-registration/add-new-company-site-agreement",
    "https://www.transurban.com/suppliers/permitted-registration/extend-company-expiry-date",
    "https://www.transurban.com/suppliers/permitted-registration/link-company-site-agreement"
  ],
  "description": "Breadcrumb and page-title content page with body copy, profile or card grids and media columns",
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "#main > div > div.banner",
        "#main > div > div.richContentContainer:has(.featuredCTA .feature-tile--v-align-center):not(:has(.feature-tile--with-image))",
        ".content-header .contentContainer:has(.content-banner)"
      ],
      "pageInstances": {
        "https://www.transurban.com/archive/sustainability-old/community-grants/grant-program-recipients": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/1h18-achievements": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div > div.contentContainer.aem-GridColumn.aem-GridColumn--default--12",
          "#main > div > div:nth-child(8)",
          "#main > div > div:nth-child(13)"
        ],
        "https://www.transurban.com/campaigns/fy18-achievements": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div > div.contentContainer.aem-GridColumn.aem-GridColumn--default--12",
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/investor-centre": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/investor-centre/investor-day-2021": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/investor-centre/investor-day-2022": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/roads-and-projects/cavs/smartroads": [
          "#main > div > div:nth-child(1)"
        ]
      }
    },
    {
      "name": "accordion",
      "instances": [
        "#main > div > div.richContentContainer:has(.cmp-accordion)",
        ".contentaccordion.accordion.panelcontainer",
        ".module--ec-calendar.cmp-accordion > div > div > ul.ec-calendar__list"
      ],
      "pageInstances": {
        "https://www.transurban.com/about-us/reporting": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/about-us/reporting/non-financial-reports-archive": [
          "#contentaccordion-40a4cbd849 > div > div > ul"
        ],
        "https://www.transurban.com/suppliers": [
          "#main > div > div:nth-child(7) > div > div > div > div > div.contentaccordion.accordion.panelcontainer.section",
          "#main > div > div:nth-child(8) > div > div > div > div > div.contentaccordion.accordion.panelcontainer.section",
          "#main > div > div:nth-child(9) > div > div > div > div > div.contentaccordion.accordion.panelcontainer.section",
          "#main > div > div:nth-child(10) > div > div > div > div > div.contentaccordion.accordion.panelcontainer.section",
          "#main > div > div:nth-child(11) > div > div > div > div > div.contentaccordion.accordion.panelcontainer.section"
        ],
        "https://www.transurban.com/suppliers/access-faq": [
          "#main > div > div:nth-child(2)"
        ]
      }
    },
    {
      "name": "embed-video",
      "instances": [
        "#main > div > div.video.embed",
        "#main > div > div.richContentContainer:has(.module--video-embed):not(:has(.video-richtext))",
        ".module--video-embed .video-embed-container > div.video"
      ],
      "pageInstances": {
        "https://www.transurban.com/campaigns/1h18-achievements": [
          "#main > div > div.video.embed.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/fy18-achievements": [
          "#main > div > div.video.embed.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/lep-one-year-on": [
          "#main > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div",
          "#main > div > div:nth-child(3) > div > div > div > div > div > div > div > div > div > div > div",
          "#main > div > div:nth-child(4) > div > div > div > div > div > div > div > div > div > div > div",
          "#main > div > div:nth-child(5) > div > div > div > div > div > div > div > div > div > div > div"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/driver-training-programs": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/investor-centre/investor-day-2021/northconnex": [
          "#main > div > div:nth-child(2)"
        ]
      }
    },
    {
      "name": "cards-video",
      "instances": [
        "#main > div > div.richContentContainer:has(.video-richtext)"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/investor-day-2022": [
          "#main > div > div:nth-child(5)",
          "#main > div > div:nth-child(6)",
          "#main > div > div:nth-child(7)"
        ]
      }
    },
    {
      "name": "cards-overlay",
      "instances": [
        "#main > div > div.contentContainer:has(.featuredCTA .feature-tile--with-image)",
        "#main > div > div.richContentContainer:has(.featuredCTA .feature-tile--with-image)"
      ],
      "pageInstances": {
        "https://www.transurban.com/campaigns/1h18-achievements": [
          "#main > div > div:nth-child(3)",
          "#main > div > div:nth-child(5)",
          "#main > div > div:nth-child(7)",
          "#main > div > div:nth-child(10)",
          "#main > div > div:nth-child(12)"
        ],
        "https://www.transurban.com/campaigns/fy18-achievements": [
          "#main > div > div:nth-child(2)",
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/driver-training-programs": [
          "#main > div > div:nth-child(5)"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "#main > div > div.richContentContainer:has(.featuredImageCTA):not(:has(.feature-tile--board))"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre": [
          "#main > div > div:nth-child(4)",
          "#main > div > div:nth-child(6)"
        ],
        "https://www.transurban.com/investor-centre/debt-investors-navigation": [
          "#main > div > div:nth-child(2)",
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/investor-centre/distributions-tax-navigation": [
          "#main > div > div:nth-child(2)",
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/investor-centre/investor-calendar": [
          "#main > div > div:nth-child(2)",
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/suppliers": [
          "#main > div > div:nth-child(6)"
        ]
      }
    },
    {
      "name": "releases-filter",
      "instances": [
        ".module--asx-releases .results-filter"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/asx-releases": [
          "#main > div > div.asxreleases.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.results-filter"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "#main > div > div.richContentContainer:has(.scrolltable)",
        ".rich-text .scrolltable"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/investor-day-2021": [
          "#main > div > div:nth-child(5)"
        ],
        "https://www.transurban.com/suppliers": [
          "#main > div > div:nth-child(5) > div > div > div > div > div > div > div > div > div > div > h3",
          "#main > div > div:nth-child(12) > div > div > div > div > div > div > div > div > div > div > div"
        ]
      }
    },
    {
      "name": "tabs-panels",
      "instances": [
        "#main > div > div.tabsContainer"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/reporting-suite": [
          "#main > div > div.tabsContainer.tabs.panelcontainer.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "share-price-chart",
      "instances": [
        ".share-price-chart__chart-controls--range",
        ".share-price-chart__chart-controls--type",
        ".yourir-chart-panel-plots"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/share-price": [
          "#chart > div > div.yourir-chart-panels > div > div.yourir-chart-panel-plots",
          "#main > div > div.sharepricegraph.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.share-price-chart__chart-controls.share-price-chart__chart-controls--range",
          "#main > div > div.sharepricegraph.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.share-price-chart__chart-controls.share-price-chart__chart-controls--type"
        ]
      }
    },
    {
      "name": "share-price-quote",
      "instances": [
        "#main > div > div.richContentContainer:has(.featuredshareprice)"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/share-price": [
          "#main > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "form",
      "instances": [
        "#main > div > div.sharePriceCalculator"
      ],
      "pageInstances": {
        "https://www.transurban.com/investor-centre/share-price": [
          "#main > div > div.sharePriceCalculator.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "article-share-tags",
      "instances": [
        ".module--article-filter .article-filter__filters-container"
      ],
      "pageInstances": {
        "https://www.transurban.com/news/linktgo-gps-technology": [
          "#main > div > div.filtercontent.aem-GridColumn.aem-GridColumn--default--12 > div > div > div.article-filter.fn_article-filter > div.article-filter__filters-container"
        ],
        "https://www.transurban.com/newsroom": [
          "#main > div > div.filtercontent.aem-GridColumn.aem-GridColumn--default--12 > div > div > div.article-filter.fn_article-filter > div.article-filter__filters-container"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "page-header",
      "name": "page-header",
      "selector": [
        ".content-header-wrapper"
      ],
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": [
        ".content-header h1",
        ".content-header .module--content-header"
      ]
    },
    {
      "id": "main-content",
      "name": "main-content",
      "selector": [
        "#inner-wrap > div.root.responsivegrid",
        "#main"
      ],
      "style": null,
      "blocks": [
        "hero-banner",
        "accordion",
        "embed-video",
        "cards-video",
        "cards-overlay",
        "cards-icon",
        "releases-filter",
        "table-data",
        "tabs-panels",
        "share-price-chart",
        "share-price-quote",
        "form",
        "article-share-tags"
      ],
      "defaultContent": [
        "#main > div > div.richContentContainer",
        "#main .rich-text",
        "#main h2",
        "#main h3",
        "#main p"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.transurban.com/about-us/board-of-directors": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/craig-drummond": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/jane-wilson": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/marina-go": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/mark-birrell": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/michael-wright": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/patricia-cross": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/robert-whitfield": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/sarah-ryan": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/board-of-directors/tim-reed": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/executive-committee": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/executive-committee/sarah-hack": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/reporting": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/reporting/non-financial-reports-archive": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/archive/sustainability-old/community-grants/grant-program-recipients": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/1h18-achievements": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/fy18-achievements": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/lep-one-year-on": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/partnerships-and-grants/driver-training-programs": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/corporate-governance/whistleblower-service": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre": [
      "#yourir--anonComponent5",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/asx-releases": [
      "#yourir--anonComponent4",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/debt-investors-navigation": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/distributions-tax-navigation": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/investor-calendar": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/investor-day-2021": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/investor-day-2021/northconnex": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/investor-day-2022": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/reporting-suite": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/share-price": [
      "#yourir--anonComponent4",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/linktgo-gps-technology": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/newsroom": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/partners": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/brisbane/qld-maintenance-projects": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/cavs/smartroads": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/suppliers": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/suppliers/access-faq": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/suppliers/permitted-registration": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/suppliers/permitted-registration/add-new-company-site-agreement": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/suppliers/permitted-registration/extend-company-expiry-date": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/suppliers/permitted-registration/link-company-site-agreement": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ]
  }
};

const parsers = {
  'hero-banner': heroBannerParser,
  'accordion': accordionParser,
  'embed-video': embedVideoParser,
  'cards-video': cardsVideoParser,
  'cards-overlay': cardsOverlayParser,
  'cards-icon': cardsIconParser,
  'releases-filter': releasesFilterParser,
  'table-data': tableDataParser,
  'tabs-panels': tabsPanelsParser,
  'share-price-chart': sharePriceChartParser,
  'share-price-quote': sharePriceQuoteParser,
  'form': formParser,
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
