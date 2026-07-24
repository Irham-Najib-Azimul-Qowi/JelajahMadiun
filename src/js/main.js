/**
 * JelajahMadiun — Main Application Bootstrap
 * Loads components, then initialises all UI controllers.
 */

import { loadComponents } from './utils/component-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inject reusable HTML components
  await loadComponents();

  // 2. Initialise controllers
  initNavbar();
  initMobileDrawer();
  initBackToTop();
  initFaq();

  // 3. Render Lucide icons (if CDN loaded)
  if (window.lucide) window.lucide.createIcons();
});

/* ── Navbar: active link + scroll shadow ───────────────────── */
function initNavbar() {
  const path = window.location.pathname;
  const links = document.querySelectorAll('.nav-link, .nav-drawer-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isHome = (href === '/') && (path === '/' || path === '/index.html');
    const isSub  = href !== '/' && path.startsWith(href.split('?')[0]);
    if (isHome || isSub) link.classList.add('active');
  });

  const navbar = document.getElementById('site-navbar');
  if (navbar) {
    const update = () => navbar.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
}

/* ── Mobile Drawer ─────────────────────────────────────────── */
function initMobileDrawer() {
  const toggle  = document.getElementById('nav-toggle-btn');
  const drawer  = document.getElementById('nav-drawer');
  const overlay = document.getElementById('nav-drawer-overlay');
  const close   = document.getElementById('nav-drawer-close');
  if (!toggle || !drawer) return;

  const open  = () => { drawer.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
  const shut  = () => { drawer.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };

  toggle.addEventListener('click', () => drawer.classList.contains('open') ? shut() : open());
  if (overlay) overlay.addEventListener('click', shut);
  if (close)   close.addEventListener('click', shut);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });

  // Close drawer on nav link click
  drawer.querySelectorAll('.nav-drawer-link').forEach(a => a.addEventListener('click', shut));
}

/* ── Back to Top ───────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── FAQ Accordion ─────────────────────────────────────────── */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    const toggle = () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => { i.classList.remove('open'); const ia = i.querySelector('.faq-a'); if (ia) ia.style.display = ''; });
      if (!isOpen) {
        item.classList.add('open');
        a.style.display = 'block';
        q.setAttribute('aria-expanded', 'true');
      } else {
        q.setAttribute('aria-expanded', 'false');
      }
    };

    q.addEventListener('click', toggle);
    q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
}
