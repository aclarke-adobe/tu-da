# cards-news

Custom **cards** block. Purpose: grid of news teasers with image, date, headline and excerpt linking to articles.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: image cell | body cell (date paragraph, headline with link, excerpt).

## Supported variations

- `related`: the related-news look from news articles. The excerpt fades out under a 100px white gradient at the bottom of the tile, the list always has 3 columns (desktop), and tiles are capped at 445px.
- `featured`: the featured-news look (homepage, partners, kidsafe). The excerpt is shown in full, with one column per tile for 2, 3 or 4 tiles.

Without a variant, blocks on `/news/…` and `/archive/…` pages get `related` and all others get `featured`.

A plain-text h2 or h3 that ends the default content right above the block is styled as the list heading (24px/36px, 25px above the tiles).

## Universal Editor fields

N/A (Document Authoring project)
