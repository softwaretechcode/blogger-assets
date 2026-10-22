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

All files are served from an immutable commit ref:

```
https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@8771498/...
```

The theme version is always **1.0.0**: every asset URL ends in `?v=1.0.0`. The
`@8771498` part is only the build pointer, not a version number.

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
