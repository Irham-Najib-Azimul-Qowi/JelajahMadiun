/**
 * Modular Component Loader for JelajahMadiun
 * Injects HTML components from /src/components/*.html into placeholders.
 * Always uses absolute paths to avoid relative path confusion across subfolders.
 */

export async function loadComponents() {
  const elements = document.querySelectorAll('[data-component]');

  for (const el of elements) {
    const componentName = el.getAttribute('data-component');
    if (!componentName) continue;

    try {
      // Always use absolute path from domain root — works on every page regardless of depth
      const response = await fetch(`/src/components/${componentName}.html`);
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

  // Handle nested component placeholders (e.g. language-switch inside navbar)
  const remaining = document.querySelectorAll('[data-component]');
  if (remaining.length > 0) {
    // Avoid infinite recursion — only run one level of nested component loading
    for (const el of remaining) {
      const componentName = el.getAttribute('data-component');
      if (!componentName) continue;
      try {
        const response = await fetch(`/src/components/${componentName}.html`);
        if (response.ok) {
          const html = await response.text();
          const temp = document.createElement('div');
          temp.innerHTML = html.trim();
          const newEl = temp.firstElementChild;
          if (newEl) {
            el.parentNode.replaceChild(newEl, el);
          }
        }
      } catch (err) {
        console.error(`[ComponentLoader] Failed loading nested '${componentName}':`, err);
      }
    }
  }
}
