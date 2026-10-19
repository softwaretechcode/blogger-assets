import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.resolve(process.argv[2] ?? path.join(repositoryRoot, "..", "blog.softwaretechit.xml"));
const cdnBase = "https://cdn.jsdelivr.net/gh/softwaretechcode/blogger-assets@main";
const templateInfo = await stat(templatePath);
if (templateInfo.size === 0) {
  throw new Error(`The Blogger template is empty; refusing to modify it: ${templatePath}`);
}
let template = await readFile(templatePath, "utf8");
const generatedAssets = new Map();

function fail(message) {
  throw new Error(message);
}

async function externalizeScript(marker, assetPath, { after } = {}) {
  const markerIndex = template.indexOf(marker, after ?? 0);
  if (markerIndex < 0) fail(`Could not find script marker: ${marker}`);

  const start = template.lastIndexOf("<script", markerIndex);
  const end = template.indexOf("</script>", markerIndex);
  if (start < 0 || end < 0) fail(`Could not find a complete script for: ${marker}`);

  const script = template.slice(start, end + "</script>".length);
  const bodyStart = script.indexOf(">");
  const body = script.slice(bodyStart + 1, script.lastIndexOf("</script>"))
    .replace(/^\s*\/\/<!\[CDATA\[\s*/, "")
    .replace(/\s*\/\/\]\]>\s*$/, "")
    .trim();
  if (!body) fail(`The script for ${marker} is empty`);

  generatedAssets.set(assetPath, `${body}\n`);
  template = template.slice(0, start)
    + `<script src='${cdnBase}/${assetPath.replaceAll("\\", "/")}'/>`
    + template.slice(end + "</script>".length);
  return markerIndex;
}

function decodeCssEntities(css) {
  return css.replace(/&quot;|&#39;|&apos;|&amp;|&lt;|&gt;/g, entity => ({
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">"
  })[entity]);
}

const skinMatch = template.match(/<b:skin\b[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/b:skin>/);
if (!skinMatch) fail("Could not find the Blogger skin CDATA block");

const skin = skinMatch[1];
const cssStart = skin.indexOf("a,abbr,acronym,address,applet");
if (cssStart < 0) fail("Could not find the start of the Blogger skin CSS");

let themeCss = decodeCssEntities(skin.slice(cssStart).trim());
const bloggerVariables = [...new Set(themeCss.match(/\$\(([^)]+)\)/g) ?? [])]
  .map(reference => reference.slice(2, -1));
const cssVariableName = name => `--blogger-${name.replaceAll(".", "-")}`;
themeCss = themeCss.replace(/\$\(([^)]+)\)/g, (_match, name) => `var(${cssVariableName(name)})`);

const themeHeader = `/*
  Blogger NewsPlus theme stylesheet
  Original theme: SoftwareTechIT
*/
`;

const relatedStyleMarker = "/* Multi Related Post */";
const relatedStyleMarkerIndex = template.indexOf(relatedStyleMarker);
if (relatedStyleMarkerIndex < 0) fail("Could not find the related-post stylesheet");
const relatedStyleStart = template.lastIndexOf("<style", relatedStyleMarkerIndex);
const relatedStyleOpenEnd = template.indexOf(">", relatedStyleStart);
const relatedStyleEnd = template.indexOf("</style>", relatedStyleMarkerIndex);
if (relatedStyleStart < 0 || relatedStyleOpenEnd < 0 || relatedStyleEnd < 0) {
  fail("Could not find the complete related-post stylesheet");
}
themeCss += `\n\n${decodeCssEntities(template.slice(relatedStyleOpenEnd + 1, relatedStyleEnd).trim())}\n`;

const relatedConditionStart = template.lastIndexOf("<b:if", relatedStyleStart);
const relatedConditionEnd = template.indexOf("</b:if>", relatedStyleEnd);
if (relatedConditionStart < 0 || relatedConditionEnd < 0) {
  fail("Could not find the conditional around the related-post stylesheet");
}
template = template.slice(0, relatedConditionStart) + template.slice(relatedConditionEnd + "</b:if>".length);

const variableDeclarations = bloggerVariables
  .map(name => `  ${cssVariableName(name)}: $(${name});`)
  .join("\n");
const bloggerSkin = `${skin.slice(0, cssStart).trimEnd()}\n\n:root {\n${variableDeclarations}\n}\n`;
template = template.replace(skinMatch[0], skinMatch[0].replace(skin, bloggerSkin));
generatedAssets.set("css/theme.css", `${themeHeader}${themeCss}`);

const bootstrapCss = /[ \t]*<link\b[^>]*href=['"][^'"]*bootstrap@[^'"]*bootstrap(?:\.min)?\.css[^'"]*['"][^>]*\/?>[ \t]*\r?\n?/i;
if (!bootstrapCss.test(template)) fail("Could not find the Bootstrap CSS link");
template = template.replace(bootstrapCss, "");
template = template.replace(
  /[ \t]*<link\b[^>]*href=['"][^'"]*bootstrap-icons[^'"]*['"][^>]*\/?>[ \t]*\r?\n?/i,
  ""
);
template = template.replace(
  /[ \t]*<script\b[^>]*src=['"][^'"]*bootstrap@[^'"]*bootstrap(?:\.bundle)?\.min\.js[^'"]*['"][^>]*\/>[ \t]*\r?\n?/i,
  ""
);
template = template.replace('class="bi bi-paypal"', 'class="fa fa-paypal"');

const headClose = template.indexOf("</head>");
if (headClose < 0) fail("Could not find the template head");
template = template.slice(0, headClose)
  + `    <link href='${cdnBase}/css/theme.css' rel='stylesheet'/>\n`
  + `    <link href='${cdnBase}/css/tailwind.css' rel='stylesheet'/>\n  `
  + template.slice(headClose);

const theiaStart = template.indexOf("<!-- Main Scripts -->");
if (theiaStart < 0) fail("Could not find the main scripts section");
await externalizeScript("/*! Theia Sticky Sidebar", "js/theia-sticky-sidebar.js", { after: theiaStart });

const themeStart = template.indexOf("<!-- Theme Functions JS -->");
if (themeStart < 0) fail("Could not find the theme script section");
await externalizeScript("$(function () {", "js/theme.js", { after: themeStart });
const paginationStart = template.indexOf("<!-- Pagination Scripts -->", themeStart);
if (paginationStart < 0) fail("Could not find the pagination script section");
await externalizeScript("var postResults=postPerPage;", "js/pagination.js", { after: paginationStart });

await externalizeScript("// Multi Related Post", "js/related-posts.js");
await externalizeScript("(function gourabdesignmultiRelated()", "js/related-posts-render.js");
await externalizeScript("https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0", "js/facebook-sdk.js");

const templateTempPath = `${templatePath}.${process.pid}.tmp`;
await writeFile(templateTempPath, template);
try {
  for (const [assetPath, content] of generatedAssets) {
    const assetFile = path.join(repositoryRoot, assetPath);
    await mkdir(path.dirname(assetFile), { recursive: true });
    await writeFile(assetFile, content);
  }
  await rename(templateTempPath, templatePath);
} catch (error) {
  throw new Error(`Could not finish syncing Blogger assets for ${templatePath}`, { cause: error });
}
console.log(`Updated Blogger template and generated theme assets from ${templatePath}`);
