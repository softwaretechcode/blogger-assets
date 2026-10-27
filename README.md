# SoftTwinPlus 1.0 - Blogger assets

CSS and JavaScript assets referenced by the SoftTwinPlus Blogger template
(SoftwareTechIT). The template itself is `blog.softwaretechit.xml` in this folder.

## CSS (6 files)

| File | Purpose |
| --- | --- |
| `css/tailwind.css` | Compiled TailwindCSS utility layer |
| `css/theme.css` | Design tokens (`--ui-*`), reset, base typography, accessibility helpers |
| `css/layout.css` | Page structure: outer shell, content grid, sidebar column, header shell (logo + ad) |
| `css/style-ui.css` | UI components: top bar, desktop menu + mega menu, search, mobile header/drawer, index cards, hot posts, featured blocks, sidebar widgets, single post, comments, pager, footer |
| `css/responsive.css` | Breakpoints, reduced motion, print. **Must load last** |
| `css/editor.css` | Blogger layout-editor mode only, loaded through `<b:template-skin>` (never on the public site) |

Load order is not optional:

```
tailwind.css -> theme.css -> layout.css -> style-ui.css -> responsive.css
```

`responsive.css` overrides rules of equal specificity in the other files, so
reordering it silently breaks the mobile layout.

Theme-designer colours (`<Variable>` tags) live in the `<b:skin>` block of the
XML. They are exposed as `--skin-*` custom properties and consumed by
`theme.css` through fallbacks, so the XML can be restyled from
Blogger -> Theme -> Customise without touching CSS.

## JavaScript

| File | Purpose |
| --- | --- |
| `js/globals.js` | Shared helpers (`monthFormat`, `noThumbnail`). Blog options come from the Layout "Default Variables" widget |
| `js/theme.js` | Menu, dropdowns, mobile drawer, hot/featured feed widgets, comments |
| `js/post-tools.js` | Post content: table of contents, code blocks, reading time, lightbox, anchors, progress bar |
| `js/pagination.js` | Numbered pager |
| `js/theia-sticky-sidebar.js` | Sticky sidebar |
| `js/related-posts.js` / `js/related-posts-render.js` | In-post "also read" links |
| Google Analytics 4 and Facebook comments | GA4 is initialized inline in the template; the Facebook SDK loads only when Facebook comments are selected |

Load order matters: jQuery 3.7.1 -> globals.js -> theia-sticky-sidebar -> theme.js -> pagination.js.
The jQuery/theme scripts are loaded with `defer` from the document head, so
their downloads can overlap HTML parsing while execution remains ordered.
Pagination inserts its JSONP feed script dynamically; it does not use
`document.write`, which is unsafe after deferred execution.

Feed widgets use Blogger's summary feeds rather than full post-body feeds,
load menu feeds on hover/focus, and load sidebar/footer feeds near the viewport.
Summary feeds contain the titles, summaries and thumbnails needed by the cards
without downloading full post bodies. They load through jQuery JSONP. The feed
URL is same-origin, and jQuery only uses its script transport for cross-domain
requests, so every JSONP call must pass `crossDomain: true`. Without it jQuery
falls back to XHR, receives JSONP, fails to parse it, and the widget keeps its
raw `count/label/type` text.

On the live Java label feed, nine summary entries transferred about 4.4 KB
compressed versus 77.6 KB for the full-content feed (about 94% less).

The first index-card image is eager and high-priority; following thumbnails are
lazy-loaded. OneSignal is queued at page load but its SDK is fetched only after
the visitor interacts with the page.

Header logos are served at reduced dimensions, and the large static banner is
limited to 800px with explicit dimensions and lazy loading. Image filename
extensions are not a reliable format indicator: a Blogger URL ending in `.webp`
was observed serving `image/gif`. Do not rewrite all image URLs to WebP until a
configured image CDN transform has been verified to return successfully; the
site's Cloudflare transform endpoint currently returns 403.

## Feed widget layouts

Any HTML widget inside a `.featured-posts` or `.common-widget` section that
contains only `count/label/type` is replaced by a feed grid. `label` can be any
Blogger label, `random`, or `recent`.

| Type | Shape |
| --- | --- |
| `grid-small` | 3 columns, thumbnail on top, title + description below |
| `grid-left-small` | 3 columns, thumbnail left, title + description right |
| `grid-text` | 3 columns, title + description, no thumbnail |
| `grid-big` | 2 columns, large thumbnail on top, title + description |
| `grid-overlay` | 3 image tiles, title over the image |
| `grid-tile` | 4 compact tiles, thumbnail + title only |
| `grid-list` | one column, thumbnail left, title + date + description |
| `post-txt-list` | one column, numbered, title + description, no thumbnail |
| `post-list` | compact sidebar list (used by Random Posts) |
| `feat-list` | stacked rows, image left |
| `feat-big` | first post full width, the rest in small cards |
| `col-left` / `col-right` | half-width column feed (Python/Java) |
| `hot-posts` | 4-tile hot section |
| `mega-menu` | dropdown feed |
| `related` | in-post related posts |

Example: `<b:widget-setting name='content'>9/mcq/grid-left-small</b:widget-setting>`.
Every layout is responsive: 3 columns -> 2 at 1100px -> 1 at 720px (4-tile grids
step down through 3 and 2).

## Homepage "Recent posts"

The homepage grid (`.blog-posts.index-post-wrap` under the "Recent posts"
headline) is a 3-column grid, so a full block is 3 x 3 = 9 cards.

Blogger renders that grid from `data:posts` and applies *auto pagination* to
index pages: when the rendered page grows too heavy it returns fewer posts than
"Max posts shown on main page", regardless of `?max-results`. On this blog the
homepage usually comes back with 3 posts, which left the grid one row tall.

`fillHomeIndex()` in `theme.js` tops the grid up:

1. It runs only when `.home-posts-headline` exists, i.e. on `data:view.isHomepage`.
2. If fewer than `HOME_INDEX_TARGET` (9) cards rendered, it fetches
   `/feeds/posts/summary?alt=json-in-script&max-results=12`.
3. Entries already on the page are skipped (scheme- and hash-insensitive URL
   compare, because the feed links `http://`).
4. The rest are sorted by *published* date (feeds are ordered by *updated*) and
   only the missing cards are appended, in the same markup as `indexPost`.
5. The "Older Posts" link is moved to `updated-max` of the 9th post and
   `max-results=9`, so page 2 continues after the last visible card instead of
   repeating it.

The fill is a workaround, not a replacement for the setting: set
Blogger -> Settings -> Posts -> "Max posts shown on main page" to **9** as well.
If Blogger ever serves 9 posts by itself, the fill does nothing.

## Post content tools

`js/post-tools.js` runs on post and page views only and adds:

| Feature | Details |
| --- | --- |
| Table of contents | Built from `h2`-`h4`, numbered (1, 1.1, 2...), collapsible, active-section highlight. Appears from 3 headings, placed after the intro paragraph |
| Heading anchors | Every heading gets a stable `id` plus a `#` permalink |
| Code blocks | Language label, copy button, horizontal scroll, Prism syntax highlighting when a language is known |
| Reading time | `x min read` appended to the post byline |
| Image lightbox | Click a post image to zoom; linked images open the lightbox when the link points to an image |
| Tables | Wrapped in a scrollable container on narrow screens |
| External links | Open in a new tab with `rel="noopener noreferrer"` |
| Reading progress | Thin gradient bar at the top of the viewport |

Language detection accepts `class="language-java"`, `class="lang-java"`,
`class="brush: java"` or `data-lang="java"` on the `<pre>` or its `<code>`.
Syntax highlighting is Prism from jsDelivr and only loads when a code block has
a language, so posts without code pay nothing.

Opt-outs, per element inside the post body:

```html
<span class="no-post-tools"></span>  <!-- disable everything for this post -->
<div class="no-toc"></div>           <!-- skip a section in the TOC -->
<pre class="no-code-tools">...</pre> <!-- leave this block alone -->
<img class="no-lightbox">            <!-- no zoom -->
```

Defaults can be changed before the script tag loads:

```html
<script>
window.softtwinPostTools = { tocTitle: 'On this page', tocMinHeadings: 4, wordsPerMinute: 180, syntaxHighlight: false };
</script>
```

## CDN

All files are served from an immutable commit ref:

```
https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@4697f30/...
```

The theme version is always **1.0.0**: every asset URL ends in `?v=1.0.0`. The
`@4697f30` part is only the build pointer, not a version number.

Why a commit instead of a version tag: jsDelivr caches tag URLs permanently.
Moving `v1.0.0` to a new commit and purging the files still served the old
bytes, so a tag cannot be used to ship updates while the URL stays 1.0.0. A
commit ref is immutable *and* changes with every release, which also busts the
browser cache for free. Branch aliases like `@main` are cached for up to 12
hours and can flap between old and new files.

### Releasing a change

1. Edit files, commit and push `main`.
2. Point the XML at the new commit:
   ```
   git rev-parse --short HEAD
   ```
   Replace `blogger-assets@<old-sha>` with `blogger-assets@<new-sha>` in
   `blog.softwaretechit.xml`. Leave every `?v=1.0.0` untouched.
3. Verify the new bytes from `cdn.jsdelivr.net/...@<sha>/...` before uploading
   the XML.
4. Upload `blog.softwaretechit.xml` in Blogger.

No purge and no tag is needed.

Do not remove or rename an asset while the Blogger XML references it.
