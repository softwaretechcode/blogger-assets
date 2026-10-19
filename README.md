# Blogger assets

This repository hosts the CSS and JavaScript used by the SoftwareTechIT Blogger
template. The Blogger XML template stays outside this repository.

The template loads the files from this GitHub repository through jsDelivr:

```text
https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/tailwind.css
https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main/css/theme.css
```

Use the GitHub-backed CDN URLs for Blogger stylesheet links; they serve CSS
with a stylesheet-compatible content type.

## Build Tailwind CSS

```sh
npm install
npm run build:css
```

The generated stylesheet uses Tailwind utilities without loading its
preflight/reset, so the Blogger theme's existing element styles are preserved.

## Sync the Blogger template

Run once against the original, unmodified Blogger XML file beside this
repository:

```sh
npm run sync:template -- ../blog.softwaretechit.xml
```

This extracts the Blogger skin and standalone template scripts into `css/` and
`js/`, preserves Blogger-editable color variables in the XML, and points the
template at the hosted assets. The sync command refuses empty templates and
validates the complete migration before replacing the XML. Commit the generated
CSS and JavaScript files alongside the XML changes; do not add the XML file to
this repository. After the first sync, rebuild CSS with `npm run build:css`
instead of running the one-time XML sync again.