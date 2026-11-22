# Transurban Site Migration Plan

**Source site:** https://www.transurban.com/
**Target:** AEM Edge Delivery Services, with Document Authoring as the content source (aclarke-adobe / tu-da)

> **The site scope hasn't started yet.** This chat is in planning mode, which only lets me update the plan. Nothing can be fetched, analysed or created here. **Switch to Execute mode** and the site scope will start right away. No further setup or input is needed.

## Current state
- The project is connected to Document Authoring (aclarke-adobe/tu-da).
- No site catalog or migration plan exists yet. This is a fresh migration from the starter template.
- **Next step: site scope.** It finds every page, groups pages into templates, catalogs the blocks and reports the migration size. All later phases depend on this catalog.

## Phase 1: Site scope (starts as soon as Execute mode is on)
1. **Find URLs.** Read transurban.com's sitemap, or crawl the site if there isn't one, to build the full list of pages, including regional sections (Australia, North America) and investor, media and project pages.
2. **Analyse sample pages.** Open representative pages, capture screenshots and structure, and identify sections and content patterns.
3. **Group into templates.** Group similar pages into page templates (likely candidates: homepage, news/media article, project or road page, investor centre, careers, general content and landing pages).
4. **Catalog blocks.** List the blocks and block variants each template uses, mapping them to standard blocks where possible. Flag custom or dynamic pieces such as toll calculators, maps, share price widgets, investor feeds and forms.
5. **Scope report.** Summarise page counts per template, block counts, custom block needs, shared components and effort.

**Phase 1 output:** a site catalog plus a scope report you can review before any content is imported. Nothing is written to Document Authoring or published.

**After Phase 1:** I stop and show you the results. Nothing is migrated until you've reviewed the scope.

## Later phases (after you review the scope)
2. **Review the scope with you.** Confirm which templates are in scope, which pages to leave out (for example, legal, archive or region-specific sections) and any renames or regroupings.
3. **Build the blocks.** Create the blocks from the catalog, reusing existing variants where they are close enough.
4. **Migrate template by template.** For each template: analyse a page, map its sections to blocks, generate import scripts, then bulk-import its pages into local content.
5. **Migrate the design.** Bring over fonts, colours, spacing and button styles, then style each block to match the original.
6. **Migrate the header and footer.** Rebuild the navigation (desktop, mega-menu, mobile) and the footer.
7. **Check quality.** Compare migrated pages with the originals and fix differences.

## Scope notes and risks
- **Size:** This is a large corporate site covering several regions. The scope report will give actual page counts before any import starts.
- **Dynamic or embedded content:** Calculators, maps, investor feeds and forms will probably need custom blocks or embeds. These will be flagged during scoping.
- **PDFs and documents:** Investor reports and other downloads will link to their original locations unless you decide otherwise.
- **Bot protection:** If the site blocks automated access, scraping will switch to a fallback fetch method automatically.
- **Local first:** All work stays local and is checked in the preview. Nothing is uploaded to Document Authoring or published unless you explicitly ask.

## Checklist

### Phase 1: Site scope (waiting for Execute mode)
- [ ] Find all site URLs (sitemap or crawl) for https://www.transurban.com/
- [ ] Analyse representative sample pages (screenshots, structure, sections)
- [ ] Group the pages into page templates
- [ ] Catalog the blocks and block variants for each template, flagging custom or dynamic content
- [ ] Produce the migration scope report (page counts, templates, blocks, effort)
- [ ] Present the scope results to you for review

### Later phases
- [ ] Review the scope with you: confirm templates in scope and pages to leave out
- [ ] Generate the block library from the catalog
- [ ] Migrate the homepage template (analysis, block mapping, import scripts, import)
- [ ] Migrate each remaining template in the agreed order
- [ ] Check imported content for each template and fix import issues
- [ ] Extract design tokens (typography, colours, spacing, buttons) and apply them site-wide
- [ ] Style each block to match the original site
- [ ] Migrate the header and navigation (desktop, mega-menu, mobile)
- [ ] Migrate the footer (desktop and mobile)
- [ ] Run a visual comparison across all pages and fix differences
- [ ] Final summary: what changed locally, open items, and next steps (uploading to Document Authoring or publishing only if you ask)
