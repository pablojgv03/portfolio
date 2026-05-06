export function getLanguage() {
  // Buscar primero en cookie
  const cookieLang = document.cookie.split('; ').find(r => r.startsWith('lang='));
  if (cookieLang) return cookieLang.split('=')[1];

  // Si no hay cookie, comprobar localStorage
  return localStorage.getItem('lang') || 'es';
}

export async function loadLanguage(lang) {
  try {
    const res = await fetch(`/src/data/i18n/${lang}.json`, { cache: 'no-cache' });
    const data = await res.json();

    // Guardar idioma actual globalmente
    window.lang = data.idioma;

    // Reemplazar textos
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const keys = key.split('.');
      let value = data;
      keys.forEach(k => { if (value) value = value[k]; });
      if (typeof value === 'string') el.innerHTML = value;
    });
  } catch (err) {
    console.error('Error cargando idioma:', err);
  }
}

export function setLanguage(lang) {
  // Guardar cookie 1 año
  document.cookie = `lang=${lang}; path=/; max-age=31536000`;
  // Recargar para renderizar con el idioma correcto
  location.reload();
}