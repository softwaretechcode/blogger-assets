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

All files are served from an immutable git tag:

```
https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@v1.0.3/...
```

Current asset build: **v1.0.3**. The XML pins `@v1.0.3` everywhere (CSS, JS,
`editor.css`). Branch aliases like `@main` are cached by jsDelivr for up to 12
hours and can serve a stale file even after a purge, which is what previously
hid feed widgets; a tag URL can never change its contents.

### Releasing a change

1. Edit files, then bump the version: `v1.0.4` (README + XML `@v1.0.3` ->
   `@v1.0.4` and `?v=1.0.4`).
2. Commit and push the branch.
3. Tag and push the tag: `git tag v1.0.4 && git push origin v1.0.4`.
4. Upload `blog.softwaretechit.xml` in Blogger.

No CDN purge is needed for a new tag. Keep the `?v=` query string as a browser
cache-buster; jsDelivr ignores it, so the tag is what guarantees freshness.

Do not remove or rename an asset while the Blogger XML references it.
