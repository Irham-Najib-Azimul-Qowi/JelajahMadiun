/**
 * Main Application Bootstrap for JelajahMadiun
 * 1. Load HTML component placeholders
 * 2. Initialize UI controllers
 * 3. Initialize icons & FAQ accordion
 */

import { loadComponents } from './utils/component-loader.js';
import { initNavbar } from './components/navbar.js';
import { initLanguageSwitcher } from './components/language-switcher.js';
import { initBackToTop } from './components/back-to-top.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inject reusable HTML component placeholders
  await loadComponents();

  // 2. Initialize UI controllers
  initNavbar();
  initLanguageSwitcher();
  initBackToTop();
  initFaqAccordion();

  // 3. Initialize Lucide vector icons (render all icons on page)
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * FAQ Accordion Toggle
 */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(question => {
    // Close all answers initially
    const answer = question.nextElementSibling;
    if (answer && answer.classList.contains('faq-answer')) {
      answer.style.display = 'none';
    }

    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      if (!answer) return;

      const isOpen = answer.style.display === 'block';

      // Close all others
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.style.display = 'none';
      });
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        const icon = q.querySelector('[data-lucide]');
        if (icon) icon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        answer.style.display = 'block';
        question.classList.add('active');
        const icon = question.querySelector('[data-lucide]');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
