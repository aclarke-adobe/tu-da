# cards-icon

Custom **cards** block. Purpose: row of icon items, each with a title and optional text and link.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: icon image cell | body cell (title, optional text, optional link).

- A card with only a heading and one short plain link (40 characters or less) is a feature tile: the link renders as a green arrow pill CTA, and the icon and heading link to the same page.
- Bold (button) links longer than 40 characters render as text links.
- Desktop columns: up to 4 per row; rows of 3 unless the item count fills rows of 4.

## Supported variations

| Variation | Option class |
| --- | --- |
| Tiles | `tiles` (green filled tiles; a tile whose only link is its title is wrapped in that link) |

## Universal Editor fields

N/A (Document Authoring project)
