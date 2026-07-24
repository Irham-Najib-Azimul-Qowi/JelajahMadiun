/**
 * Live Search & Category Filter controller for JelajahMadiun
 */

import { searchDestinations } from '../services/content-service.js';

export function initSearch({ onResults }) {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (!searchInput) return;

  let debounceTimer = null;

  const triggerSearch = async () => {
    const query = searchInput.value;
    const category = window.currentCategoryFilter || 'all';

    if (onResults) {
      const results = await searchDestinations(query, category);
      onResults(results);
    } else {
      // Redirect to wisata page with query parameter if searching from hero
      window.location.href = `/src/pages/wisata.html?q=${encodeURIComponent(query)}`;
    }
  };

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(triggerSearch, 300);
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', triggerSearch);
  }
}
