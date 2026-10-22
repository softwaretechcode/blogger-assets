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
| `js/pagination.js` | Numbered pager |
| `js/theia-sticky-sidebar.js` | Sticky sidebar |
| `js/related-posts.js` / `js/related-posts-render.js` | In-post "also read" links |
| `js/facebook-sdk.js`, `js/analytics.js`, `js/onesignal-init.js` | Optional integrations |

Load order matters: jQuery -> globals.js -> theia-sticky-sidebar -> theme.js -> pagination.js.

## CDN

All files are served from
`https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/...`.

Current asset build: **1.0.3** (the XML requests `?v=1.0.3`). Bump the `?v=`
query string in the XML after editing an asset so browser caches are refreshed.

jsDelivr also caches the `@main` branch for up to 12 hours. After pushing an
asset, purge it before uploading the new XML, otherwise the CDN can keep
serving the previous file at the new `?v=` URL:

```
https://purge.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/<file>
```

Do not remove or rename an asset while the Blogger XML references it.
