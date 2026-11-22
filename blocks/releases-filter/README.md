# releases-filter

Custom block. Purpose: search box and dropdown filters for the ASX releases list that follows it.

## Authoring (Document Authoring)

Model: `standalone`

Single block table of key/value rows (key cell, case-insensitive):

| Key | Value |
| --- | --- |
| Search | placeholder text (leave the row out to hide the search box) |
| Category | the "All" label, then the options (a list, or comma-separated) |
| Year | the "All years" label, then the options: explicit years, `auto` (years found in the list), or a token like `2009+` (every year from the current year down to 2009, so a new year appears on 1 January without an edit). Tokens and explicit years can be mixed. |
| Target | optional CSS selector of the items to filter |

Filter values are kept in the URL (`?q=&category=&year=`), and every change dispatches `releases-filter:change` on `document` with the values, e.g. `{ q, category, year }`.

## With a releases-list feed

When the list after the filter is a releases-list in feed mode (`.releases-list[data-feed]`), the filter doesn't hide items itself: the feed filters on the server from the `releases-filter:change` event. This is checked each time a filter is applied, so it doesn't matter which block decorates first. If the feed's first request fails, the list falls back to its authored rows (`data-feed-status="offline"`) and the filter goes back to filtering those rows in the browser.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
