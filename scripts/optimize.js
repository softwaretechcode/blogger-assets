const fs = require('fs');
const path = require('path');

function cleanCss(css) {
  return css
    // preserve css custom properties with variables
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\r\n|\r|\n/g, ' ')       // replace newlines with spaces
    .replace(/\s+/g, ' ')             // collapse spaces
    .replace(/\s*([\{\}:;,>~+])\s*/g, '$1') // remove space around delimiters
    .replace(/;}/g, '}')              // remove trailing semicolon before closing brace
    .replace(/@media\s+/g, '@media ') // keep space in @media query
    .replace(/@supports\s+/g, '@supports ')
    .replace(/@layer\s+/g, '@layer ')
    .replace(/@keyframes\s+/g, '@keyframes ')
    .trim();
}

function cleanJs(js) {
  // Safe basic JS minifier (strip block comments, line comments safely, collapse whitespace)
  let out = '';
  let inString = null;
  let inRegex = false;
  let inBlockComment = false;
  let inLineComment = false;

  for (let i = 0; i < js.length; i++) {
    const c = js[i];
    const next = js[i + 1];

    if (inBlockComment) {
      if (c === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inLineComment) {
      if (c === '\n' || c === '\r') {
        inLineComment = false;
        out += '\n';
      }
      continue;
    }

    if (inString) {
      out += c;
      if (c === '\\') {
        out += next;
        i++;
      } else if (c === inString) {
        inString = null;
      }
      continue;
    }

    // Check for comment starts
    if (c === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (c === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }

    // Check for string starts
    if (c === '"' || c === "'" || c === '`') {
      inString = c;
      out += c;
      continue;
    }

    out += c;
  }

  // Safe whitespace collapsing
  return out
    .replace(/[ \t]+/g, ' ')
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

const baseDir = path.resolve(__dirname, '..');
const cssDir = path.join(baseDir, 'css');
const jsDir = path.join(baseDir, 'js');

console.log('Optimizing CSS files...');
const cssOrder = ['tailwind.css', 'theme.css', 'layout.css', 'style-ui.css', 'responsive.css'];
const allCss = [...cssOrder, 'editor.css'];
let combinedCss = '';

for (const file of allCss) {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const min = cleanCss(content);
    const minPath = path.join(cssDir, file.replace('.css', '.min.css'));
    fs.writeFileSync(minPath, min, 'utf8');
    console.log(`- ${file}: ${content.length} -> ${min.length} bytes (saved ${((1 - min.length / content.length) * 100).toFixed(1)}%)`);
    if (cssOrder.includes(file)) {
      combinedCss += min + '\n';
    }
  }
}

// Write combined bundle
const bundleCssPath = path.join(cssDir, 'bundle.min.css');
fs.writeFileSync(bundleCssPath, combinedCss.trim(), 'utf8');
console.log(`=> css/bundle.min.css: ${combinedCss.length} bytes\n`);

console.log('Optimizing JS files...');
const jsFiles = ['globals.js', 'theia-sticky-sidebar.js', 'theme.js', 'post-tools.js', 'pagination.js', 'related-posts.js', 'related-posts-render.js'];
let combinedJs = '';

for (const file of jsFiles) {
  const filePath = path.join(jsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const min = cleanJs(content);
    const minPath = path.join(jsDir, file.replace('.js', '.min.js'));
    fs.writeFileSync(minPath, min, 'utf8');
    console.log(`- ${file}: ${content.length} -> ${min.length} bytes (saved ${((1 - min.length / content.length) * 100).toFixed(1)}%)`);
    if (['globals.js', 'theia-sticky-sidebar.js', 'theme.js'].includes(file)) {
      combinedJs += min + ';\n';
    }
  }
}

const bundleJsPath = path.join(jsDir, 'theme.bundle.min.js');
fs.writeFileSync(bundleJsPath, combinedJs.trim(), 'utf8');
console.log(`=> js/theme.bundle.min.js: ${combinedJs.length} bytes\n`);
