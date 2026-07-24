/**
 * Homepage Dynamic Renderer Script
 */

import { getAllDestinations } from '../services/content-service.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('featured-destinations-grid');
  if (!container) return;

  try {
    const all = await getAllDestinations();
    const featured = all.filter(item => item.featured === true || item.featured === 'true').slice(0, 6);
    const displayList = featured.length > 0 ? featured : all.slice(0, 6);

    renderDestinationCards(displayList, container);
  } catch (err) {
    console.error('[HomeJS] Failed to render featured destinations:', err);
  }
});

function renderDestinationCards(items, container) {
  if (!items || items.length === 0) return;

  container.innerHTML = items.map(item => {
    const title = item.title?.id || item.title?.en || item.slug;
    const desc = item.seo?.description?.id || item.seo?.description?.en || item.description?.id || '';
    const categoryName = getCategoryLabel(item.category);
    const image = item.hero_image || getUnsplashFallback(item.category);
    const hours = item.opening_hours || '08:00 - 17:00';
    const ticket = item.ticket || 'Gratis';

    return `
      <article class="destination-card">
        <div class="destination-card-image">
          <img src="${image}" alt="${title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop'">
          <span class="destination-card-badge">${categoryName}</span>
        </div>
        <div class="destination-card-content">
          <h3 class="destination-card-title">${title}</h3>
          <p class="destination-card-desc">${desc}</p>
          <div class="destination-card-footer">
            <span><i data-lucide="clock" style="width: 14px; display: inline;"></i> ${hours}</span>
            <a href="/src/pages/detail-wisata.html?slug=${item.slug}" class="btn btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">Detail</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

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
    'wisata-buatan': 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=600&auto=format&fit=crop',
    'wisata-sejarah': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop',
    'wisata-religi': 'https://images.unsplash.com/photo-1548625361-1858e9b6a226?w=600&auto=format&fit=crop',
    'kuliner': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop'
  };
  return map[cat] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop';
}
