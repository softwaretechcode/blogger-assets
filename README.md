# Blogger assets

This repository hosts the CSS and JavaScript used by the SoftwareTechIT Blogger
template. The Blogger XML template stays outside this repository.

## Build Tailwind CSS

```sh
npm install
npm run build:css
```

The generated stylesheet uses Tailwind utilities without loading its
preflight/reset, so the Blogger theme's existing element styles are preserved.

## Sync the Blogger template

With the Blogger XML file beside this repository, run:

```sh
npm run sync:template -- ../blog.softwaretechit.xml
```

This extracts the Blogger skin and standalone template scripts into `css/` and
`js/`, preserves Blogger-editable color variables in the XML, and points the
template at the hosted assets. The sync command refuses empty templates and
validates the complete migration before replacing the XML. Commit the generated
CSS and JavaScript files alongside the XML changes; do not add the XML file to
this repository.