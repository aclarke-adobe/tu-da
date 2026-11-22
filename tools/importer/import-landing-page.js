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
import tableDataParser from './parsers/table-data.js';
import tabsPanelsParser from './parsers/tabs-panels.js';
import formParser from './parsers/form.js';
import articleShareTagsParser from './parsers/article-share-tags.js';
import testimonialParser from './parsers/testimonial.js';
import columnsMediaParser from './parsers/columns-media.js';
import columnsParser from './parsers/columns.js';
import socialShareParser from './parsers/social-share.js';
import cardsParser from './parsers/cards.js';
import cardsNewsParser from './parsers/cards-news.js';
import transurbanCleanupTransformer from './transformers/transurban-cleanup.js';
import transurbanSectionsTransformer from './transformers/transurban-sections.js';

const PAGE_TEMPLATE = {
  "name": "landing-page",
  "urls": [
    "https://www.transurban.com/about-us",
    "https://www.transurban.com/about-us/innovation",
    "https://www.transurban.com/about-us/insights",
    "https://www.transurban.com/campaigns/behindthescenes",
    "https://www.transurban.com/campaigns/blindspots",
    "https://www.transurban.com/campaigns/burnleytunnelproject",
    "https://www.transurban.com/campaigns/choiceisyoursqld",
    "https://www.transurban.com/campaigns/choiceisyourssyd",
    "https://www.transurban.com/campaigns/choiceisyoursvic",
    "https://www.transurban.com/campaigns/cyclepark",
    "https://www.transurban.com/campaigns/driving-qld",
    "https://www.transurban.com/campaigns/ecodriving",
    "https://www.transurban.com/campaigns/ev-experience",
    "https://www.transurban.com/campaigns/ignite",
    "https://www.transurban.com/campaigns/namethetunnels",
    "https://www.transurban.com/campaigns/nsw-toll-reform",
    "https://www.transurban.com/campaigns/road-user-charging",
    "https://www.transurban.com/campaigns/roadsafety",
    "https://www.transurban.com/campaigns/roadtrip",
    "https://www.transurban.com/campaigns/roadtriptips",
    "https://www.transurban.com/campaigns/seatmesafely",
    "https://www.transurban.com/campaigns/sydney-marathon/sydney-marathon-competition-2025",
    "https://www.transurban.com/campaigns/west-gate-tunnel-tolls",
    "https://www.transurban.com/communities",
    "https://www.transurban.com/communities/community-grants/peoples-choice-award",
    "https://www.transurban.com/communities/life-around-our-roads",
    "https://www.transurban.com/communities/life-around-our-roads/watson-st-open-space",
    "https://www.transurban.com/communities/partnerships-and-grants",
    "https://www.transurban.com/communities/partnerships-and-grants/community-grants",
    "https://www.transurban.com/communities/partnerships-and-grants/kidsafe",
    "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafensw",
    "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafeqld",
    "https://www.transurban.com/communities/partnerships-and-grants/neura",
    "https://www.transurban.com/communities/reconciliation",
    "https://www.transurban.com/contact-us",
    "https://www.transurban.com/contact-us/media-enquiries",
    "https://www.transurban.com/customers",
    "https://www.transurban.com/customers/toll-road-ready",
    "https://www.transurban.com/customers/using-our-toll-roads",
    "https://www.transurban.com/investor-centre/annual-general-meetings",
    "https://www.transurban.com/investor-centre/environmental-social-governance",
    "https://www.transurban.com/investor-centre/investor-day-2023",
    "https://www.transurban.com/investor-centre/investor-toolkit",
    "https://www.transurban.com/news/addressing-the-gender-pay-gap",
    "https://www.transurban.com/news/gender-pay-gap-performance",
    "https://www.transurban.com/roads-and-projects",
    "https://www.transurban.com/roads-and-projects/brisbane",
    "https://www.transurban.com/roads-and-projects/brisbane/logan-west-upgrade",
    "https://www.transurban.com/roads-and-projects/cavs",
    "https://www.transurban.com/roads-and-projects/melbourne",
    "https://www.transurban.com/roads-and-projects/north-america",
    "https://www.transurban.com/roads-and-projects/sydney",
    "https://www.transurban.com/sustainability",
    "https://www.transurban.com/sustainability/air-quality",
    "https://www.transurban.com/sustainability/sustainable-driving",
    "https://www.transurban.com/sustainability/sustainable-driving/evs-for-everyone"
  ],
  "description": "Section landing page opening with a hero banner, followed by stacked columns, card grids and call-to-action bands",
  "blocks": [
    {
      "name": "cards",
      "instances": [
        "#main > div > div.richContentContainer:has(.feature-tile--board)"
      ]
    },
    {
      "name": "hero-banner",
      "instances": [
        "#main > div > div.banner",
        "#main > div > div.richContentContainer:has(.featuredCTA .feature-tile--v-align-center):not(:has(.feature-tile--with-image))",
        ".content-header .contentContainer:has(.content-banner)",
        ".content-header-wrapper div.banner"
      ],
      "pageInstances": {
        "https://www.transurban.com/about-us": [
          "#main > div > div:nth-child(1)",
          "#main > div > div:nth-child(13)"
        ],
        "https://www.transurban.com/about-us/innovation": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12",
          "#main > div > div:nth-child(5)",
          "#main > div > div:nth-child(19)"
        ],
        "https://www.transurban.com/about-us/insights": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/behindthescenes": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/blindspots": [
          "#main > div > div:nth-child(1)",
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/burnleytunnelproject": [
          "#main > div > div:nth-child(1)",
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/choiceisyoursqld": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/choiceisyourssyd": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/choiceisyoursvic": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/cyclepark": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/driving-qld": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/ecodriving": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/ev-experience": [
          "#main > div > div:nth-child(1)",
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/ignite": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/namethetunnels": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/nsw-toll-reform": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/road-user-charging": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/roadsafety": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/roadtrip": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/roadtriptips": [
          "#main > div > div:nth-child(1)",
          "#main > div > div:nth-child(7)",
          "#main > div > div:nth-child(9)"
        ],
        "https://www.transurban.com/campaigns/seatmesafely": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/campaigns/sydney-marathon/sydney-marathon-competition-2025": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/campaigns/west-gate-tunnel-tolls": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/community-grants/peoples-choice-award": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/life-around-our-roads": [
          "#main > div > div:nth-child(1)",
          "#main > div > div:nth-child(5)",
          "#main > div > div:nth-child(9)",
          "#main > div > div:nth-child(12)",
          "#main > div > div:nth-child(17)"
        ],
        "https://www.transurban.com/communities/life-around-our-roads/watson-st-open-space": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/community-grants": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe": [
          "#main > div > div:nth-child(1)",
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafensw": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafeqld": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/neura": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/communities/reconciliation": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/contact-us": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/contact-us/media-enquiries": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.aem-Grid.aem-Grid--12.aem-Grid--default--12"
        ],
        "https://www.transurban.com/customers": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/customers/toll-road-ready": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/customers/using-our-toll-roads": [
          "#main > div > div:nth-child(1)",
          "#main > div > div:nth-child(7)",
          "#main > div > div:nth-child(12)"
        ],
        "https://www.transurban.com/investor-centre/annual-general-meetings": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/investor-centre/environmental-social-governance": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/investor-centre/investor-day-2023": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/investor-centre/investor-toolkit": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.aem-Grid.aem-Grid--12.aem-Grid--default--12"
        ],
        "https://www.transurban.com/news/addressing-the-gender-pay-gap": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/gender-pay-gap-performance": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/roads-and-projects": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12",
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/roads-and-projects/brisbane": [
          "#main > div > div:nth-child(1)",
          "#main > div > div:nth-child(10)",
          "#main > div > div:nth-child(13)"
        ],
        "https://www.transurban.com/roads-and-projects/brisbane/logan-west-upgrade": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/roads-and-projects/cavs": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/roads-and-projects/melbourne": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/roads-and-projects/north-america": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/roads-and-projects/sydney": [
          "#main > div > div.banner.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/sustainability": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-header-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/sustainability/air-quality": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/sustainability/sustainable-driving": [
          "#main > div > div:nth-child(1)",
          "#main > div > div:nth-child(4)",
          "#main > div > div:nth-child(6)"
        ],
        "https://www.transurban.com/sustainability/sustainable-driving/evs-for-everyone": [
          "#main > div > div:nth-child(1)",
          "#main > div > div:nth-child(5)",
          "#main > div > div:nth-child(9)",
          "#main > div > div:nth-child(12)"
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
        "https://www.transurban.com/about-us/innovation": [
          "#main > div > div:nth-child(8)"
        ],
        "https://www.transurban.com/campaigns/ignite": [
          "#main > div > div:nth-child(4)"
        ],
        "https://www.transurban.com/campaigns/nsw-toll-reform": [
          "#contentaccordion-c8f99c05ac > div > div > ul"
        ],
        "https://www.transurban.com/communities/community-grants/peoples-choice-award": [
          "#recipients-all > div > div > ul"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/community-grants": [
          "#recipients > div > div > ul"
        ],
        "https://www.transurban.com/communities/reconciliation": [
          "#contentaccordion-9131c20e5a > div > div > ul",
          "#contentaccordion-08a60d286b > div > div > ul"
        ],
        "https://www.transurban.com/customers/toll-road-ready": [
          "#main > div > div:nth-child(7)"
        ],
        "https://www.transurban.com/sustainability/sustainable-driving/evs-for-everyone": [
          "#main > div > div.contentaccordion.accordion.panelcontainer.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "embed-video",
      "instances": [
        "#main > div > div.video.embed",
        "#main > div > div.richContentContainer:has(.module--video-embed):not(:has(.richtext)):not(:has(.video-richtext))",
        ".grid__column .module--video-embed"
      ],
      "pageInstances": {
        "https://www.transurban.com/about-us": [
          "#main > div > div:nth-child(11)"
        ],
        "https://www.transurban.com/campaigns/behindthescenes": [
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/campaigns/choiceisyourssyd": [
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/campaigns/choiceisyoursvic": [
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/campaigns/ev-experience": [
          "#main > div > div:nth-child(4)",
          "#main > div > div:nth-child(5)"
        ],
        "https://www.transurban.com/campaigns/roadsafety": [
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/campaigns/roadtriptips": [
          "#main > div > div:nth-child(11)"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe": [
          "#main > div > div:nth-child(8) > div > div > div > div > div > div > div > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/sustainability/air-quality": [
          "#main > div > div:nth-child(4) > div > div > div > div > div > div > div > div > div > div > div > p:nth-child(1)"
        ]
      }
    },
    {
      "name": "cards-video",
      "instances": [
        "#main > div > div.richContentContainer:has(.video-richtext)"
      ],
      "pageInstances": {
        "https://www.transurban.com/campaigns/ecodriving": [
          "#main > div > div:nth-child(5)"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafensw": [
          "#main > div > div:nth-child(6)"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafeqld": [
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
        "https://www.transurban.com/communities/life-around-our-roads": [
          "#main > div > div:nth-child(14)"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "#main > div > div.richContentContainer:has(.featuredImageCTA):not(:has(.feature-tile--board)):not(:has(.richtext))"
      ],
      "pageInstances": {
        "https://www.transurban.com/about-us": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/communities": [
          "#inner-wrap > div.root.responsivegrid > div > div > div > div.content-container-wrapper.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/communities/life-around-our-roads": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/communities/life-around-our-roads/watson-st-open-space": [
          "#main > div > div:nth-child(7)"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants": [
          "#main > div > div:nth-child(1)"
        ],
        "https://www.transurban.com/customers": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/customers/using-our-toll-roads": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/investor-centre/environmental-social-governance": [
          "#main > div > div:nth-child(4)",
          "#main > div > div:nth-child(6)",
          "#main > div > div:nth-child(10)"
        ],
        "https://www.transurban.com/news/addressing-the-gender-pay-gap": [
          "#main > div > div:nth-child(4)",
          "#main > div > div:nth-child(6)",
          "#main > div > div:nth-child(10)"
        ],
        "https://www.transurban.com/news/gender-pay-gap-performance": [
          "#main > div > div:nth-child(4)",
          "#main > div > div:nth-child(6)"
        ],
        "https://www.transurban.com/roads-and-projects/cavs": [
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/sustainability": [
          "#main > div > div:nth-child(1)"
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
        "https://www.transurban.com/campaigns/nsw-toll-reform": [
          "#main > div > div:nth-child(3)"
        ],
        "https://www.transurban.com/customers/using-our-toll-roads": [
          "#main > div > div:nth-child(14)"
        ],
        "https://www.transurban.com/investor-centre/investor-toolkit": [
          "#main > div > div.richtext.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div > div"
        ]
      }
    },
    {
      "name": "tabs-panels",
      "instances": [
        "#main > div > div.tabsContainer",
        ".tabsContainer.tabs.panelcontainer"
      ],
      "pageInstances": {
        "https://www.transurban.com/about-us/innovation": [
          "#main > div > div:nth-child(14) > div > div > div > div > div.tabsContainer.tabs.panelcontainer.section"
        ],
        "https://www.transurban.com/about-us/insights": [
          "#main > div > div:nth-child(5)",
          "#main > div > div:nth-child(20) > div > div > div > div > div.tabsContainer.tabs.panelcontainer.section"
        ],
        "https://www.transurban.com/campaigns/nsw-toll-reform": [
          "#main > div > div:nth-child(9) > div > div > div > div > div.tabsContainer.tabs.panelcontainer.section"
        ],
        "https://www.transurban.com/sustainability/air-quality": [
          "#main > div > div.tabsContainer.tabs.panelcontainer.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "form",
      "instances": [
        "#main > div > div.sharePriceCalculator",
        "#main > div > div.richContentContainer:has(.aemformcontainer)"
      ],
      "pageInstances": {
        "https://www.transurban.com/communities/community-grants/peoples-choice-award": [
          "#main > div > div:nth-child(2)"
        ],
        "https://www.transurban.com/customers/toll-road-ready": [
          "#main > div > div:nth-child(4)"
        ]
      }
    },
    {
      "name": "article-share-tags",
      "instances": [
        ".module--article-filter .article-filter__filters-container"
      ],
      "pageInstances": {}
    },
    {
      "name": "testimonial",
      "instances": [],
      "pageInstances": {
        "https://www.transurban.com/campaigns/ignite": [
          "#main > div > div:nth-child(7) > div > div > div > div > div > div > div > div > div > div > div > div > div.feature-tile__image-container"
        ]
      }
    },
    {
      "name": "columns-media",
      "instances": [],
      "pageInstances": {
        "https://www.transurban.com/communities/partnerships-and-grants": [
          "#main > div > div:nth-child(3)",
          "#main > div > div:nth-child(7)"
        ],
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe": [
          "#main > div > div:nth-child(7)"
        ],
        "https://www.transurban.com/communities/reconciliation": [
          "#main > div > div:nth-child(13)"
        ]
      }
    },
    {
      "name": "columns",
      "instances": [],
      "pageInstances": {
        "https://www.transurban.com/communities/partnerships-and-grants/community-grants": [
          "#main > div > div:nth-child(7)"
        ]
      }
    },
    {
      "name": "social-share",
      "instances": [
        ".a2a_kit"
      ],
      "pageInstances": {
        "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafeqld": [
          "#main > div > div:nth-child(9) > div > div > div > div > div > div > div > div > div > div > div > div"
        ]
      }
    },
    {
      "name": "cards-news",
      "instances": [
        "#main > div > div.richContentContainer:has(.feature-tile--news)",
        ".filtercontent"
      ]
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
        "table-data",
        "tabs-panels",
        "form",
        "article-share-tags",
        "testimonial",
        "columns-media",
        "columns",
        "social-share",
        "cards",
        "cards-news"
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
    "https://www.transurban.com/about-us": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/innovation": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/about-us/insights": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/behindthescenes": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/blindspots": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/burnleytunnelproject": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/choiceisyoursqld": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/choiceisyourssyd": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/choiceisyoursvic": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/cyclepark": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/driving-qld": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/ecodriving": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/ev-experience": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/ignite": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/namethetunnels": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/nsw-toll-reform": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/road-user-charging": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/roadsafety": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/roadtrip": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/roadtriptips": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/seatmesafely": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/sydney-marathon/sydney-marathon-competition-2025": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/campaigns/west-gate-tunnel-tolls": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/community-grants/peoples-choice-award": [
      "body.base.page > div:nth-child(40)",
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/life-around-our-roads": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/life-around-our-roads/watson-st-open-space": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/partnerships-and-grants": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/partnerships-and-grants/community-grants": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/partnerships-and-grants/kidsafe": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafensw": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/partnerships-and-grants/kidsafe/kidsafeqld": [
      "#yourir--anonComponent3",
      "div.modal-bg",
      "#a2a_modal",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/communities/partnerships-and-grants/neura": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/communities/reconciliation": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/contact-us": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/contact-us/media-enquiries": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/customers": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/customers/toll-road-ready": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/customers/using-our-toll-roads": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/annual-general-meetings": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/environmental-social-governance": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/investor-day-2023": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/investor-centre/investor-toolkit": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/addressing-the-gender-pay-gap": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/gender-pay-gap-performance": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/brisbane": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/brisbane/logan-west-upgrade": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/cavs": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/melbourne": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/north-america": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/roads-and-projects/sydney": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/sustainability": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/sustainability/air-quality": [
      "div.gm-style > div:nth-child(3)",
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/sustainability/sustainable-driving": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/sustainability/sustainable-driving/evs-for-everyone": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ]
  }
};

const parsers = {
  'cards-news': cardsNewsParser,
  'cards': cardsParser,
  'hero-banner': heroBannerParser,
  'accordion': accordionParser,
  'embed-video': embedVideoParser,
  'cards-video': cardsVideoParser,
  'cards-overlay': cardsOverlayParser,
  'cards-icon': cardsIconParser,
  'table-data': tableDataParser,
  'tabs-panels': tabsPanelsParser,
  'form': formParser,
  'article-share-tags': articleShareTagsParser,
  'testimonial': testimonialParser,
  'columns-media': columnsMediaParser,
  'columns': columnsParser,
  'social-share': socialShareParser,
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
    // Page metadata: the importer defaults (title, description, image) plus the source
    // breadcrumb trail the cleanup transformer kept in params.breadcrumbs.
    const meta = WebImporter.Blocks.getMetadata(document);
    if (params.breadcrumbs) meta.Breadcrumbs = params.breadcrumbs;
    if (Object.keys(meta).length) main.append(WebImporter.Blocks.getMetadataBlock(document, meta));
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
