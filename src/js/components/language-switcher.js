/**
 * Language switcher controller for JelajahMadiun
 */

export function initLanguageSwitcher() {
  const btnId = document.getElementById('lang-id');
  const btnEn = document.getElementById('lang-en');

  let currentLang = localStorage.getItem('site_lang') || 'id';
  updateState(currentLang);

  if (btnId) {
    btnId.addEventListener('click', () => {
      localStorage.setItem('site_lang', 'id');
      updateState('id');
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: 'id' } }));
    });
  }

  if (btnEn) {
    btnEn.addEventListener('click', () => {
      localStorage.setItem('site_lang', 'en');
      updateState('en');
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: 'en' } }));
    });
  }

  function updateState(lang) {
    if (!btnId || !btnEn) return;
    if (lang === 'id') {
      btnId.classList.add('btn-primary');
      btnId.classList.remove('btn-outline');
      btnEn.classList.add('btn-outline');
      btnEn.classList.remove('btn-primary');
    } else {
      btnEn.classList.add('btn-primary');
      btnEn.classList.remove('btn-outline');
      btnId.classList.add('btn-outline');
      btnId.classList.remove('btn-primary');
    }
  }
}
