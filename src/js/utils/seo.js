/**
 * SEO & Schema.org JSON-LD Generator for JelajahMadiun
 */

export function updateMetaSEO({ title, description, keywords, image, canonicalUrl, schemaType = 'TouristAttraction', extraSchema = null }) {
  if (title) {
    document.title = `${title} | JelajahMadiun Portal Pariwisata`;
    setMeta('og:title', `${title} | JelajahMadiun`);
    setMeta('twitter:title', `${title} | JelajahMadiun`);
  }

  if (description) {
    setMeta('description', description);
    setMeta('og:description', description);
    setMeta('twitter:description', description);
  }

  if (keywords) {
    const kw = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    setMeta('keywords', kw);
  }

  if (image) {
    setMeta('og:image', image);
    setMeta('twitter:image', image);
  }

  if (canonicalUrl) {
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  // Inject Schema.org JSON-LD
  injectSchemaJsonLd(schemaType, { title, description, image, canonicalUrl, extraSchema });
}

function setMeta(nameOrProperty, content) {
  let element = document.querySelector(`meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`);
  if (!element) {
    element = document.createElement('meta');
    if (nameOrProperty.startsWith('og:')) {
      element.setAttribute('property', nameOrProperty);
    } else {
      element.setAttribute('name', nameOrProperty);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function injectSchemaJsonLd(schemaType, data) {
  let existingScript = document.getElementById('json-ld-schema');
  if (!existingScript) {
    existingScript = document.createElement('script');
    existingScript.id = 'json-ld-schema';
    existingScript.type = 'application/ld+json';
    document.head.appendChild(existingScript);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": data.title || "JelajahMadiun",
    "description": data.description || "Portal Resmi Informasi Wisata Kota Madiun",
    "url": data.canonicalUrl || window.location.href,
    "image": data.image || "https://jelajahmadiun.pages.dev/assets/images/hero/hero-madiun.webp",
    "publisher": {
      "@type": "GovernmentOrganization",
      "name": "Pemerintah Kota Madiun",
      "url": "https://madiun.go.id"
    }
  };

  if (data.extraSchema) {
    Object.assign(jsonLd, data.extraSchema);
  }

  existingScript.textContent = JSON.stringify(jsonLd, null, 2);
}
