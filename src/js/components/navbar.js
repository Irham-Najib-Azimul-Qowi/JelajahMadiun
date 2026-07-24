/**
 * Navbar controller — active link highlighting, scroll shadow, mobile drawer
 */

export function initNavbar() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  // Highlight active nav link
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isHome = href === '/' && (currentPath === '/' || currentPath === '/index.html');
    const isSubMatch = href !== '/' && currentPath.includes(href);

    if (isHome || isSubMatch) {
      link.classList.add('active');
    }
  });

  // Scroll shadow effect
  if (navbar) {
    const updateNavbarScroll = () => {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', updateNavbarScroll, { passive: true });
    updateNavbarScroll();
  }

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');

  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && e.target !== mobileBtn) {
        mainNav.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mainNav.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}
