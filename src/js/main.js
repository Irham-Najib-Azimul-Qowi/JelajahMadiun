/**
 * Main Application Bootstrap for JelajahMadiun
 */

import { loadComponents } from './utils/component-loader.js';
import { initNavbar } from './components/navbar.js';
import { initLanguageSwitcher } from './components/language-switcher.js';
import { initBackToTop } from './components/back-to-top.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inject Reusable HTML Components
  await loadComponents();

  // 2. Initialize UI Controllers
  initNavbar();
  initLanguageSwitcher();
  initBackToTop();

  // 3. Initialize Lucide Vector Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
