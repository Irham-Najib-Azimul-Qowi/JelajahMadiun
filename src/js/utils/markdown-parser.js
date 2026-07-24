/**
 * Robust Client-side YAML Front Matter & Markdown Parser for JelajahMadiun
 */

export function parseMarkdownWithFrontMatter(rawText) {
  if (!rawText) return { metadata: {}, body: '', htmlContent: '' };

  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = rawText.match(frontMatterRegex);

  let metadata = {};
  let body = rawText;

  if (match) {
    const rawYaml = match[1];
    body = rawText.slice(match[0].length).trim();
    metadata = parseYamlRecursive(rawYaml);
  }

  const htmlContent = convertMarkdownToHtml(body);
  return { metadata, body, htmlContent };
}

function parseYamlRecursive(rawYaml) {
  const data = {};
  const lines = rawYaml.split('\n');

  let stack = [{ indent: -1, obj: data, key: null }];

  for (let rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Handle array item
    if (trimmed.startsWith('- ')) {
      const val = cleanValue(trimmed.slice(2));
      const current = stack[stack.length - 1];

      if (current.key) {
        if (!Array.isArray(current.obj[current.key])) {
          current.obj[current.key] = [];
        }
        current.obj[current.key].push(val);
      }
      continue;
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const valStr = trimmed.slice(colonIdx + 1).trim();

    // Pop stack to match current indentation level
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parentObj = stack[stack.length - 1].obj;

    if (valStr === '') {
      // It's a parent object or array
      parentObj[key] = {};
      stack.push({ indent: indent, obj: parentObj[key], key: key });
    } else {
      // It's a primitive key-value pair
      parentObj[key] = cleanValue(valStr);
      stack.push({ indent: indent, obj: parentObj, key: key });
    }
  }

  return data;
}

function cleanValue(val) {
  val = val.trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (!isNaN(val) && val !== '') return Number(val);
  return val;
}

function convertMarkdownToHtml(md) {
  if (!md) return '';

  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^---$/gim, '<hr>')
    .replace(/\*\*(.* animate?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/g, '</p><p>');

  return `<p>${html}</p>`;
}
