# releases-list

Custom block (no library base). Purpose: dated list of ASX releases with a pager (Previous, page numbers, Next) and a "Showing x–y of N" count. Optionally a live ASX announcements feed from the yourir public API, paged and filtered server-side.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Optional config rows come first (key cell, case-insensitive, any order):

| Key | Value | Notes |
| --- | --- | --- |
| Page size | number | Items per page. Default 10, or 15 in feed mode. |
| Feed | yourir symbol, e.g. `tcl.asx` | Feed mode needs both Feed and App ID. |
| App ID | yourir app ID, e.g. `a50955429d255a58` | |

Then one row per release: date cell (plain text, e.g. 19 November 2026) | title cell (link, or plain text).

## Static mode (no Feed / App ID)

All authored rows are paged client-side. A releases-filter block before the list hides non-matching rows, and paging follows the filter. `?page=N` is kept in the URL.

## Feed mode (Feed + App ID)

- The block gets `data-feed="<symbol>"`, the class `releases-list-feed`, and `data-feed-status` (`loading`, `live`, or `offline`).
- The authored rows render first, so the layout doesn't jump. They are replaced by the live page (`?page=N`, default 1) when the first request succeeds.
- Each item shows the date (`<time datetime>`, e.g. "19 November 2026") and the title, which links to the document. Links open in a new tab and carry a visually hidden " (PDF)" hint. Price-sensitive items get the class `releases-list-item-price-sensitive`.
- The count and the pager use the API totals. Changing page fetches that page: the list gets `aria-busy` and keeps the old items until the new ones arrive. A newer request cancels an older one.
- releases-filter values are sent to the API: search text → `search`, a category containing "price sensitive" → price-sensitive only, a 4-digit year → `year`. Any filter change returns to page 1. If nothing matches, the block shows "No releases match your search." and hides the pager.
- Fallback: if the first request fails, the authored rows stay and are paged and filtered client-side, as in static mode, and a console warning is logged. If a later request fails, the items already shown stay.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
