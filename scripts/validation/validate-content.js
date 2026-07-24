/**
 * Content Validation Script for JelajahMadiun
 * Validates YAML Front Matter and file structure according to Step 4 Content Architecture rules.
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', '..', 'content');

let errors = [];
let warnings = [];

// Simple YAML frontmatter parser
function parseFrontMatter(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = fileContent.match(frontMatterRegex);

  if (!match) {
    return { frontMatter: null, body: fileContent };
  }

  const rawYaml = match[1];
  const body = fileContent.slice(match[0].length).trim();
  const data = {};

  // Primitive YAML parser for our structured schema
  let currentKey = null;
  let currentParent = null;

  const lines = rawYaml.split('\n');
  for (let rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);

    if (indent === 0) {
      const parts = line.split(':');
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();

      if (val === '') {
        data[key] = {};
        currentParent = data[key];
        currentKey = key;
      } else {
        data[key] = cleanValue(val);
        currentParent = null;
        currentKey = null;
      }
    } else if (indent > 0 && currentParent) {
      const parts = line.trim().split(':');
      if (parts.length >= 2) {
        const subKey = parts[0].trim();
        const subVal = parts.slice(1).join(':').trim();
        currentParent[subKey] = cleanValue(subVal);
      }
    }
  }

  return { frontMatter: data, rawYaml, body };
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

// Check kebab-case filename
function isKebabCase(filename) {
  const basename = path.basename(filename, path.extname(filename));
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(basename);
}

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

console.log('🔍 Starting Content Architecture Validation...\n');

// 1. Validate Wisata Files
const wisataDir = path.join(CONTENT_DIR, 'wisata');
const wisataFiles = getFilesRecursively(wisataDir);
const validCategories = ['wisata-alam', 'wisata-buatan', 'wisata-sejarah', 'wisata-religi', 'kuliner'];
const validStatuses = ['draft', 'published', 'archived'];

wisataFiles.forEach(file => {
  const relPath = path.relative(CONTENT_DIR, file);
  const basename = path.basename(file);

  if (!isKebabCase(file)) {
    errors.push(`[Filename] ${relPath}: Filename must be lowercase kebab-case (e.g. ngrowo-bening.md).`);
  }

  const { frontMatter } = parseFrontMatter(file);
  if (!frontMatter) {
    errors.push(`[FrontMatter] ${relPath}: Missing YAML Front Matter boundary (---).`);
    return;
  }

  // Mandatory fields check according to Section 4.13
  if (!frontMatter.slug || String(frontMatter.slug).trim() === '') {
    errors.push(`[Required Field] ${relPath}: 'slug' cannot be empty.`);
  }

  if (!frontMatter.hero_image || String(frontMatter.hero_image).trim() === '') {
    errors.push(`[Required Field] ${relPath}: 'hero_image' cannot be empty.`);
  }

  if (!frontMatter.title || !frontMatter.title.id || String(frontMatter.title.id).trim() === '') {
    errors.push(`[Required Field] ${relPath}: 'title.id' cannot be empty.`);
  }

  if (!frontMatter.title || !frontMatter.title.en || String(frontMatter.title.en).trim() === '') {
    errors.push(`[Required Field] ${relPath}: 'title.en' cannot be empty.`);
  }

  if (frontMatter.category && !validCategories.includes(frontMatter.category)) {
    errors.push(`[Validation] ${relPath}: Invalid category '${frontMatter.category}'. Allowed: ${validCategories.join(', ')}.`);
  }

  if (frontMatter.status && !validStatuses.includes(frontMatter.status)) {
    errors.push(`[Validation] ${relPath}: Invalid status '${frontMatter.status}'. Allowed: ${validStatuses.join(', ')}.`);
  }
});

// 2. Validate Kategori Files
const kategoriDir = path.join(CONTENT_DIR, 'kategori');
const kategoriFiles = getFilesRecursively(kategoriDir);

kategoriFiles.forEach(file => {
  const relPath = path.relative(CONTENT_DIR, file);
  if (!isKebabCase(file)) {
    errors.push(`[Filename] ${relPath}: Filename must be lowercase kebab-case.`);
  }

  const { frontMatter } = parseFrontMatter(file);
  if (!frontMatter) {
    errors.push(`[FrontMatter] ${relPath}: Missing YAML Front Matter boundary.`);
    return;
  }

  if (!frontMatter.id || String(frontMatter.id).trim() === '') {
    errors.push(`[Required Field] ${relPath}: 'id' cannot be empty.`);
  }

  if (!frontMatter.title || !frontMatter.title.id) {
    errors.push(`[Required Field] ${relPath}: 'title.id' cannot be empty.`);
  }

  if (!frontMatter.title || !frontMatter.title.en) {
    errors.push(`[Required Field] ${relPath}: 'title.en' cannot be empty.`);
  }
});

// 3. Validate Halaman Files
const halamanDir = path.join(CONTENT_DIR, 'halaman');
const halamanFiles = getFilesRecursively(halamanDir);

halamanFiles.forEach(file => {
  const relPath = path.relative(CONTENT_DIR, file);
  if (!isKebabCase(file)) {
    errors.push(`[Filename] ${relPath}: Filename must be lowercase kebab-case.`);
  }

  const { frontMatter } = parseFrontMatter(file);
  if (!frontMatter) {
    errors.push(`[FrontMatter] ${relPath}: Missing YAML Front Matter boundary.`);
    return;
  }

  if (!frontMatter.slug) {
    errors.push(`[Required Field] ${relPath}: 'slug' cannot be empty.`);
  }

  if (!frontMatter.title || !frontMatter.title.id || !frontMatter.title.en) {
    errors.push(`[Required Field] ${relPath}: 'title.id' and 'title.en' must be defined.`);
  }
});

// Summary & Exit code
console.log(`Validated Files Summary:`);
console.log(`- Wisata entries: ${wisataFiles.length}`);
console.log(`- Categories: ${kategoriFiles.length}`);
console.log(`- Pages: ${halamanFiles.length}\n`);

if (errors.length > 0) {
  console.error('❌ Content validation FAILED with errors:');
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log('✅ Content validation PASSED successfully!');
  process.exit(0);
}
