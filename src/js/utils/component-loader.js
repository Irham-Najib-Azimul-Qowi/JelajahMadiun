/**
 * Modular Component Loader for JelajahMadiun
 * Injects HTML components from src/components/*.html into placeholders.
 */

export async function loadComponents() {
  const elements = document.querySelectorAll('[data-component]');

  for (const el of elements) {
    const componentName = el.getAttribute('data-component');
    if (!componentName) continue;

    try {
      const isSubFolder = window.location.pathname.includes('/pages/');
      const basePath = isSubFolder ? '../components/' : '/src/components/';

      const response = await fetch(`${basePath}${componentName}.html`);
      if (response.ok) {
        const html = await response.text();
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();
        const newEl = temp.firstElementChild;
        if (newEl) {
          el.parentNode.replaceChild(newEl, el);
        }
      } else {
        console.warn(`[ComponentLoader] Could not load component '${componentName}' (${response.status})`);
      }
    } catch (err) {
      console.error(`[ComponentLoader] Failed loading '${componentName}':`, err);
    }
  }

  // Handle nested loads if any
  const remaining = document.querySelectorAll('[data-component]');
  if (remaining.length > 0) {
    await loadComponents();
  }
}
