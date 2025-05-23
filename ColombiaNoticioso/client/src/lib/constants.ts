export const CATEGORIES = [
  { name: "Política", slug: "politica", color: "bg-news-politics" },
  { name: "Deportes", slug: "deportes", color: "bg-news-sports" },
  { name: "Entretenimiento", slug: "entretenimiento", color: "bg-news-entertainment" },
  { name: "Economía", slug: "economia", color: "bg-news-economy" },
  { name: "Tecnología", slug: "tecnologia", color: "bg-news-technology" },
  { name: "Cultura", slug: "cultura", color: "bg-news-culture" },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/noticiascol",
  twitter: "https://twitter.com/noticiascol",
  instagram: "https://instagram.com/noticiascol",
  youtube: "https://youtube.com/noticiascol",
};

export const CONTACT_INFO = {
  email: "info@noticiascol.com",
  phone: "+57 1 234 5678",
  address: "Bogotá, Colombia",
};

export const ADSENSE_CLIENT_ID = "ca-pub-7272644636473162";

export const SEO_DEFAULTS = {
  title: "NoticiasCOL - Noticias de Colombia Actualizadas",
  description: "Las últimas noticias de Colombia con resúmenes inteligentes generados por IA. Política, deportes, entretenimiento y más.",
  keywords: "noticias colombia, colombia news, política colombia, deportes colombia, noticias actualizadas",
  author: "NoticiasCOL",
  image: "/og-image.jpg",
};

export const API_ENDPOINTS = {
  articles: "/api/articles",
  breakingNews: "/api/breaking-news",
  mostRead: "/api/most-read",
  search: "/api/search",
  categories: "/api/categories",
  trending: "/api/trending",
  newsletter: "/api/newsletter/subscribe",
  weather: "/api/weather",
  aiSummary: "/api/ai-summary",
};

export const PAGINATION = {
  articlesPerPage: 20,
  maxPages: 10,
};

export const REFRESH_INTERVALS = {
  breakingNews: 60000, // 1 minute
  trending: 300000, // 5 minutes
  weather: 600000, // 10 minutes
  articles: 1800000, // 30 minutes
};
