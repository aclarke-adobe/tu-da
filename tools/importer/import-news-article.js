/* eslint-disable */
/* global WebImporter */

// Import script for template "content-page".
// Sample URL: https://www.transurban.com/investor-centre/share-price

import articleShareTagsParser from './parsers/article-share-tags.js';
import embedVideoParser from './parsers/embed-video.js';
import accordionParser from './parsers/accordion.js';
import authorBioParser from './parsers/author-bio.js';
import cardsNewsParser from './parsers/cards-news.js';
import columnsMediaParser from './parsers/columns-media.js';
import tableDataParser from './parsers/table-data.js';
import transurbanCleanupTransformer from './transformers/transurban-cleanup.js';
import transurbanSectionsTransformer from './transformers/transurban-sections.js';

const PAGE_TEMPLATE = {
  "name": "news-article",
  "urls": [
    "https://www.transurban.com/archive/qrsw",
    "https://www.transurban.com/news/2025-community-grant-recipients-peoples-choice-award",
    "https://www.transurban.com/news/2025-peoples-choice-award-winners",
    "https://www.transurban.com/news/2026-community-grant-recipients-peoples-choice-award",
    "https://www.transurban.com/news/2026-transurban-community-grants-now-open",
    "https://www.transurban.com/news/395-express-lanes-continues-annual-transit-investments",
    "https://www.transurban.com/news/395-express-lanes-one-year",
    "https://www.transurban.com/news/395-express-lanes-opens",
    "https://www.transurban.com/news/495-express-lanes-northern-extension-now-open",
    "https://www.transurban.com/news/495-next-project-advances",
    "https://www.transurban.com/news/495-next-project-early-works",
    "https://www.transurban.com/news/495-northern-extension-project",
    "https://www.transurban.com/news/495-northern-extension-reaches-next-milestone",
    "https://www.transurban.com/news/95-express-lanes-fredericksburg-extension-opens",
    "https://www.transurban.com/news/a-breath-of-fresh-air-thanks-to-northconnex",
    "https://www.transurban.com/news/a-rewarding-partnership",
    "https://www.transurban.com/news/a-step-up-for-stem",
    "https://www.transurban.com/news/a25",
    "https://www.transurban.com/news/a25-acquisition-canada",
    "https://www.transurban.com/news/a25-tolling-resumes-with-customer-support",
    "https://www.transurban.com/news/additional-interests-in-westlinkm7-northconnex-westconnex",
    "https://www.transurban.com/news/announcing-our-2026-transurban-community-grants-recipients",
    "https://www.transurban.com/news/another-layer-of-protection-against-sms-scams",
    "https://www.transurban.com/news/asset-recycling-getting-beyond-the-name",
    "https://www.transurban.com/news/asx--release-nsw-toll-notice-digitisation-and-enforcement",
    "https://www.transurban.com/news/attitudes-towards-road-user-charging-reform",
    "https://www.transurban.com/news/automated-truck-trial",
    "https://www.transurban.com/news/automated-truck-trial-findings",
    "https://www.transurban.com/news/avoid-scams-and-stay-safe-online",
    "https://www.transurban.com/news/b2b-back-to-the-gateway",
    "https://www.transurban.com/news/behind-the-scenes-at-our-freeway-control-centre",
    "https://www.transurban.com/news/better-journeys-along-the-95",
    "https://www.transurban.com/news/bonus-fuel-savings-up-for-grabs",
    "https://www.transurban.com/news/boost-your-shot-to-win",
    "https://www.transurban.com/news/bridge-fun-run-raises-over-one-million",
    "https://www.transurban.com/news/bridge-to-brisbane-2024-wrap-up",
    "https://www.transurban.com/news/bridge-to-brisbane-2025",
    "https://www.transurban.com/news/bridge-to-brisbane-2026",
    "https://www.transurban.com/news/bringing-back-the-26cpl-fuel-discount-with-linkt",
    "https://www.transurban.com/news/brisbane-convoy-for-kids",
    "https://www.transurban.com/news/car-seat-blitz-reveals-common-mistakes",
    "https://www.transurban.com/news/car-seat-fittings-for-customers",
    "https://www.transurban.com/news/car-seat-installation",
    "https://www.transurban.com/news/car-seat-installation-errors",
    "https://www.transurban.com/news/car-seat-safety-blitz",
    "https://www.transurban.com/news/carpool-challenge-finalists",
    "https://www.transurban.com/news/carpool-challenge-winner",
    "https://www.transurban.com/news/carpool-on-our-roads",
    "https://www.transurban.com/news/cav-trials-brisbane",
    "https://www.transurban.com/news/cavs-and-managed-roadways",
    "https://www.transurban.com/news/cavs-demonstrations",
    "https://www.transurban.com/news/cavs-i95-express-lanes",
    "https://www.transurban.com/news/challenging-drivers-to-rethink-road-safety",
    "https://www.transurban.com/news/charge-your-ev-on-us-with-our-new-linkt-competition",
    "https://www.transurban.com/news/charity-day-2018",
    "https://www.transurban.com/news/charity-day-2019",
    "https://www.transurban.com/news/checking-in-on-mobility-trends",
    "https://www.transurban.com/news/child-passenger-safety-awareness",
    "https://www.transurban.com/news/child-restraint-chest-clip",
    "https://www.transurban.com/news/child-seat-safety-webinar",
    "https://www.transurban.com/news/children-sitting-in-front-seat-at-high-risk-of-injury",
    "https://www.transurban.com/news/citylink-is-not-a-place-for-cyclists",
    "https://www.transurban.com/news/citylink-mapping-innovation",
    "https://www.transurban.com/news/citylink-to-be-wind-powered",
    "https://www.transurban.com/news/citylink-travel-time-signs",
    "https://www.transurban.com/news/cleaner-greener-roads-and-tunnels",
    "https://www.transurban.com/news/cleveland-street-off-ramp",
    "https://www.transurban.com/news/common-car-seat-mistakes",
    "https://www.transurban.com/news/community-grant-funding-tripled",
    "https://www.transurban.com/news/community-grant-gives-back-in-virginia",
    "https://www.transurban.com/news/community-grants-2023",
    "https://www.transurban.com/news/community-grants-2023-vote",
    "https://www.transurban.com/news/community_grant_recipients_2022",
    "https://www.transurban.com/news/connecting-customers-to-support-networks",
    "https://www.transurban.com/news/connecting-melbourne-for-25-years",
    "https://www.transurban.com/news/connecting-military-veterans-with-new-career-opportunities",
    "https://www.transurban.com/news/connecting-people-with-meaningful-work",
    "https://www.transurban.com/news/connecting-sydneysiders-with-affordable-ev-options",
    "https://www.transurban.com/news/coronavirus-supporting-customers-employees",
    "https://www.transurban.com/news/covid-response-expanded-va",
    "https://www.transurban.com/news/cycle-parks-project",
    "https://www.transurban.com/news/cyclists-urged-to-stay-out-of-tunnels",
    "https://www.transurban.com/news/dangerous-goods-in-tunnels",
    "https://www.transurban.com/news/darkness-to-daylight-challenge",
    "https://www.transurban.com/news/dc-bike-ride",
    "https://www.transurban.com/news/debris-on-motorways",
    "https://www.transurban.com/news/decade-of-creating-job-opportunities",
    "https://www.transurban.com/news/design-and-construction-contractor-maryland",
    "https://www.transurban.com/news/downer-awarded-contract-for-northconnex-hills-m2-lane-cove-tunnel",
    "https://www.transurban.com/news/drive-to-donate-395-anniversary",
    "https://www.transurban.com/news/driver-training-program-the-key-to-independence",
    "https://www.transurban.com/news/driving-a-more-diverse-future-in-stem",
    "https://www.transurban.com/news/driving-choice-for-communities-and-our-customers",
    "https://www.transurban.com/news/driving-infrastructure-modernization",
    "https://www.transurban.com/news/eco-driving-trial-findings",
    "https://www.transurban.com/news/ed-emergency-exercise",
    "https://www.transurban.com/news/education-the-key-to-truck-safety",
    "https://www.transurban.com/news/egis-awarded-irm-contract-for-wcx-eastern-distributor-cross-city-tunnel",
    "https://www.transurban.com/news/electric-incident-response-vehicle",
    "https://www.transurban.com/news/electric-vehicles-powered-by-parliament",
    "https://www.transurban.com/news/energy-breakthrough",
    "https://www.transurban.com/news/energy-breakthrough-kicksoff",
    "https://www.transurban.com/news/engagement-survey-2023",
    "https://www.transurban.com/news/enhancing-native-bushland",
    "https://www.transurban.com/news/entering-new-markets-in-the-us",
    "https://www.transurban.com/news/ev-experience-register-nsw",
    "https://www.transurban.com/news/express-lanes-are-driving-sustainability",
    "https://www.transurban.com/news/express-lanes-expansion-into-maryland",
    "https://www.transurban.com/news/express-lanes-how-we-promote-multimodal-choices",
    "https://www.transurban.com/news/express-lanes-invest-in-regional-travel-options",
    "https://www.transurban.com/news/extension-of-melbourne-incident-response",
    "https://www.transurban.com/news/eyes-on-signs-of-modern-slavery",
    "https://www.transurban.com/news/fiap-achievements",
    "https://www.transurban.com/news/fighting-back-against-scams",
    "https://www.transurban.com/news/fighting-fatigue-with-zombies-self-care",
    "https://www.transurban.com/news/flattening-the-congestion-curve",
    "https://www.transurban.com/news/fleet-managers-in-the-ev-drivers-seat",
    "https://www.transurban.com/news/fredericksburg-extension-project-approved",
    "https://www.transurban.com/news/fredex-project-construction",
    "https://www.transurban.com/news/free-kidsafe-child-car-seat-checks-picked-up-common-mistakes",
    "https://www.transurban.com/news/fun-run-wrap-up",
    "https://www.transurban.com/news/future-of-freight",
    "https://www.transurban.com/news/gaps-in-driver-awareness",
    "https://www.transurban.com/news/get-your-shot-to-win",
    "https://www.transurban.com/news/getting-ready-for-an-ev-future",
    "https://www.transurban.com/news/ghg-reduction-targets-validated",
    "https://www.transurban.com/news/global-leader-in-sustainability",
    "https://www.transurban.com/news/gotoll-app",
    "https://www.transurban.com/news/gotoll-app-expands-service",
    "https://www.transurban.com/news/gotoll-expands-to-west-coast",
    "https://www.transurban.com/news/gps-data-reveals-northconnex-impact",
    "https://www.transurban.com/news/grant-to-support-us-veterans",
    "https://www.transurban.com/news/great-brisbane-bikeride-18",
    "https://www.transurban.com/news/help-name-the-west-gate-tunnels",
    "https://www.transurban.com/news/helping-families-in-need",
    "https://www.transurban.com/news/helping-people-impacted-by-covid",
    "https://www.transurban.com/news/helping-students-achieve-financial-independence",
    "https://www.transurban.com/news/helping-students-dream-big",
    "https://www.transurban.com/news/heroism-on-the-395-express-lanes",
    "https://www.transurban.com/news/how-to-build-for-tomorrow",
    "https://www.transurban.com/news/how-we-are-measuring-up-on-sustainability",
    "https://www.transurban.com/news/how-we-are-working-and-travelling",
    "https://www.transurban.com/news/how-were-moving-mobility-trends",
    "https://www.transurban.com/news/how-were-travelling-in-2024",
    "https://www.transurban.com/news/i-24-southeast-choice-lanes-commercial-close",
    "https://www.transurban.com/news/i95-road-user-charging-trials",
    "https://www.transurban.com/news/improving-access-to-hardship-support",
    "https://www.transurban.com/news/improving-gender-balance-within-infrastructure",
    "https://www.transurban.com/news/improving-neighbourly-relations",
    "https://www.transurban.com/news/incident-response-queensland",
    "https://www.transurban.com/news/increase-in-speeding-and-risky-driving",
    "https://www.transurban.com/news/indigenous-driving-school",
    "https://www.transurban.com/news/industry-road-safety-roundtable",
    "https://www.transurban.com/news/infrastructure-public-private-partnerships",
    "https://www.transurban.com/news/infrastructure-sector-boosted-by-historic-investment",
    "https://www.transurban.com/news/inspiring-the-next-gen-women",
    "https://www.transurban.com/news/inspiring-the-next-generation",
    "https://www.transurban.com/news/investigation-into-tullamarine-freeway-signage",
    "https://www.transurban.com/news/investing-in-the-future-of-us-infrastructure",
    "https://www.transurban.com/news/ipa-partnerships-conference-2026",
    "https://www.transurban.com/news/join-our-road-safety-heroes",
    "https://www.transurban.com/news/keeping-an-eye-out-for-others-on-the-road",
    "https://www.transurban.com/news/keeping-kids-safe-on-the-roads",
    "https://www.transurban.com/news/keeping-the-littlest-of-passengers-safe-in-virginia",
    "https://www.transurban.com/news/keeping-your-kids-safe-on-the-road",
    "https://www.transurban.com/news/kidsafe-new-road-safety-partners",
    "https://www.transurban.com/news/laurie-mahon-north-american-advisory-board",
    "https://www.transurban.com/news/leadership-changes-in-north-america",
    "https://www.transurban.com/news/legacy-way-tunnel-1million-donation",
    "https://www.transurban.com/news/legacy-way-tunnel-hosts-legacy-centenary-torch-relay",
    "https://www.transurban.com/news/legacy-youth-program-future-leaders",
    "https://www.transurban.com/news/lep-leads-the-way-for-sustainability",
    "https://www.transurban.com/news/lightbulb-moments",
    "https://www.transurban.com/news/linkt-assist-is-here",
    "https://www.transurban.com/news/linkt-rollout-now-complete",
    "https://www.transurban.com/news/lock-your-loads-down-before-you-go",
    "https://www.transurban.com/news/logan-enhancement-project-complete",
    "https://www.transurban.com/news/logan-west-upgrade",
    "https://www.transurban.com/news/logan-west-upgrade-community-consultation",
    "https://www.transurban.com/news/logan-west-upgrade-reference-design",
    "https://www.transurban.com/news/looking-ahead-at-us-infrastructure",
    "https://www.transurban.com/news/m2-excellent-rating",
    "https://www.transurban.com/news/m7-smart-motorway-solution",
    "https://www.transurban.com/news/making-tolling-more-accessible",
    "https://www.transurban.com/news/maryland-express-lanes-advances",
    "https://www.transurban.com/news/maryland-predevelopment-works-begins",
    "https://www.transurban.com/news/md-express-lanes-to-provide-regional-economy-boost",
    "https://www.transurban.com/news/michelle-jablko-appointed-as-transurban-group-ceo",
    "https://www.transurban.com/news/migrant-refugee-women-finding-freedom-through-driver-training",
    "https://www.transurban.com/news/migrant-women-in-the-drivers-seat",
    "https://www.transurban.com/news/mileage-based-user-fee-pilot",
    "https://www.transurban.com/news/more-help-for-vulnerable-customers",
    "https://www.transurban.com/news/motorcycle-incident-response-crew",
    "https://www.transurban.com/news/motorcyclists-on-our-roads-how-to-share-the-road-safely",
    "https://www.transurban.com/news/neura-spine-research",
    "https://www.transurban.com/news/new-m4-tunnels-now-open",
    "https://www.transurban.com/news/new-research-report-on-liveable-and-productive-cities",
    "https://www.transurban.com/news/new-research-understanding-risky-driving-behaviours",
    "https://www.transurban.com/news/new-safety-risk-for-children",
    "https://www.transurban.com/news/new-transurban-research-electric-vehicles",
    "https://www.transurban.com/news/new-virginia-hands-free-law",
    "https://www.transurban.com/news/next-extension-breaks-ground",
    "https://www.transurban.com/news/no-more-gps-dropouts",
    "https://www.transurban.com/news/noise-wall-brought-to-life",
    "https://www.transurban.com/news/north-american-advisory-board",
    "https://www.transurban.com/news/northconnex-in-tunnel-lighting",
    "https://www.transurban.com/news/northconnex-now-open",
    "https://www.transurban.com/news/northconnex-premiere-tunnel-tour",
    "https://www.transurban.com/news/northconnex-tunnelling-diversity",
    "https://www.transurban.com/news/northconnex-wins-global-award",
    "https://www.transurban.com/news/nsw-cav-trial",
    "https://www.transurban.com/news/nsw-cav-trials-launch",
    "https://www.transurban.com/news/nsw-toll-review-submission",
    "https://www.transurban.com/news/older-drivers-and-comfort-accessories",
    "https://www.transurban.com/news/on-our-roads-episode-1",
    "https://www.transurban.com/news/only-stop-on-motorways-in-an-emergency",
    "https://www.transurban.com/news/open-house-melbourne-2020",
    "https://www.transurban.com/news/our-covid19-journey",
    "https://www.transurban.com/news/our-plan-to-tackle-financial-exclusion",
    "https://www.transurban.com/news/our-sustainability-performance-recognised",
    "https://www.transurban.com/news/overheight-vehicle-alert",
    "https://www.transurban.com/news/pacemaker-lighting-is-making-burnley-tunnel-a-better-drive",
    "https://www.transurban.com/news/partnering-to-drive-growth",
    "https://www.transurban.com/news/partnering-to-help-learner-drivers",
    "https://www.transurban.com/news/partnering-with-the-salvos",
    "https://www.transurban.com/news/performance-of-booster-seats",
    "https://www.transurban.com/news/pluspartnership",
    "https://www.transurban.com/news/preparing-and-adapting-for-climate-change-impacts",
    "https://www.transurban.com/news/preparing-for-wet-weather",
    "https://www.transurban.com/news/preparing-roads-for-extreme-weather",
    "https://www.transurban.com/news/progress-on-nsw-toll-reform",
    "https://www.transurban.com/news/progress-on-the-wgtp",
    "https://www.transurban.com/news/protecting-enhancing-koala-habitat",
    "https://www.transurban.com/news/protecting-our-youngest-road-users",
    "https://www.transurban.com/news/protecting-precious-cargo",
    "https://www.transurban.com/news/putting-the-a-in-steam",
    "https://www.transurban.com/news/qld-cav-trial-findings",
    "https://www.transurban.com/news/qld-community-grants-recipients-2021",
    "https://www.transurban.com/news/qrsw",
    "https://www.transurban.com/news/r4k19-registrations-now-open",
    "https://www.transurban.com/news/r4k20-cancelled",
    "https://www.transurban.com/news/react-behaviour-change-program",
    "https://www.transurban.com/news/readying-for-recovery",
    "https://www.transurban.com/news/record-legacy-way-contribution-legacy-week",
    "https://www.transurban.com/news/research-into-community-attitudes-towards-automated-vehicles",
    "https://www.transurban.com/news/research-into-motorcycle-safety",
    "https://www.transurban.com/news/rmhc-250k-raised-to-support-sick-kids",
    "https://www.transurban.com/news/road-pricing-on-the-agenda-in-melbourne",
    "https://www.transurban.com/news/road-safety-a-class-act",
    "https://www.transurban.com/news/road-safety-jeremy-woolley",
    "https://www.transurban.com/news/road-safety-knowledge-gaps",
    "https://www.transurban.com/news/road-safety-our-shared-responsibility",
    "https://www.transurban.com/news/road-safety-partnership",
    "https://www.transurban.com/news/robo-cones-trial-citylink",
    "https://www.transurban.com/news/rozelle-interchange-opening",
    "https://www.transurban.com/news/run-for-the-kids",
    "https://www.transurban.com/news/run-for-the-kids-2023",
    "https://www.transurban.com/news/run-for-the-kids-2024",
    "https://www.transurban.com/news/run-for-the-kids-2025",
    "https://www.transurban.com/news/run-for-the-kids-raises-1-million",
    "https://www.transurban.com/news/run-for-the-kids-turns-21-new-21km-course-extended-partnership",
    "https://www.transurban.com/news/safer-ways-to-get-comfortable-in-the-car",
    "https://www.transurban.com/news/safety-pilot-95-express-lanes",
    "https://www.transurban.com/news/scam-reports-surge-as-community-fights-hackers",
    "https://www.transurban.com/news/scams-awareness-week-ai-powered-scam-defence",
    "https://www.transurban.com/news/share-the-road-for-safety",
    "https://www.transurban.com/news/share-your-thoughts-in-our-community-survey",
    "https://www.transurban.com/news/sharing-insights-from-our-community",
    "https://www.transurban.com/news/sharing-the-road-with-trucks",
    "https://www.transurban.com/news/signs-that-job-offer-is-a-scam",
    "https://www.transurban.com/news/smart-roads-safer-journeys",
    "https://www.transurban.com/news/stem-scholarships-help-students-dream-big",
    "https://www.transurban.com/news/students-get-a-lift-with-ballet",
    "https://www.transurban.com/news/study-support-for-more-financial-counsellors",
    "https://www.transurban.com/news/summer-2023-grant-recipients-north-america",
    "https://www.transurban.com/news/support-for-bushfire-affected-communities",
    "https://www.transurban.com/news/support-for-communities-impacted-by-floods",
    "https://www.transurban.com/news/support-for-more-financial-counsellors",
    "https://www.transurban.com/news/support-for-those-who-support-others",
    "https://www.transurban.com/news/supporting-disadvantaged-new-mums",
    "https://www.transurban.com/news/supporting-local-families-as-school-returns",
    "https://www.transurban.com/news/supporting-military-and-veteran-students",
    "https://www.transurban.com/news/supporting-our-local-communities-nvfs",
    "https://www.transurban.com/news/supporting-people-who-need-it-most",
    "https://www.transurban.com/news/supporting-really-special-people",
    "https://www.transurban.com/news/supporting-road-safety-in-queensland",
    "https://www.transurban.com/news/supporting-seagrass-restoration",
    "https://www.transurban.com/news/supporting-small-businesses",
    "https://www.transurban.com/news/supporting-small-businesses-fy22",
    "https://www.transurban.com/news/sustainable-development-goals",
    "https://www.transurban.com/news/sustainable-infrastructure-asset-management",
    "https://www.transurban.com/news/sustainable-infrastructure-partnerships-zero-future",
    "https://www.transurban.com/news/sydney-cav-trial-findings",
    "https://www.transurban.com/news/sydney-gateway",
    "https://www.transurban.com/news/sydney-transport-partners-westconnex",
    "https://www.transurban.com/news/tableau-data-analytics",
    "https://www.transurban.com/news/teaming-up-with-the-climate-board",
    "https://www.transurban.com/news/tech-jobs-for-people-with-disability",
    "https://www.transurban.com/news/testing-child-car-seats-for-children-with-disabilities",
    "https://www.transurban.com/news/the-countdown-to-run-for-the-kids-is-on",
    "https://www.transurban.com/news/the-west-gate-tunnel-is-now-open",
    "https://www.transurban.com/news/toll-roads-inquiry-queensland",
    "https://www.transurban.com/news/tour-de-brisbane-offer",
    "https://www.transurban.com/news/tour-the-citylink-traffic-control-room",
    "https://www.transurban.com/news/tourdebrisbane",
    "https://www.transurban.com/news/traffic-control-room-sydney",
    "https://www.transurban.com/news/transurban-announces-new-bridge-to-brisbane-charity-partner-brake",
    "https://www.transurban.com/news/transurban-community-grants-now-open",
    "https://www.transurban.com/news/transurbans-leadership-transitions",
    "https://www.transurban.com/news/tunnelling-into-technology",
    "https://www.transurban.com/news/turning-truck-tyres-into-asphalt",
    "https://www.transurban.com/news/two-projects-to-expand-access-to-95-395",
    "https://www.transurban.com/news/two-wheel-incident-response",
    "https://www.transurban.com/news/underpayments-of-long-service-leave-entitlements",
    "https://www.transurban.com/news/understanding-our-fy26-results",
    "https://www.transurban.com/news/unlock-a-26clitre-fuel-discount-with-linkt",
    "https://www.transurban.com/news/update-on-westconnex-bid",
    "https://www.transurban.com/news/urban-mobility-trends-1h22",
    "https://www.transurban.com/news/urban-mobility-trends-2025",
    "https://www.transurban.com/news/urban-mobility-trends-august-2023",
    "https://www.transurban.com/news/urban-mobility-trends-road-funding-reform",
    "https://www.transurban.com/news/us-smart-highways-challenge-update",
    "https://www.transurban.com/news/using-ai-to-keep-people-moving",
    "https://www.transurban.com/news/vehicle-classification-in-victoria",
    "https://www.transurban.com/news/vehicle-to-infrastructure-tech-to-improve-safety",
    "https://www.transurban.com/news/vehicle-to-infrastructure-technology-express-lanes",
    "https://www.transurban.com/news/ventia-incident-response-maintenance",
    "https://www.transurban.com/news/victorian-cav-trials-report",
    "https://www.transurban.com/news/victorian-project-milestones",
    "https://www.transurban.com/news/virginia-atma-technology-partnership",
    "https://www.transurban.com/news/welcoming-first-nations-apprentices-to-our-assets",
    "https://www.transurban.com/news/west-gate-tunnel-project-elevated-road-builder",
    "https://www.transurban.com/news/westconnex-acquisition",
    "https://www.transurban.com/news/westconnex-financial-close",
    "https://www.transurban.com/news/westconnex-m8-now-open",
    "https://www.transurban.com/news/westlink-m7-branches-out-to-help-koalas",
    "https://www.transurban.com/news/wgtp-welcomes-vu-students",
    "https://www.transurban.com/news/what-matters-to-you-matters-to-us",
    "https://www.transurban.com/news/what-you-need-to-know-about-toll-reform-nsw",
    "https://www.transurban.com/news/wheels-for-meals",
    "https://www.transurban.com/news/wind-to-power-our-roads",
    "https://www.transurban.com/news/wind-to-power-sydney-roads",
    "https://www.transurban.com/news/winston-heights-volunteer-day",
    "https://www.transurban.com/news/working-to-improve-customer-outcomes",
    "https://www.transurban.com/news/working-together-to-keep-our-drivers-safe",
    "https://www.transurban.com/news/working-together-to-keep-sydney-moving"
  ],
  "description": "Article page with title, date, long-form body copy, inline images or video, share and tag bar and author bio",
  "blocks": [
    {
      "name": "article-share-tags",
      "instances": [
        ".news-article__actions-container"
      ],
      "pageInstances": {
        "https://www.transurban.com/archive/qrsw": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/2025-community-grant-recipients-peoples-choice-award": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/2025-peoples-choice-award-winners": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/2026-community-grant-recipients-peoples-choice-award": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/2026-transurban-community-grants-now-open": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/395-express-lanes-continues-annual-transit-investments": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/495-express-lanes-northern-extension-now-open": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/495-next-project-early-works": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/95-express-lanes-fredericksburg-extension-opens": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/a-breath-of-fresh-air-thanks-to-northconnex": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/a-step-up-for-stem": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/additional-interests-in-westlinkm7-northconnex-westconnex": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/announcing-our-2026-transurban-community-grants-recipients": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/another-layer-of-protection-against-sms-scams": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/asx--release-nsw-toll-notice-digitisation-and-enforcement": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/attitudes-towards-road-user-charging-reform": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/automated-truck-trial": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/automated-truck-trial-findings": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/avoid-scams-and-stay-safe-online": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/behind-the-scenes-at-our-freeway-control-centre": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/better-journeys-along-the-95": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/bonus-fuel-savings-up-for-grabs": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/boost-your-shot-to-win": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/bridge-fun-run-raises-over-one-million": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/bridge-to-brisbane-2024-wrap-up": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/bridge-to-brisbane-2025": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/bridge-to-brisbane-2026": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/bringing-back-the-26cpl-fuel-discount-with-linkt": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/brisbane-convoy-for-kids": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/car-seat-blitz-reveals-common-mistakes": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/car-seat-installation": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/car-seat-installation-errors": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/car-seat-safety-blitz": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/cavs-demonstrations": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/challenging-drivers-to-rethink-road-safety": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/charge-your-ev-on-us-with-our-new-linkt-competition": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/child-passenger-safety-awareness": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/child-seat-safety-webinar": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/children-sitting-in-front-seat-at-high-risk-of-injury": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/citylink-mapping-innovation": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/citylink-to-be-wind-powered": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/cleaner-greener-roads-and-tunnels": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/common-car-seat-mistakes": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/community-grant-gives-back-in-virginia": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/community-grants-2023": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/community-grants-2023-vote": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/community_grant_recipients_2022": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/connecting-melbourne-for-25-years": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/connecting-military-veterans-with-new-career-opportunities": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/connecting-people-with-meaningful-work": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/connecting-sydneysiders-with-affordable-ev-options": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/cyclists-urged-to-stay-out-of-tunnels": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/dangerous-goods-in-tunnels": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/dc-bike-ride": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/debris-on-motorways": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/decade-of-creating-job-opportunities": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/design-and-construction-contractor-maryland": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/downer-awarded-contract-for-northconnex-hills-m2-lane-cove-tunnel": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/drive-to-donate-395-anniversary": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/driver-training-program-the-key-to-independence": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/driving-a-more-diverse-future-in-stem": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/driving-choice-for-communities-and-our-customers": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/eco-driving-trial-findings": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/education-the-key-to-truck-safety": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/egis-awarded-irm-contract-for-wcx-eastern-distributor-cross-city-tunnel": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/electric-incident-response-vehicle": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/electric-vehicles-powered-by-parliament": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/engagement-survey-2023": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/entering-new-markets-in-the-us": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/ev-experience-register-nsw": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/express-lanes-are-driving-sustainability": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/express-lanes-how-we-promote-multimodal-choices": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/express-lanes-invest-in-regional-travel-options": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/eyes-on-signs-of-modern-slavery": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/fighting-back-against-scams": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/fighting-fatigue-with-zombies-self-care": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/fleet-managers-in-the-ev-drivers-seat": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/free-kidsafe-child-car-seat-checks-picked-up-common-mistakes": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/fun-run-wrap-up": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/future-of-freight": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/gaps-in-driver-awareness": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/get-your-shot-to-win": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/getting-ready-for-an-ev-future": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/gotoll-expands-to-west-coast": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/gps-data-reveals-northconnex-impact": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/grant-to-support-us-veterans": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/help-name-the-west-gate-tunnels": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/heroism-on-the-395-express-lanes": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/how-we-are-measuring-up-on-sustainability": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/how-we-are-working-and-travelling": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/how-were-travelling-in-2024": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/i-24-southeast-choice-lanes-commercial-close": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/improving-access-to-hardship-support": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/incident-response-queensland": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/indigenous-driving-school": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/infrastructure-sector-boosted-by-historic-investment": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/inspiring-the-next-gen-women": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/inspiring-the-next-generation": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/ipa-partnerships-conference-2026": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/keeping-an-eye-out-for-others-on-the-road": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/keeping-the-littlest-of-passengers-safe-in-virginia": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/keeping-your-kids-safe-on-the-road": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/kidsafe-new-road-safety-partners": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/laurie-mahon-north-american-advisory-board": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/legacy-way-tunnel-1million-donation": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/legacy-way-tunnel-hosts-legacy-centenary-torch-relay": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/lightbulb-moments": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/lock-your-loads-down-before-you-go": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/logan-west-upgrade": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/logan-west-upgrade-community-consultation": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/logan-west-upgrade-reference-design": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/m2-excellent-rating": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/making-tolling-more-accessible": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/maryland-express-lanes-advances": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/maryland-predevelopment-works-begins": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/md-express-lanes-to-provide-regional-economy-boost": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/migrant-refugee-women-finding-freedom-through-driver-training": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/mileage-based-user-fee-pilot": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/motorcyclists-on-our-roads-how-to-share-the-road-safely": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/neura-spine-research": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/new-research-report-on-liveable-and-productive-cities": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/new-research-understanding-risky-driving-behaviours": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/new-transurban-research-electric-vehicles": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/next-extension-breaks-ground": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/noise-wall-brought-to-life": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/northconnex-wins-global-award": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/nsw-toll-review-submission": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/on-our-roads-episode-1": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/only-stop-on-motorways-in-an-emergency": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/our-sustainability-performance-recognised": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/overheight-vehicle-alert": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/pacemaker-lighting-is-making-burnley-tunnel-a-better-drive": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/partnering-to-help-learner-drivers": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/pluspartnership": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/preparing-and-adapting-for-climate-change-impacts": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/preparing-for-wet-weather": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/preparing-roads-for-extreme-weather": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/progress-on-nsw-toll-reform": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/progress-on-the-wgtp": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/protecting-enhancing-koala-habitat": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/putting-the-a-in-steam": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/qld-community-grants-recipients-2021": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/qrsw": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/record-legacy-way-contribution-legacy-week": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/road-safety-knowledge-gaps": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/road-safety-our-shared-responsibility": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/rozelle-interchange-opening": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/run-for-the-kids-2023": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/run-for-the-kids-2024": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/run-for-the-kids-2025": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/run-for-the-kids-raises-1-million": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/run-for-the-kids-turns-21-new-21km-course-extended-partnership": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/safer-ways-to-get-comfortable-in-the-car": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/scam-reports-surge-as-community-fights-hackers": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/scams-awareness-week-ai-powered-scam-defence": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/share-the-road-for-safety": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/share-your-thoughts-in-our-community-survey": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/sharing-insights-from-our-community": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/signs-that-job-offer-is-a-scam": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/smart-roads-safer-journeys": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/study-support-for-more-financial-counsellors": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/summer-2023-grant-recipients-north-america": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/support-for-communities-impacted-by-floods": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/support-for-more-financial-counsellors": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/supporting-military-and-veteran-students": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/supporting-road-safety-in-queensland": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/supporting-small-businesses-fy22": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/sustainable-infrastructure-asset-management": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/sustainable-infrastructure-partnerships-zero-future": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/sydney-gateway": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/teaming-up-with-the-climate-board": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/tech-jobs-for-people-with-disability": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/testing-child-car-seats-for-children-with-disabilities": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/the-countdown-to-run-for-the-kids-is-on": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/the-west-gate-tunnel-is-now-open": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/tour-de-brisbane-offer": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/tourdebrisbane": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/traffic-control-room-sydney": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/transurban-announces-new-bridge-to-brisbane-charity-partner-brake": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/transurban-community-grants-now-open": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/transurbans-leadership-transitions": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/two-projects-to-expand-access-to-95-395": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/two-wheel-incident-response": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/understanding-our-fy26-results": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/unlock-a-26clitre-fuel-discount-with-linkt": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/urban-mobility-trends-1h22": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/urban-mobility-trends-2025": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/urban-mobility-trends-august-2023": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/urban-mobility-trends-road-funding-reform": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/using-ai-to-keep-people-moving": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/vehicle-classification-in-victoria": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/welcoming-first-nations-apprentices-to-our-assets": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/westconnex-acquisition": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/westlink-m7-branches-out-to-help-koalas": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/what-matters-to-you-matters-to-us": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/what-you-need-to-know-about-toll-reform-nsw": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ],
        "https://www.transurban.com/news/working-together-to-keep-sydney-moving": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__actions-container"
        ]
      }
    },
    {
      "name": "embed-video",
      "instances": [
        ".rich-text p:has(> iframe)",
        "#main div.video.embed",
        ".module--video-embed"
      ],
      "pageInstances": {
        "https://www.transurban.com/archive/qrsw": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(11)"
        ],
        "https://www.transurban.com/news/395-express-lanes-opens": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/a-rewarding-partnership": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/bridge-fun-run-raises-over-one-million": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/bridge-to-brisbane-2024-wrap-up": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(7)"
        ],
        "https://www.transurban.com/news/bridge-to-brisbane-2025": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(6)"
        ],
        "https://www.transurban.com/news/brisbane-convoy-for-kids": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/car-seat-fittings-for-customers": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(7)"
        ],
        "https://www.transurban.com/news/car-seat-installation-errors": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(15)"
        ],
        "https://www.transurban.com/news/carpool-challenge-finalists": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(8)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(9)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(10)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(11)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(12)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(13)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(14)"
        ],
        "https://www.transurban.com/news/carpool-challenge-winner": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(5)"
        ],
        "https://www.transurban.com/news/carpool-on-our-roads": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/charity-day-2018": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/charity-day-2019": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/child-passenger-safety-awareness": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/child-restraint-chest-clip": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(7)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(8)"
        ],
        "https://www.transurban.com/news/child-seat-safety-webinar": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(5)"
        ],
        "https://www.transurban.com/news/citylink-is-not-a-place-for-cyclists": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/citylink-to-be-wind-powered": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/community-grant-gives-back-in-virginia": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/connecting-military-veterans-with-new-career-opportunities": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/cycle-parks-project": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/cyclists-urged-to-stay-out-of-tunnels": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(11)"
        ],
        "https://www.transurban.com/news/fun-run-wrap-up": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/helping-families-in-need": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/incident-response-queensland": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(11)"
        ],
        "https://www.transurban.com/news/increase-in-speeding-and-risky-driving": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/join-our-road-safety-heroes": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(6)"
        ],
        "https://www.transurban.com/news/keeping-kids-safe-on-the-roads": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/keeping-your-kids-safe-on-the-road": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(6)"
        ],
        "https://www.transurban.com/news/legacy-youth-program-future-leaders": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/lock-your-loads-down-before-you-go": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/logan-enhancement-project-complete": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(5)"
        ],
        "https://www.transurban.com/news/logan-west-upgrade": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/logan-west-upgrade-community-consultation": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(6)"
        ],
        "https://www.transurban.com/news/more-help-for-vulnerable-customers": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(7)"
        ],
        "https://www.transurban.com/news/motorcycle-incident-response-crew": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/new-m4-tunnels-now-open": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/new-safety-risk-for-children": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/no-more-gps-dropouts": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/northconnex-in-tunnel-lighting": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/northconnex-premiere-tunnel-tour": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3) > iframe"
        ],
        "https://www.transurban.com/news/northconnex-tunnelling-diversity": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/nsw-cav-trial": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/nsw-cav-trials-launch": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/older-drivers-and-comfort-accessories": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/on-our-roads-episode-1": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(8)"
        ],
        "https://www.transurban.com/news/partnering-with-the-salvos": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)",
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(5)"
        ],
        "https://www.transurban.com/news/preparing-for-wet-weather": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(8)"
        ],
        "https://www.transurban.com/news/qrsw": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(11)"
        ],
        "https://www.transurban.com/news/research-into-community-attitudes-towards-automated-vehicles": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/rmhc-250k-raised-to-support-sick-kids": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(5)"
        ],
        "https://www.transurban.com/news/road-safety-a-class-act": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(6)"
        ],
        "https://www.transurban.com/news/robo-cones-trial-citylink": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/safety-pilot-95-express-lanes": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/share-the-road-for-safety": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(14)"
        ],
        "https://www.transurban.com/news/stem-scholarships-help-students-dream-big": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/students-get-a-lift-with-ballet": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(1)"
        ],
        "https://www.transurban.com/news/study-support-for-more-financial-counsellors": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/support-for-more-financial-counsellors": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(6)"
        ],
        "https://www.transurban.com/news/supporting-disadvantaged-new-mums": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/supporting-seagrass-restoration": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/tech-jobs-for-people-with-disability": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(19)"
        ],
        "https://www.transurban.com/news/the-countdown-to-run-for-the-kids-is-on": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(5)"
        ],
        "https://www.transurban.com/news/tour-the-citylink-traffic-control-room": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.video.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/us-smart-highways-challenge-update": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(9)"
        ],
        "https://www.transurban.com/news/victorian-cav-trials-report": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(7)"
        ],
        "https://www.transurban.com/news/welcoming-first-nations-apprentices-to-our-assets": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(2)"
        ],
        "https://www.transurban.com/news/west-gate-tunnel-project-elevated-road-builder": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(5)"
        ],
        "https://www.transurban.com/news/westconnex-m8-now-open": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(4)"
        ],
        "https://www.transurban.com/news/wind-to-power-our-roads": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ],
        "https://www.transurban.com/news/wind-to-power-sydney-roads": [
          "#main > div > div.newsArticle.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div.news-article__content > div.news-article__rich-text > div > div > div > p:nth-child(3)"
        ]
      }
    },
    {
      "name": "accordion",
      "instances": [
        "div.contentaccordion.accordion"
      ],
      "pageInstances": {
        "https://www.transurban.com/news/2025-community-grant-recipients-peoples-choice-award": [
          "#recipients > div > div > ul"
        ],
        "https://www.transurban.com/news/2026-community-grant-recipients-peoples-choice-award": [
          "#recipients-all > div > div > ul"
        ],
        "https://www.transurban.com/news/announcing-our-2026-transurban-community-grants-recipients": [
          "#contentaccordion-4aed244bb9 > div > div > ul"
        ]
      }
    },
    {
      "name": "author-bio",
      "instances": [
        "#main div.richContentContainer:has(.featuredImageCTA)"
      ],
      "pageInstances": {
        "https://www.transurban.com/news/asset-recycling-getting-beyond-the-name": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/cavs-and-managed-roadways": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/cavs-i95-express-lanes": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/cleveland-street-off-ramp": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/connecting-people-with-meaningful-work": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/driving-infrastructure-modernization": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/how-to-build-for-tomorrow": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/improving-gender-balance-within-infrastructure": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/infrastructure-public-private-partnerships": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/infrastructure-sector-boosted-by-historic-investment": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/investing-in-the-future-of-us-infrastructure": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/looking-ahead-at-us-infrastructure": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/m7-smart-motorway-solution": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/nsw-cav-trial": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/our-covid19-journey": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/road-safety-a-class-act": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/road-safety-jeremy-woolley": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/road-safety-partnership": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/sustainable-infrastructure-partnerships-zero-future": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/tableau-data-analytics": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/testing-child-car-seats-for-children-with-disabilities": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/tunnelling-into-technology": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/victorian-cav-trials-report": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "cards-news",
      "instances": [
        ".filtercontent"
      ],
      "pageInstances": {
        "https://www.transurban.com/news/behind-the-scenes-at-our-freeway-control-centre": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/bridge-to-brisbane-2026": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/entering-new-markets-in-the-us": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/i-24-southeast-choice-lanes-commercial-close": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/ipa-partnerships-conference-2026": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/record-legacy-way-contribution-legacy-week": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/scams-awareness-week-ai-powered-scam-defence": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/understanding-our-fy26-results": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.transurban.com/news/what-you-need-to-know-about-toll-reform-nsw": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.filtercontent.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "columns-media",
      "instances": [],
      "pageInstances": {
        "https://www.transurban.com/news/attitudes-towards-road-user-charging-reform": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4) > div > div > div > div > div > div > div > div > div > div > div"
        ],
        "https://www.transurban.com/news/sustainable-development-goals": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        ".rich-text .scrolltable"
      ],
      "pageInstances": {
        "https://www.transurban.com/news/what-you-need-to-know-about-toll-reform-nsw": [
          "#main > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.richContentContainer.aem-GridColumn.aem-GridColumn--default--12 > div > div > div > div > div > div > div > div > div > div > div"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "page-root",
      "name": "page-root",
      "selector": [
        "#inner-wrap > div.root.responsivegrid"
      ],
      "style": null,
      "blocks": [
        "article-share-tags",
        "embed-video",
        "accordion",
        "author-bio",
        "cards-news",
        "columns-media",
        "table-data"
      ],
      "defaultContent": [
        ".news-article h1",
        ".news-article__date",
        ".news-article .rich-text",
        "#main .rich-text",
        "#main h2",
        "#main h3",
        "#main p",
        "#main ul",
        "#main ol"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.transurban.com/archive/qrsw": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/2025-community-grant-recipients-peoples-choice-award": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/2025-peoples-choice-award-winners": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/2026-community-grant-recipients-peoples-choice-award": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/2026-transurban-community-grants-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/395-express-lanes-continues-annual-transit-investments": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/395-express-lanes-one-year": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/395-express-lanes-opens": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/495-express-lanes-northern-extension-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/495-next-project-advances": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/495-next-project-early-works": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/495-northern-extension-project": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/495-northern-extension-reaches-next-milestone": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/95-express-lanes-fredericksburg-extension-opens": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/a-breath-of-fresh-air-thanks-to-northconnex": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/a-rewarding-partnership": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/a-step-up-for-stem": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/a25": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/a25-acquisition-canada": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/a25-tolling-resumes-with-customer-support": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/additional-interests-in-westlinkm7-northconnex-westconnex": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/announcing-our-2026-transurban-community-grants-recipients": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/another-layer-of-protection-against-sms-scams": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/asset-recycling-getting-beyond-the-name": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/asx--release-nsw-toll-notice-digitisation-and-enforcement": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/attitudes-towards-road-user-charging-reform": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/automated-truck-trial": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/automated-truck-trial-findings": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/avoid-scams-and-stay-safe-online": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/b2b-back-to-the-gateway": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/behind-the-scenes-at-our-freeway-control-centre": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/better-journeys-along-the-95": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/bonus-fuel-savings-up-for-grabs": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/boost-your-shot-to-win": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/bridge-fun-run-raises-over-one-million": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/bridge-to-brisbane-2024-wrap-up": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/bridge-to-brisbane-2025": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/bridge-to-brisbane-2026": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/bringing-back-the-26cpl-fuel-discount-with-linkt": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/brisbane-convoy-for-kids": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/car-seat-blitz-reveals-common-mistakes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/car-seat-fittings-for-customers": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/car-seat-installation": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/car-seat-installation-errors": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/car-seat-safety-blitz": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/carpool-challenge-finalists": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/carpool-challenge-winner": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/carpool-on-our-roads": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/cav-trials-brisbane": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/cavs-and-managed-roadways": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/cavs-demonstrations": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/cavs-i95-express-lanes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/challenging-drivers-to-rethink-road-safety": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/charge-your-ev-on-us-with-our-new-linkt-competition": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/charity-day-2018": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/charity-day-2019": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/checking-in-on-mobility-trends": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/child-passenger-safety-awareness": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/child-restraint-chest-clip": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/child-seat-safety-webinar": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/children-sitting-in-front-seat-at-high-risk-of-injury": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/citylink-is-not-a-place-for-cyclists": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/citylink-mapping-innovation": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/citylink-to-be-wind-powered": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/citylink-travel-time-signs": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/cleaner-greener-roads-and-tunnels": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/cleveland-street-off-ramp": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/common-car-seat-mistakes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/community-grant-funding-tripled": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/community-grant-gives-back-in-virginia": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/community-grants-2023": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/community-grants-2023-vote": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/community_grant_recipients_2022": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/connecting-customers-to-support-networks": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/connecting-melbourne-for-25-years": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/connecting-military-veterans-with-new-career-opportunities": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/connecting-people-with-meaningful-work": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/connecting-sydneysiders-with-affordable-ev-options": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/coronavirus-supporting-customers-employees": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/covid-response-expanded-va": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/cycle-parks-project": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/cyclists-urged-to-stay-out-of-tunnels": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/dangerous-goods-in-tunnels": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/darkness-to-daylight-challenge": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/dc-bike-ride": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/debris-on-motorways": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/decade-of-creating-job-opportunities": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/design-and-construction-contractor-maryland": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/downer-awarded-contract-for-northconnex-hills-m2-lane-cove-tunnel": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/drive-to-donate-395-anniversary": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/driver-training-program-the-key-to-independence": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/driving-a-more-diverse-future-in-stem": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/driving-choice-for-communities-and-our-customers": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/driving-infrastructure-modernization": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/eco-driving-trial-findings": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/ed-emergency-exercise": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/education-the-key-to-truck-safety": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/egis-awarded-irm-contract-for-wcx-eastern-distributor-cross-city-tunnel": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/electric-incident-response-vehicle": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/electric-vehicles-powered-by-parliament": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/energy-breakthrough": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/energy-breakthrough-kicksoff": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/engagement-survey-2023": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/enhancing-native-bushland": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/entering-new-markets-in-the-us": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/ev-experience-register-nsw": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/express-lanes-are-driving-sustainability": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/express-lanes-expansion-into-maryland": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/express-lanes-how-we-promote-multimodal-choices": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/express-lanes-invest-in-regional-travel-options": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/extension-of-melbourne-incident-response": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/eyes-on-signs-of-modern-slavery": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/fiap-achievements": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/fighting-back-against-scams": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/fighting-fatigue-with-zombies-self-care": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/flattening-the-congestion-curve": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/fleet-managers-in-the-ev-drivers-seat": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/fredericksburg-extension-project-approved": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/fredex-project-construction": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/free-kidsafe-child-car-seat-checks-picked-up-common-mistakes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/fun-run-wrap-up": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/future-of-freight": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/gaps-in-driver-awareness": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/get-your-shot-to-win": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/getting-ready-for-an-ev-future": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/ghg-reduction-targets-validated": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/global-leader-in-sustainability": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/gotoll-app": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/gotoll-app-expands-service": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/gotoll-expands-to-west-coast": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/gps-data-reveals-northconnex-impact": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/grant-to-support-us-veterans": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/great-brisbane-bikeride-18": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/help-name-the-west-gate-tunnels": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/helping-families-in-need": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/helping-people-impacted-by-covid": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/helping-students-achieve-financial-independence": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/helping-students-dream-big": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/heroism-on-the-395-express-lanes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/how-to-build-for-tomorrow": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/how-we-are-measuring-up-on-sustainability": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/how-we-are-working-and-travelling": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/how-were-moving-mobility-trends": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/how-were-travelling-in-2024": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/i-24-southeast-choice-lanes-commercial-close": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/i95-road-user-charging-trials": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/improving-access-to-hardship-support": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/improving-gender-balance-within-infrastructure": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/improving-neighbourly-relations": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/incident-response-queensland": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/increase-in-speeding-and-risky-driving": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/indigenous-driving-school": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/industry-road-safety-roundtable": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/infrastructure-public-private-partnerships": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/infrastructure-sector-boosted-by-historic-investment": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/inspiring-the-next-gen-women": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/inspiring-the-next-generation": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/investigation-into-tullamarine-freeway-signage": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/investing-in-the-future-of-us-infrastructure": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/ipa-partnerships-conference-2026": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/join-our-road-safety-heroes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/keeping-an-eye-out-for-others-on-the-road": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/keeping-kids-safe-on-the-roads": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/keeping-the-littlest-of-passengers-safe-in-virginia": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/keeping-your-kids-safe-on-the-road": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/kidsafe-new-road-safety-partners": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/laurie-mahon-north-american-advisory-board": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/leadership-changes-in-north-america": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/legacy-way-tunnel-1million-donation": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/legacy-way-tunnel-hosts-legacy-centenary-torch-relay": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/legacy-youth-program-future-leaders": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/lep-leads-the-way-for-sustainability": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/lightbulb-moments": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/linkt-assist-is-here": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/linkt-rollout-now-complete": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/lock-your-loads-down-before-you-go": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/logan-enhancement-project-complete": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/logan-west-upgrade": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/logan-west-upgrade-community-consultation": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/logan-west-upgrade-reference-design": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/looking-ahead-at-us-infrastructure": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/m2-excellent-rating": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/m7-smart-motorway-solution": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/making-tolling-more-accessible": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/maryland-express-lanes-advances": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/maryland-predevelopment-works-begins": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/md-express-lanes-to-provide-regional-economy-boost": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/michelle-jablko-appointed-as-transurban-group-ceo": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/migrant-refugee-women-finding-freedom-through-driver-training": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/migrant-women-in-the-drivers-seat": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/mileage-based-user-fee-pilot": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/more-help-for-vulnerable-customers": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/motorcycle-incident-response-crew": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/motorcyclists-on-our-roads-how-to-share-the-road-safely": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/neura-spine-research": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/new-m4-tunnels-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/new-research-report-on-liveable-and-productive-cities": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/new-research-understanding-risky-driving-behaviours": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/new-safety-risk-for-children": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/new-transurban-research-electric-vehicles": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/new-virginia-hands-free-law": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/next-extension-breaks-ground": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/no-more-gps-dropouts": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/noise-wall-brought-to-life": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/north-american-advisory-board": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/northconnex-in-tunnel-lighting": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/northconnex-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/northconnex-premiere-tunnel-tour": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/northconnex-tunnelling-diversity": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/northconnex-wins-global-award": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/nsw-cav-trial": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/nsw-cav-trials-launch": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/nsw-toll-review-submission": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/older-drivers-and-comfort-accessories": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/on-our-roads-episode-1": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/only-stop-on-motorways-in-an-emergency": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/open-house-melbourne-2020": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/our-covid19-journey": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/our-plan-to-tackle-financial-exclusion": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/our-sustainability-performance-recognised": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/overheight-vehicle-alert": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/pacemaker-lighting-is-making-burnley-tunnel-a-better-drive": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/partnering-to-drive-growth": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/partnering-to-help-learner-drivers": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/partnering-with-the-salvos": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/performance-of-booster-seats": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/pluspartnership": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/preparing-and-adapting-for-climate-change-impacts": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/preparing-for-wet-weather": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/preparing-roads-for-extreme-weather": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/progress-on-nsw-toll-reform": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/progress-on-the-wgtp": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/protecting-enhancing-koala-habitat": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/protecting-our-youngest-road-users": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/protecting-precious-cargo": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/putting-the-a-in-steam": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/qld-cav-trial-findings": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/qld-community-grants-recipients-2021": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/qrsw": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/r4k19-registrations-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/r4k20-cancelled": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/react-behaviour-change-program": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/readying-for-recovery": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/record-legacy-way-contribution-legacy-week": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/research-into-community-attitudes-towards-automated-vehicles": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/research-into-motorcycle-safety": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/rmhc-250k-raised-to-support-sick-kids": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/road-pricing-on-the-agenda-in-melbourne": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/road-safety-a-class-act": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/road-safety-jeremy-woolley": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/road-safety-knowledge-gaps": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/road-safety-our-shared-responsibility": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/road-safety-partnership": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/robo-cones-trial-citylink": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/rozelle-interchange-opening": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/run-for-the-kids": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/run-for-the-kids-2023": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/run-for-the-kids-2024": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/run-for-the-kids-2025": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/run-for-the-kids-raises-1-million": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/run-for-the-kids-turns-21-new-21km-course-extended-partnership": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/safer-ways-to-get-comfortable-in-the-car": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/safety-pilot-95-express-lanes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/scam-reports-surge-as-community-fights-hackers": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/scams-awareness-week-ai-powered-scam-defence": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/share-the-road-for-safety": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/share-your-thoughts-in-our-community-survey": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/sharing-insights-from-our-community": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/sharing-the-road-with-trucks": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/signs-that-job-offer-is-a-scam": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/smart-roads-safer-journeys": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/stem-scholarships-help-students-dream-big": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/students-get-a-lift-with-ballet": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/study-support-for-more-financial-counsellors": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/summer-2023-grant-recipients-north-america": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/support-for-bushfire-affected-communities": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/support-for-communities-impacted-by-floods": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/support-for-more-financial-counsellors": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/support-for-those-who-support-others": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-disadvantaged-new-mums": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-local-families-as-school-returns": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-military-and-veteran-students": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-our-local-communities-nvfs": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-people-who-need-it-most": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-really-special-people": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-road-safety-in-queensland": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-seagrass-restoration": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-small-businesses": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/supporting-small-businesses-fy22": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/sustainable-development-goals": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/sustainable-infrastructure-asset-management": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/sustainable-infrastructure-partnerships-zero-future": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/sydney-cav-trial-findings": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/sydney-gateway": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/sydney-transport-partners-westconnex": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/tableau-data-analytics": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/teaming-up-with-the-climate-board": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/tech-jobs-for-people-with-disability": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/testing-child-car-seats-for-children-with-disabilities": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/the-countdown-to-run-for-the-kids-is-on": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/the-west-gate-tunnel-is-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/toll-roads-inquiry-queensland": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/tour-de-brisbane-offer": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/tour-the-citylink-traffic-control-room": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/tourdebrisbane": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/traffic-control-room-sydney": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/transurban-announces-new-bridge-to-brisbane-charity-partner-brake": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/transurban-community-grants-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/transurbans-leadership-transitions": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/tunnelling-into-technology": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/turning-truck-tyres-into-asphalt": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/two-projects-to-expand-access-to-95-395": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/two-wheel-incident-response": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/underpayments-of-long-service-leave-entitlements": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/understanding-our-fy26-results": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/unlock-a-26clitre-fuel-discount-with-linkt": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/update-on-westconnex-bid": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/urban-mobility-trends-1h22": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/urban-mobility-trends-2025": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/urban-mobility-trends-august-2023": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/urban-mobility-trends-road-funding-reform": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/us-smart-highways-challenge-update": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/using-ai-to-keep-people-moving": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/vehicle-classification-in-victoria": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/vehicle-to-infrastructure-tech-to-improve-safety": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/vehicle-to-infrastructure-technology-express-lanes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/ventia-incident-response-maintenance": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/victorian-cav-trials-report": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/victorian-project-milestones": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/virginia-atma-technology-partnership": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/welcoming-first-nations-apprentices-to-our-assets": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/west-gate-tunnel-project-elevated-road-builder": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/westconnex-acquisition": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/westconnex-financial-close": [
      "#yourir--anonComponent3",
      "div.modal-bg"
    ],
    "https://www.transurban.com/news/westconnex-m8-now-open": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/westlink-m7-branches-out-to-help-koalas": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/wgtp-welcomes-vu-students": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/what-matters-to-you-matters-to-us": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/what-you-need-to-know-about-toll-reform-nsw": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/wheels-for-meals": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/wind-to-power-our-roads": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/wind-to-power-sydney-roads": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/winston-heights-volunteer-day": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/working-to-improve-customer-outcomes": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/working-together-to-keep-our-drivers-safe": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ],
    "https://www.transurban.com/news/working-together-to-keep-sydney-moving": [
      "#yourir--anonComponent3",
      "#a2a_modal",
      "div.modal-bg",
      "#a2a_overlay",
      "#a2apage_full"
    ]
  }
};

const parsers = {
  'article-share-tags': articleShareTagsParser,
  'embed-video': embedVideoParser,
  'accordion': accordionParser,
  'author-bio': authorBioParser,
  'cards-news': cardsNewsParser,
  'columns-media': columnsMediaParser,
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
