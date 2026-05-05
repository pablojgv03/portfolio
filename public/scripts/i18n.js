export function getLanguage() {
  const cookieLang = document.cookie.split('; ').find(r => r.startsWith('lang='));
  if (cookieLang) return cookieLang.split('=')[1];
  return localStorage.getItem('lang') || 'es';
}

export async function loadLanguage(lang) {
  try {
    const res = await fetch(`/data/i18n/${lang}.json`);
    const data = await res.json();

    window.lang = data.idioma;

    // Leer todos los atributos primero, luego escribir en el DOM de una vez
    const updates = [];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const keys = key.split('.');
      let value = data;
      for (const k of keys) {
        if (value == null) break;
        value = value[k];
      }
      if (typeof value === 'string') updates.push([el, value]);
    });
    for (const [el, value] of updates) {
      el.innerHTML = value;
    }
  } catch (err) {
    console.error('Error cargando idioma:', err);
  }
}

export function setLanguage(lang) {
  document.cookie = `lang=${lang}; path=/; max-age=31536000`;
  location.reload();
}
