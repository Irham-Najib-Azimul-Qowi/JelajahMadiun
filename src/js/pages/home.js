/**
 * Home page — renders featured destinations into #featured-destinations-grid
 */
import { getAllDestinations, getItemTitle, getItemDescription, getItemImage } from '../services/content-service.js';

const CAT_LABEL = {
  'wisata-buatan':  'Wisata Buatan',
  'wisata-sejarah': 'Wisata Sejarah',
  'wisata-religi':  'Wisata Religi',
  'kuliner':        'Kuliner Khas'
};

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('featured-destinations-grid');
  if (!grid) return;

  try {
    const all      = await getAllDestinations();
    const featured = all.filter(d => d.featured === true || d.featured === 'true').slice(0, 6);
    const list     = featured.length >= 3 ? featured : all.slice(0, 6);
    renderCards(list, grid);
  } catch (e) {
    console.error('[home.js]', e);
  }
});

function renderCards(items, container) {
  if (!items || !items.length) { container.innerHTML = ''; return; }

  container.innerHTML = items.map(item => {
    const title    = getItemTitle(item);
    const desc     = getItemDescription(item);
    const img      = getItemImage(item);
    const badge    = CAT_LABEL[item.category] || 'Destinasi';
    const hours    = item.opening_hours || '08.00 – 17.00';
    const slug     = item.slug || item.id;

    return `
    <article class="dest-card">
      <div class="dest-card-img">
        <img src="${img}" alt="${title}" loading="lazy">
        <span class="dest-card-badge">${badge}</span>
      </div>
      <div class="dest-card-body">
        <h3 class="dest-card-title">${title}</h3>
        <p class="dest-card-desc">${desc}</p>
        <div class="dest-card-footer">
          <span class="dest-card-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${hours}
          </span>
          <a href="/src/pages/detail-wisata.html?slug=${slug}" class="dest-card-link">
            Detail
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    </article>`;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}
