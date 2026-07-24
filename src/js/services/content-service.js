/**
 * Content Service for JelajahMadiun
 * Manages fetching, parsing, caching, live searching, and category filtering.
 */

import { parseMarkdownWithFrontMatter } from '../utils/markdown-parser.js';

// Manifest listing all destination markdown files
const DESTINATION_MANIFEST = [
  // Wisata Buatan
  '/content/wisata/wisata-buatan/pahlawan-street-center.md',
  '/content/wisata/wisata-buatan/pahlawan-religi-centre.md',
  '/content/wisata/wisata-buatan/taman-lalu-lintas-bantaran.md',
  '/content/wisata/wisata-buatan/taman-hijau-demangan.md',
  '/content/wisata/wisata-buatan/ngrowo-bening.md',
  '/content/wisata/wisata-buatan/taman-bantaran-kali-madiun.md',
  '/content/wisata/wisata-buatan/taman-hutan-kita.md',

  // Wisata Sejarah
  '/content/wisata/wisata-sejarah/sendang-gayam.md',
  '/content/wisata/wisata-sejarah/bosbow-eks-osvia-madioen.md',
  '/content/wisata/wisata-sejarah/makam-kuno-taman-kota-madiun.md',
  '/content/wisata/wisata-sejarah/monumen-tentara-genie-pelajar.md',
  '/content/wisata/wisata-sejarah/walk-heritage-pangongangan.md',
  '/content/wisata/wisata-sejarah/gedung-bakorwil-ii.md',

  // Wisata Religi
  '/content/wisata/wisata-religi/masjid-besar-kuno-taman.md',
  '/content/wisata/wisata-religi/masjid-kuno-kuncen.md',
  '/content/wisata/wisata-religi/makam-ki-ageng-ronggo-jumeno.md',
  '/content/wisata/wisata-religi/gereja-santo-cornelius-madiun.md',
  '/content/wisata/wisata-religi/masjid-besar-madiun.md',
  '/content/wisata/wisata-religi/klenteng-hwie-ing-kiong.md',

  // Wisata Kuliner
  '/content/wisata/kuliner/depot-nasi-pecel-99.md',
  '/content/wisata/kuliner/ayam-goreng-pak-to.md',
  '/content/wisata/kuliner/nasi-pecel-pojok.md',
  '/content/wisata/kuliner/warung-nasi-pecel-yu-gembrot.md',
  '/content/wisata/kuliner/ayam-goreng-pemuda.md',
  '/content/wisata/kuliner/dawet-suronatan.md',
  '/content/wisata/kuliner/gado-gado-pak-tomo.md',
  '/content/wisata/kuliner/depot-es-segar.md',
  '/content/wisata/kuliner/pentol-corah.md',
  '/content/wisata/kuliner/es-puter-rimba-karya.md',
  '/content/wisata/kuliner/tepo-tahu-pak-marian.md',
  '/content/wisata/kuliner/bluder-cokro.md',
  '/content/wisata/kuliner/bluder-kresna.md',
  '/content/wisata/kuliner/toko-mirasa.md'
];

let cachedDestinations = null;

export async function getAllDestinations() {
  if (cachedDestinations) {
    return cachedDestinations;
  }

  const results = [];
  for (const path of DESTINATION_MANIFEST) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        // Skip if returned SPA fallback HTML
        if (contentType.includes('text/html')) {
          console.warn(`[ContentService] File ${path} returned HTML fallback, skipping.`);
          continue;
        }

        const text = await res.text();
        const parsed = parseMarkdownWithFrontMatter(text);
        if (parsed.metadata && (parsed.metadata.slug || parsed.metadata.id)) {
          results.push({
            filePath: path,
            ...parsed.metadata,
            htmlContent: parsed.htmlContent,
            body: parsed.body
          });
        }
      }
    } catch (err) {
      console.warn(`[ContentService] Could not fetch ${path}:`, err);
    }
  }

  cachedDestinations = results;
  return results;
}

export async function getDestinationBySlug(slug) {
  const all = await getAllDestinations();
  return all.find(item => item.slug === slug || item.id === slug);
}

export async function getDestinationsByCategory(categorySlug) {
  const all = await getAllDestinations();
  if (!categorySlug || categorySlug === 'all') return all;
  return all.filter(item => item.category === categorySlug);
}

export async function searchDestinations(query, category = 'all') {
  const all = await getAllDestinations();
  let filtered = all;

  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }

  if (!query || query.trim() === '') {
    return filtered;
  }

  const q = query.toLowerCase().trim();
  return filtered.filter(item => {
    const titleId = (typeof item.title === 'object' ? item.title?.id : item.title || '').toLowerCase();
    const titleEn = (typeof item.title === 'object' ? item.title?.en : '').toLowerCase();
    const descId = (typeof item.seo?.description === 'object' ? item.seo?.description?.id : item.seo?.description || '').toLowerCase();

    return titleId.includes(q) || titleEn.includes(q) || descId.includes(q);
  });
}
