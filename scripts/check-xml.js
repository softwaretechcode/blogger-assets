const fs = require('fs');
const xml = fs.readFileSync('d:/blogger-backup/blogger-assets/blog.softwaretechit.xml', 'utf8');

const cleanXml = xml
  .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
  .replace(/<!--[\s\S]*?-->/g, '');

const tagRegex = /<(\/)?([a-zA-Z0-9:\-_]+)([^>]*?)(\/)?>/g;
const stack = [];
let match;
let errors = 0;

while ((match = tagRegex.exec(cleanXml)) !== null) {
  const isClosing = match[1] === '/';
  const tagName = match[2];
  const attrs = match[3];
  const isSelfClosing = match[4] === '/' || attrs.trim().endsWith('/');

  if (tagName.startsWith('!') || tagName.startsWith('?')) {
    continue;
  }

  if (isSelfClosing) {
    continue;
  }

  // HTML void tags that might be unclosed
  if (['meta', 'link', 'img', 'br', 'hr', 'input'].includes(tagName.toLowerCase())) {
    continue;
  }

  if (isClosing) {
    if (stack.length === 0) {
      console.log(`Error: Unexpected closing tag </${tagName}> at offset ${match.index}`);
      errors++;
      break;
    }
    const last = stack.pop();
    if (last.tagName !== tagName) {
      console.log(`Error: Tag mismatch! Expected </${last.tagName}> (opened at offset ${last.index}) but got </${tagName}> at offset ${match.index}`);
      // Find line number
      const lineNum = cleanXml.substring(0, match.index).split('\n').length;
      console.log(`Around line: ${lineNum}`);
      errors++;
      break;
    }
  } else {
    stack.push({ tagName, index: match.index });
  }
}

if (errors === 0 && stack.length === 0) {
  console.log('SUCCESS: All XML tags are perfectly balanced and matched!');
} else if (errors === 0) {
  console.log(`Error: ${stack.length} unclosed tags remain:`, stack.map(s => s.tagName).join(', '));
}
