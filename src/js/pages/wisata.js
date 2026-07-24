/**
 * Wisata List Page Dynamic Renderer & Filter Controller
 */

import { getAllDestinations, searchDestinations } from '../services/content-service.js';
import { initSearch } from '../components/search.js';

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('wisata-grid');
  if (!container) return;

  // Read URL query parameter if present
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get('cat');
  const initialQuery = params.get('q');

  if (initialCat) {
    currentCategory = initialCat;
    updatePillUI(currentCategory);
  }

  const searchInput = document.getElementById('search-input');
  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
  }

  // Load and render initial list
  await updateList(initialQuery || '', currentCategory);

  // Setup category pills listeners
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', async () => {
      const cat = pill.getAttribute('data-category');
      currentCategory = cat;
      updatePillUI(cat);

      const q = searchInput ? searchInput.value : '';
      await updateList(q, currentCategory);
    });
  });

  // Setup search controller
  initSearch({
    onResults: (results) => {
      renderDestinationCards(results, container);
      updateCountLabel(results.length);
    }
  });
});

async function updateList(query, category) {
  const container = document.getElementById('wisata-grid');
  if (!container) return;

  window.currentCategoryFilter = category;
  const items = await searchDestinations(query, category);
  renderDestinationCards(items, container);
  updateCountLabel(items.length);
}

function updatePillUI(activeCat) {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    const cat = pill.getAttribute('data-category');
    if (cat === activeCat) {
      pill.classList.add('btn-primary');
      pill.classList.remove('btn-outline');
    } else {
      pill.classList.add('btn-outline');
      pill.classList.remove('btn-primary');
    }
  });
}

function updateCountLabel(count) {
  const label = document.getElementById('result-count-label');
  if (label) {
    label.textContent = `Menampilkan ${count} destinasi wisata`;
  }
}

function renderDestinationCards(items, container) {
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>Tidak ada destinasi ditemukan</h3>
        <p style="color: var(--text-muted);">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = items.map(item => {
    const title = item.title?.id || item.title?.en || item.slug;
    const desc = item.seo?.description?.id || item.seo?.description?.en || item.description?.id || '';
    const categoryName = getCategoryLabel(item.category);
    const image = item.hero_image || getUnsplashFallback(item.category);
    const hours = item.opening_hours || '08:00 - 17:00';

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
