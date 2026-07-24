/**
 * Markdown & YAML Front Matter Client Parser for JelajahMadiun
 * Securely parses frontmatter metadata and converts Markdown to safe HTML.
 */

export function parseMarkdownWithFrontMatter(rawText) {
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = rawText.match(frontMatterRegex);

  let metadata = {};
  let body = rawText;

  if (match) {
    const rawYaml = match[1];
    body = rawText.slice(match[0].length).trim();
    metadata = parseYamlPrimitive(rawYaml);
  }

  const htmlContent = convertMarkdownToHtml(body);
  return { metadata, body, htmlContent };
}

// Primitive YAML Parser for structured frontmatter
function parseYamlPrimitive(rawYaml) {
  const data = {};
  const lines = rawYaml.split('\n');

  let currentParent = null;
  let currentArrayKey = null;

  for (let rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);

    if (indent === 0) {
      if (line.trim().startsWith('- ')) {
        continue;
      }
      const parts = line.split(':');
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();

      if (val === '') {
        data[key] = {};
        currentParent = data[key];
        currentArrayKey = key;
      } else {
        data[key] = cleanValue(val);
        currentParent = null;
        currentArrayKey = null;
      }
    } else if (indent > 0 && currentParent) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const itemVal = cleanValue(trimmed.slice(2));
        if (!Array.isArray(data[currentArrayKey])) {
          data[currentArrayKey] = [];
        }
        data[currentArrayKey].push(itemVal);
      } else {
        const parts = trimmed.split(':');
        if (parts.length >= 2) {
          const subKey = parts[0].trim();
          const subVal = parts.slice(1).join(':').trim();
          currentParent[subKey] = cleanValue(subVal);
        }
      }
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
  return val;
}

// Secure HTML Markdown Renderer
function convertMarkdownToHtml(md) {
  if (!md) return '';

  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\---$/gim, '<hr>')
    .replace(/\*\*(.* animate?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/g, '</p><p>');

  return `<p>${html}</p>`;
}
