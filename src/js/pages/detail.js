/**
 * Detail Wisata — Dynamic renderer & SEO updater
 */
import { getDestinationBySlug, getItemTitle, getItemDescription, getItemImage } from '../services/content-service.js';
import { updateMetaSEO } from '../utils/seo.js';

const CAT_LABEL = {
  'wisata-buatan':  'Wisata Buatan',
  'wisata-sejarah': 'Wisata Sejarah',
  'wisata-religi':  'Wisata Religi',
  'kuliner':        'Kuliner Khas'
};

document.addEventListener('DOMContentLoaded', async () => {
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) { window.location.href = '/src/pages/wisata.html'; return; }

  try {
    const data = await getDestinationBySlug(slug);
    if (!data) { console.warn('[detail.js] Not found:', slug); return; }
    render(data);
  } catch (e) {
    console.error('[detail.js]', e);
  }
});

function render(data) {
  const lang  = localStorage.getItem('site_lang') || 'id';
  const title = getItemTitle(data, lang);
  const desc  = getItemDescription(data, lang);
  const img   = getItemImage(data);
  const cat   = CAT_LABEL[data.category] || 'Destinasi';
  const addr  = (typeof data.location === 'object' && data.location?.address) ? data.location.address : 'Kota Madiun, Jawa Timur';
  const hours = data.opening_hours || '08.00 – 17.00';
  const ticket= data.ticket || 'Gratis';
  const mapsUrl = data.google_maps ||
    `https://maps.google.com/?q=${(typeof data.location === 'object' ? data.location?.latitude : -7.6298) || -7.6298},${(typeof data.location === 'object' ? data.location?.longitude : 111.5239) || 111.5239}`;

  // Cover
  const coverEl = document.getElementById('dest-cover-img');
  if (coverEl) { coverEl.src = img; coverEl.alt = title; }

  // Breadcrumb
  const bc = document.getElementById('breadcrumb-current');
  if (bc) bc.textContent = title;

  // Badge
  const badge = document.getElementById('dest-category-badge');
  if (badge) badge.textContent = cat;

  // Title
  const titleEl = document.getElementById('dest-title');
  if (titleEl) titleEl.textContent = title;

  // Address
  const addrEl = document.getElementById('dest-address');
  if (addrEl) addrEl.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--primary);flex-shrink:0;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
    ${addr}`;

  // Description
  const descEl = document.getElementById('dest-description-content');
  if (descEl) descEl.innerHTML = data.htmlContent || `<p>${desc}</p>`;

  // Hours / Ticket
  const hoursEl  = document.getElementById('dest-hours');
  const ticketEl = document.getElementById('dest-ticket');
  if (hoursEl)  hoursEl.textContent  = hours;
  if (ticketEl) ticketEl.textContent = ticket;

  // Maps button
  const mapsBtn = document.getElementById('dest-maps-btn');
  if (mapsBtn) mapsBtn.href = mapsUrl;

  // Facilities
  const facContainer = document.getElementById('dest-facilities-container');
  if (facContainer) {
    if (Array.isArray(data.facilities) && data.facilities.length) {
      facContainer.innerHTML = data.facilities.map(f =>
        `<span class="facility-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ${f}
        </span>`
      ).join('');
    } else {
      document.getElementById('facilities-section').style.display = 'none';
    }
  }

  // Gallery
  const galleryEl = document.getElementById('dest-gallery-container');
  if (galleryEl) {
    const imgs = Array.isArray(data.gallery) && data.gallery.length ? data.gallery : [img];
    galleryEl.innerHTML = imgs.map(src =>
      `<div style="border-radius:var(--r-md);overflow:hidden;aspect-ratio:4/3;">
        <img src="${src.startsWith('/') || src.startsWith('http') ? src : img}"
             alt="${title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">
      </div>`
    ).join('');
  }

  // SEO
  updateMetaSEO({
    title, description: desc,
    keywords: data.seo?.keywords || ['wisata madiun', title],
    image: img,
    canonicalUrl: `https://jelajahmadiun.pages.dev/src/pages/detail-wisata.html?slug=${data.slug}`,
    schemaType: data.category === 'kuliner' ? 'LocalBusiness' : 'TouristAttraction'
  });

  if (window.lucide) window.lucide.createIcons();
}
