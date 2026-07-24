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
    const title = item.resolvedTitle || item.slug;
    const desc = item.resolvedDescription || '';
    const categoryName = getCategoryLabel(item.category);
    const image = item.resolvedImage;
    const hours = item.opening_hours || '08:00 - 17:00';

    return `
      <article class="destination-card">
        <div class="destination-card-image">
          <img src="${image}" alt="${title}" loading="lazy">
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
