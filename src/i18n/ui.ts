export const ui = {
  en: {
    blog: 'Blog',
    blogTitle: 'Team Canada Blog',
    blogDescription: 'Stories, updates, and insights from Team Canada on the road to the ICC in Lyon 2027.',
    readMore: 'Read more',
    publishedOn: 'Published on',
    backToBlog: 'Back to Blog',
    allPosts: 'All Posts',
    noPosts: 'No posts yet. Check back soon!',
    category: 'Category',
    tags: 'Tags',
    by: 'by',
    sharePost: 'Share this post',
    relatedPosts: 'Related Posts',
    langLabel: 'Read this article in',
  },
  fr: {
    blog: 'Blogue',
    blogTitle: "Blogue d'Équipe Canada",
    blogDescription: "Histoires, mises à jour et perspectives d'Équipe Canada sur la route de l'ICC à Lyon 2027.",
    readMore: 'Lire la suite',
    publishedOn: 'Publié le',
    backToBlog: 'Retour au blogue',
    allPosts: 'Tous les articles',
    noPosts: 'Aucun article pour le moment. Revenez bientôt!',
    category: 'Catégorie',
    tags: 'Étiquettes',
    by: 'par',
    sharePost: 'Partager cet article',
    relatedPosts: 'Articles connexes',
    langLabel: 'Lire cet article en',
  },
} as const;

export type Language = keyof typeof ui;

/**
 * Returns the UI strings for a given language.
 * Falls back to English if the language is not available.
 */
export function useTranslations(lang: string): typeof ui[Language] {
  return ui[lang as Language] ?? ui.en;
}
