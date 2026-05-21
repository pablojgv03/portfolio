import rss from '@astrojs/rss';
import esData from '../data/i18n/es.json';

export async function GET() {
  const posts = Object.entries(esData.blog)
    .filter(([, post]) => !post.hidden && post.date)
    .sort(([, a], [, b]) => (b.date || '').localeCompare(a.date || ''))
    .map(([slug, post]) => ({
      title: post.title,
      description: post.subtitle || '',
      pubDate: new Date(post.date),
      link: `/blog/${slug}`,
    }));

  return rss({
    title: 'Blog — Pablo Gómez Villén',
    description: 'Artículos sobre desarrollo web, Laravel, PHP, JavaScript y tecnología. Experiencias reales de un Full Stack Developer en Granada.',
    site: 'https://pablogomezvillen.com',
    items: posts,
    customData: `<language>es-ES</language><managingEditor>pablogomezvillen@gmail.com (Pablo Gómez Villén)</managingEditor><webMaster>pablogomezvillen@gmail.com (Pablo Gómez Villén)</webMaster>`,
  });
}
