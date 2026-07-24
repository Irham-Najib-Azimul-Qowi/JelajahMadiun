/**
 * Content Service for JelajahMadiun
 * Manages fetching, parsing, caching, live searching, and category filtering across all 34 destinations.
 */

import { parseMarkdownWithFrontMatter } from '../utils/markdown-parser.js';

// Manifest listing all 34 destination markdown files
const DESTINATION_MANIFEST = [
  // Wisata Buatan (7)
  '/content/wisata/wisata-buatan/pahlawan-street-center.md',
  '/content/wisata/wisata-buatan/pahlawan-religi-centre.md',
  '/content/wisata/wisata-buatan/taman-lalu-lintas-bantaran.md',
  '/content/wisata/wisata-buatan/taman-hijau-demangan.md',
  '/content/wisata/wisata-buatan/ngrowo-bening.md',
  '/content/wisata/wisata-buatan/taman-bantaran-kali-madiun.md',
  '/content/wisata/wisata-buatan/taman-hutan-kita.md',

  // Wisata Sejarah (6)
  '/content/wisata/wisata-sejarah/sendang-gayam.md',
  '/content/wisata/wisata-sejarah/bosbow-eks-osvia-madioen.md',
  '/content/wisata/wisata-sejarah/makam-kuno-taman-kota-madiun.md',
  '/content/wisata/wisata-sejarah/monumen-tentara-genie-pelajar.md',
  '/content/wisata/wisata-sejarah/walk-heritage-pangongangan.md',
  '/content/wisata/wisata-sejarah/gedung-bakorwil-ii.md',

  // Wisata Religi (7)
  '/content/wisata/wisata-religi/masjid-besar-kuno-taman.md',
  '/content/wisata/wisata-religi/masjid-kuno-kuncen.md',
  '/content/wisata/wisata-religi/makam-ki-ageng-ronggo-jumeno.md',
  '/content/wisata/wisata-religi/gereja-santo-cornelius-madiun.md',
  '/content/wisata/wisata-religi/masjid-besar-madiun.md',
  '/content/wisata/wisata-religi/masjid-agung-baitul-hakim.md',
  '/content/wisata/wisata-religi/klenteng-hwie-ing-kiong.md',

  // Wisata Kuliner (14)
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

// Rich high-quality Unsplash image mapping per destination slug
const DESTINATION_IMAGE_MAP = {
  'pahlawan-street-center': 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&auto=format&fit=crop',
  'pahlawan-religi-centre': 'https://images.unsplash.com/photo-1548625361-1858e9b6a226?w=800&auto=format&fit=crop',
  'taman-lalu-lintas-bantaran': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
  'taman-hijau-demangan': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
  'ngrowo-bening': 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&auto=format&fit=crop',
  'taman-bantaran-kali-madiun': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop',
  'taman-hutan-kita': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop',
  'sendang-gayam': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
  'bosbow-eks-osvia-madioen': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop',
  'makam-kuno-taman-kota-madiun': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
  'monumen-tentara-genie-pelajar': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop',
  'walk-heritage-pangongangan': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop',
  'gedung-bakorwil-ii': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
  'masjid-besar-kuno-taman': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop',
  'masjid-kuno-kuncen': 'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?w=800&auto=format&fit=crop',
  'makam-ki-ageng-ronggo-jumeno': 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop',
  'gereja-santo-cornelius-madiun': 'https://images.unsplash.com/photo-1548625361-1858e9b6a226?w=800&auto=format&fit=crop',
  'masjid-besar-madiun': 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop',
  'masjid-agung-baitul-hakim': 'https://images.unsplash.com/photo-1548625361-1858e9b6a226?w=800&auto=format&fit=crop',
  'klenteng-hwie-ing-kiong': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop',
  'depot-nasi-pecel-99': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
  'ayam-goreng-pak-to': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop',
  'nasi-pecel-pojok': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
  'warung-nasi-pecel-yu-gembrot': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
  'ayam-goreng-pemuda': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop',
  'dawet-suronatan': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop',
  'gado-gado-pak-tomo': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
  'depot-es-segar': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
  'pentol-corah': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
  'es-puter-rimba-karya': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop',
  'tepo-tahu-pak-marian': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
  'bluder-cokro': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
  'bluder-kresna': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
  'toko-mirasa': 'https://images.unsplash.com/photo-1581781870027-04212e231e96?w=800&auto=format&fit=crop'
};

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
        if (contentType.includes('text/html')) {
          continue;
        }

        const text = await res.text();
        const parsed = parseMarkdownWithFrontMatter(text);
        if (parsed.metadata) {
          const item = {
            filePath: path,
            ...parsed.metadata,
            htmlContent: parsed.htmlContent,
            body: parsed.body
          };

          item.resolvedTitle = getItemTitle(item);
          item.resolvedDescription = getItemDescription(item);
          item.resolvedImage = getItemImage(item);

          results.push(item);
        }
      }
    } catch (err) {
      console.warn(`[ContentService] Could not fetch ${path}:`, err);
    }
  }

  cachedDestinations = results;
  return results;
}

export function getItemTitle(item, lang = 'id') {
  if (!item) return '';
  if (typeof item.title === 'object') {
    return (lang === 'en' && item.title.en) ? item.title.en : (item.title.id || item.slug || '');
  }
  return item.title || item.slug || '';
}

export function getItemDescription(item, lang = 'id') {
  if (!item) return '';

  // Try SEO description first
  if (item.seo && typeof item.seo === 'object') {
    if (typeof item.seo.description === 'object') {
      const val = (lang === 'en' && item.seo.description.en) ? item.seo.description.en : item.seo.description.id;
      if (val) return val;
    } else if (typeof item.seo.description === 'string' && item.seo.description) {
      return item.seo.description;
    }
  }

  // Try direct description
  if (typeof item.description === 'object') {
    return (lang === 'en' && item.description.en) ? item.description.en : (item.description.id || '');
  } else if (typeof item.description === 'string') {
    return item.description;
  }

  return '';
}

export function getItemImage(item) {
  if (!item) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop';

  const slug = item.slug || item.id;
  if (slug && DESTINATION_IMAGE_MAP[slug]) {
    return DESTINATION_IMAGE_MAP[slug];
  }

  if (item.hero_image && item.hero_image.startsWith('http')) {
    return item.hero_image;
  }

  return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop';
}

export async function getDestinationBySlug(slug) {
  const all = await getAllDestinations();
  return all.find(item => item.slug === slug || item.id === slug);
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
    const title = (item.resolvedTitle || '').toLowerCase();
    const desc = (item.resolvedDescription || '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });
}
