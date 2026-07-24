/**
 * Detail Wisata Dynamic View Renderer & SEO Controller
 */

import { getDestinationBySlug } from '../services/content-service.js';
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

  const title = (currentLang === 'en' && data.title?.en) ? data.title.en : (data.title?.id || data.slug);
  const categoryName = getCategoryLabel(data.category);
  const address = data.location?.address || 'Kota Madiun, Jawa Timur';
  const coverImage = data.hero_image || getUnsplashFallback(data.category);
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
    coverEl.onerror = () => {
      coverEl.src = getUnsplashFallback(data.category);
    };
  }

  if (descEl) {
    descEl.innerHTML = data.htmlContent || `<p>${data.seo?.description?.id || ''}</p>`;
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
  if (galleryContainer && Array.isArray(data.gallery) && data.gallery.length > 0) {
    galleryContainer.innerHTML = data.gallery.map(imgUrl => `
      <div style="border-radius: var(--radius-md); overflow: hidden; height: 180px; box-shadow: var(--shadow-sm);">
        <img src="${imgUrl}" alt="${title} Gallery" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop'">
      </div>
    `).join('');
  }

  // SEO Updates
  const seoDescription = data.seo?.description?.id || data.description?.id || '';
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

function getUnsplashFallback(cat) {
  const map = {
    'wisata-buatan': 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&auto=format&fit=crop',
    'wisata-sejarah': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop',
    'wisata-religi': 'https://images.unsplash.com/photo-1548625361-1858e9b6a226?w=800&auto=format&fit=crop',
    'kuliner': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'
  };
  return map[cat] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop';
}
