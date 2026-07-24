/**
 * Detail Wisata Dynamic View Renderer & SEO Controller
 */

import { getDestinationBySlug, getItemTitle, getItemDescription, getItemImage } from '../services/content-service.js';
import { updateMetaSEO } from '../utils/seo.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    window.location.href = '/src/pages/wisata.html';
    return;
  }

  try {
    const data = await getDestinationBySlug(slug);
    if (!data) {
      console.warn(`[DetailJS] Destination '${slug}' not found.`);
      return;
    }

    renderDetailView(data);
  } catch (err) {
    console.error(`[DetailJS] Error rendering detail for '${slug}':`, err);
  }
});

function renderDetailView(data) {
  const currentLang = localStorage.getItem('site_lang') || 'id';

  const title = getItemTitle(data, currentLang);
  const categoryName = getCategoryLabel(data.category);
  const address = data.location?.address || 'Kota Madiun, Jawa Timur';
  const coverImage = getItemImage(data);
  const hours = data.opening_hours || '08:00 - 17:00';
  const ticket = data.ticket || 'Gratis';
  const mapsUrl = data.google_maps || `https://maps.google.com/?q=${data.location?.latitude || -7.6298},${data.location?.longitude || 111.5239}`;

  // Update DOM Elements
  const badgeEl = document.getElementById('dest-category-badge');
  const titleEl = document.getElementById('dest-title');
  const addressEl = document.getElementById('dest-address');
  const coverEl = document.getElementById('dest-cover-img');
  const descEl = document.getElementById('dest-description-content');
  const hoursEl = document.getElementById('dest-hours');
  const ticketEl = document.getElementById('dest-ticket');
  const mapsBtn = document.getElementById('dest-maps-btn');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');

  if (badgeEl) badgeEl.textContent = categoryName;
  if (titleEl) titleEl.textContent = title;
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = title;

  if (addressEl) {
    addressEl.innerHTML = `<i data-lucide="map-pin" style="width:18px; height:18px; display:inline-block; vertical-align:middle; color: var(--primary);"></i> ${address}`;
  }

  if (coverEl) {
    coverEl.src = coverImage;
    coverEl.alt = title;
  }

  if (descEl) {
    const descText = getItemDescription(data, currentLang);
    descEl.innerHTML = data.htmlContent || `<p>${descText}</p>`;
  }

  if (hoursEl) hoursEl.textContent = hours;
  if (ticketEl) ticketEl.textContent = ticket;
  if (mapsBtn) mapsBtn.href = mapsUrl;

  // Facilities Chips
  const facilitiesContainer = document.getElementById('dest-facilities-container');
  if (facilitiesContainer && Array.isArray(data.facilities) && data.facilities.length > 0) {
    facilitiesContainer.innerHTML = data.facilities.map(fac => `
      <span class="btn btn-outline" style="font-size: 0.85rem; padding: 0.35rem 0.85rem;">
        <i data-lucide="check-circle" style="width:14px; height:14px; color: var(--primary);"></i> ${fac}
      </span>
    `).join('');
  }

  // Gallery Grid
  const galleryContainer = document.getElementById('dest-gallery-container');
  if (galleryContainer) {
    const galleryImgs = (Array.isArray(data.gallery) && data.gallery.length > 0) ? data.gallery : [coverImage];
    galleryContainer.innerHTML = galleryImgs.map(imgUrl => `
      <div style="border-radius: var(--radius-md); overflow: hidden; height: 200px; box-shadow: var(--shadow-sm);">
        <img src="${imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : coverImage}" alt="${title} Gallery" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${coverImage}'">
      </div>
    `).join('');
  }

  // SEO Updates
  const seoDescription = getItemDescription(data, currentLang);
  updateMetaSEO({
    title: title,
    description: seoDescription,
    keywords: data.seo?.keywords || ['wisata madiun', title],
    image: coverImage,
    canonicalUrl: `https://jelajahmadiun.pages.dev/src/pages/detail-wisata.html?slug=${data.slug}`,
    schemaType: data.category === 'kuliner' ? 'LocalBusiness' : 'TouristAttraction'
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function getCategoryLabel(cat) {
  const map = {
    'wisata-buatan': 'Wisata Buatan',
    'wisata-sejarah': 'Wisata Sejarah',
    'wisata-religi': 'Wisata Religi',
    'kuliner': 'Wisata Kuliner'
  };
  return map[cat] || 'Destinasi Wisata';
}
