/**
 * Wisata list page — dynamic grid with category filter + live search
 */
import { searchDestinations, getItemTitle, getItemDescription, getItemImage } from '../services/content-service.js';

const CAT_LABEL = {
  'wisata-buatan':  'Wisata Buatan',
  'wisata-sejarah': 'Wisata Sejarah',
  'wisata-religi':  'Wisata Religi',
  'kuliner':        'Kuliner Khas'
};

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  const grid        = document.getElementById('wisata-grid');
  const countLabel  = document.getElementById('result-count-label');
  const searchInput = document.getElementById('search-input');
  const searchBtn   = document.getElementById('search-btn');
  if (!grid) return;

  // Init from URL params
  const params = new URLSearchParams(window.location.search);
  currentCategory = params.get('cat') || 'all';
  const initQuery = params.get('q') || '';

  if (searchInput && initQuery) searchInput.value = initQuery;
  updatePills(currentCategory);
  await renderList(initQuery, currentCategory, grid, countLabel);

  // Category pills
  document.querySelectorAll('.pill[data-category]').forEach(pill => {
    pill.addEventListener('click', async () => {
      currentCategory = pill.dataset.category;
      updatePills(currentCategory);
      const q = searchInput ? searchInput.value.trim() : '';
      await renderList(q, currentCategory, grid, countLabel);
    });
  });

  // Search input debounced
  let timer;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await renderList(searchInput.value.trim(), currentCategory, grid, countLabel);
      }, 280);
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
      if (searchInput) await renderList(searchInput.value.trim(), currentCategory, grid, countLabel);
    });
  }
});

function updatePills(active) {
  document.querySelectorAll('.pill[data-category]').forEach(p => {
    const isActive = p.dataset.category === active;
    p.classList.toggle('active', isActive);
  });
}

async function renderList(query, category, grid, countLabel) {
  grid.innerHTML = `
    <div class="dest-card"><div class="dest-card-img skeleton" style="height:200px;"></div><div class="dest-card-body"><div class="skeleton mb-4" style="height:16px;width:70%;"></div><div class="skeleton" style="height:13px;width:85%;"></div></div></div>
    <div class="dest-card"><div class="dest-card-img skeleton" style="height:200px;"></div><div class="dest-card-body"><div class="skeleton mb-4" style="height:16px;width:60%;"></div><div class="skeleton" style="height:13px;width:75%;"></div></div></div>
    <div class="dest-card"><div class="dest-card-img skeleton" style="height:200px;"></div><div class="dest-card-body"><div class="skeleton mb-4" style="height:16px;width:75%;"></div><div class="skeleton" style="height:13px;width:80%;"></div></div></div>
  `;

  const items = await searchDestinations(query, category);

  if (!items || !items.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <h3>Tidak ada destinasi ditemukan</h3>
        <p>Coba ubah kata kunci atau pilih kategori lain</p>
      </div>`;
    if (countLabel) countLabel.textContent = '0 destinasi ditemukan';
    return;
  }

  grid.innerHTML = items.map(item => {
    const title = getItemTitle(item);
    const desc  = getItemDescription(item);
    const img   = getItemImage(item);
    const badge = CAT_LABEL[item.category] || 'Destinasi';
    const hours = item.opening_hours || '08.00 – 17.00';
    const slug  = item.slug || item.id;

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

  if (countLabel) countLabel.textContent = `${items.length} destinasi ditemukan`;
  if (window.lucide) window.lucide.createIcons();
}
