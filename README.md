# SoftTwinPlus 1.0 - Blogger assets

This repository contains only the CSS and JavaScript assets referenced by the
SoftTwinPlus 1.0 Blogger template (SoftwareTechIT). The XML template is kept outside the
repository.

The Blogger template loads these assets from jsDelivr:

- `https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/tailwind.css`
- `https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/theme.css`
- `https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/custom.css`
- `https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/modern-ui.css`
- JavaScript files under `https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/js/`

`custom.css` contains the extracted shortcode and HTML-widget styles.
`js/globals.js` contains the template's static JavaScript settings; Blogger
widget settings that use dynamic Blogger data remain in the XML.
`modern-ui.css` applies the responsive surface, card, typography, and spacing
overrides after the original theme and Tailwind styles. It also carries the
SoftTwinPlus soft glass gradient design: pill-shaped tags and categories,
glass cards, gradient buttons, and gradient section headings.

Do not remove or rename an asset while the Blogger XML references it.
