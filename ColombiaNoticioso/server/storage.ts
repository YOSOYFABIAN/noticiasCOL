import {
  articles,
  categories,
  trendingTopics,
  newsletters,
  weatherData,
  sources,
  type Article,
  type InsertArticle,
  type Category,
  type InsertCategory,
  type TrendingTopic,
  type InsertTrendingTopic,
  type Newsletter,
  type InsertNewsletter,
  type WeatherData,
  type InsertWeatherData,
  type Source,
  type InsertSource,
} from "@shared/schema";

export interface IStorage {
  // Articles
  getArticles(limit?: number, offset?: number, category?: string): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getBreakingNews(): Promise<Article[]>;
  getMostRead(limit?: number): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticleViews(id: number): Promise<void>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Trending Topics
  getTrendingTopics(limit?: number): Promise<TrendingTopic[]>;
  updateTrendingTopic(topic: InsertTrendingTopic): Promise<TrendingTopic>;
  
  // Newsletter
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscribers(): Promise<Newsletter[]>;
  
  // Weather
  getWeatherData(): Promise<WeatherData[]>;
  updateWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  
  // Sources
  getSources(): Promise<Source[]>;
  getActiveSource(): Promise<Source[]>;
  createSource(source: InsertSource): Promise<Source>;
}

export class MemStorage implements IStorage {
  private articles: Map<number, Article>;
  private categories: Map<number, Category>;
  private trendingTopics: Map<number, TrendingTopic>;
  private newsletters: Map<number, Newsletter>;
  private weatherData: Map<number, WeatherData>;
  private sources: Map<number, Source>;
  private currentId: number;

  constructor() {
    this.articles = new Map();
    this.categories = new Map();
    this.trendingTopics = new Map();
    this.newsletters = new Map();
    this.weatherData = new Map();
    this.sources = new Map();
    this.currentId = 1;

    // Initialize with default categories and sample articles
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const defaultCategories = [
      { name: "Política", slug: "politica", description: "Noticias políticas de Colombia", color: "#dc2626", isActive: true },
      { name: "Deportes", slug: "deportes", description: "Deportes y fútbol colombiano", color: "#059669", isActive: true },
      { name: "Entretenimiento", slug: "entretenimiento", description: "Farándula y entretenimiento", color: "#7c3aed", isActive: true },
      { name: "Economía", slug: "economia", description: "Noticias económicas y financieras", color: "#ea580c", isActive: true },
      { name: "Tecnología", slug: "tecnologia", description: "Tecnología e innovación", color: "#2563eb", isActive: true },
      { name: "Cultura", slug: "cultura", description: "Cultura y tradiciones colombianas", color: "#db2777", isActive: true },
    ];

    defaultCategories.forEach(cat => {
      const id = this.currentId++;
      this.categories.set(id, { ...cat, id });
    });

    // Initialize weather data for major Colombian cities
    const defaultWeather = [
      { city: "Bogotá", temperature: 18, description: "Nublado", icon: "cloud" },
      { city: "Medellín", temperature: 24, description: "Soleado", icon: "sun" },
      { city: "Cali", temperature: 26, description: "Parcialmente nublado", icon: "cloud-sun" },
      { city: "Barranquilla", temperature: 29, description: "Soleado", icon: "sun" },
    ];

    defaultWeather.forEach(weather => {
      const id = this.currentId++;
      this.weatherData.set(id, { ...weather, id, updatedAt: new Date() });
    });

    // Initialize default trending topics
    const defaultTrending = [
      { hashtag: "#ReformaTributaria", count: 15200, category: "Política" },
      { hashtag: "#ColombiaAlMundial", count: 8700, category: "Deportes" },
      { hashtag: "#CaféColombiano", count: 4200, category: "Economía" },
    ];

    defaultTrending.forEach(topic => {
      const id = this.currentId++;
      this.trendingTopics.set(id, { ...topic, id, updatedAt: new Date() });
    });

    // Initialize default sources
    const defaultSources = [
      {
        name: "El Tiempo",
        url: "https://www.eltiempo.com",
        baseUrl: "https://www.eltiempo.com",
        isActive: true,
        selectors: {
          title: "h1.title",
          content: ".article-content",
          image: ".main-image img",
          author: ".author-name",
          date: ".publish-date"
        }
      },
      {
        name: "Semana",
        url: "https://www.semana.com",
        baseUrl: "https://www.semana.com",
        isActive: true,
        selectors: {
          title: "h1",
          content: ".content",
          image: ".featured-image img",
          author: ".byline",
          date: ".date"
        }
      }
    ];

    defaultSources.forEach(source => {
      const id = this.currentId++;
      this.sources.set(id, { ...source, id, lastScraped: null });
    });

    // Add sample articles for demonstration
    this.initializeSampleArticles();
  }

  private initializeSampleArticles() {
    const sampleArticles = [
      {
        title: "Presidente anuncia nuevas medidas económicas para el 2025",
        content: "El presidente de Colombia presentó hoy un paquete de medidas económicas destinadas a fortalecer la economía nacional durante el 2025. Las medidas incluyen incentivos fiscales para pequeñas empresas, inversión en infraestructura y programas de empleo juvenil. El plan busca generar más de 500,000 empleos nuevos y aumentar el PIB en un 4.2% durante el próximo año. Las medidas serán implementadas de manera gradual a partir de febrero, con un presupuesto total de 15 billones de pesos. Los sectores más beneficiados serán la agricultura, la tecnología y el turismo, considerados estratégicos para el crecimiento del país.",
        summary: "El gobierno colombiano presenta un ambicioso plan económico para 2025 que busca crear 500,000 empleos y crecer el PIB en 4.2% mediante incentivos fiscales e inversión en sectores estratégicos.",
        category: "Política",
        author: "María González",
        sourceUrl: "https://example.com/news/1",
        sourceName: "El Tiempo",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isBreaking: true,
        tags: ["economía", "empleo", "gobierno", "PIB"],
        readTime: 3,
      },
      {
        title: "Colombia clasificó al Mundial Sub-20 tras vencer 2-1 a Argentina",
        content: "La selección colombiana Sub-20 logró su clasificación al Mundial de la categoría después de derrotar 2-1 a Argentina en un emocionante partido disputado en Bogotá. Los goles colombianos fueron anotados por Luis Díaz Jr. en el minuto 23 y Santiago Moreno en el 67, mientras que Argentina descontó en los últimos minutos a través de un penal convertido por Echeverri. Con este resultado, Colombia se convierte en el segundo equipo sudamericano en asegurar su cupo al Mundial Sub-20 que se disputará en Chile. El técnico Héctor Cárdenas destacó el trabajo en equipo y la determinación de los jóvenes jugadores.",
        summary: "La selección Colombia Sub-20 derrotó 2-1 a Argentina y aseguró su clasificación al Mundial de la categoría que se realizará en Chile.",
        category: "Deportes",
        author: "Carlos Rodríguez",
        sourceUrl: "https://example.com/news/2",
        sourceName: "Caracol Deportes",
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isBreaking: false,
        tags: ["fútbol", "selección", "mundial", "sub-20"],
        readTime: 2,
      },
      {
        title: "Shakira anuncia nuevo álbum inspirado en sus raíces colombianas",
        content: "La cantante barranquillera Shakira sorprendió a sus fanáticos al anunciar su próximo álbum musical, que estará completamente inspirado en sus raíces colombianas. El disco, titulado 'Tierra Dorada', incluirá colaboraciones con artistas nacionales como Carlos Vives, Bomba Estéreo y Monsieur Periné. La producción musical estará a cargo del reconocido productor colombiano Rafa Arcaute. Shakira explicó que este proyecto surge de su deseo de rendir homenaje a Colombia y mostrar al mundo la riqueza musical del país. El álbum incluirá fusiones de cumbia, vallenato, champeta y pop moderno. El lanzamiento está programado para marzo de 2025.",
        summary: "Shakira anuncia 'Tierra Dorada', un álbum inspirado en Colombia con colaboraciones de Carlos Vives, Bomba Estéreo y otros artistas nacionales, previsto para marzo 2025.",
        category: "Entretenimiento",
        author: "Laura Mendoza",
        sourceUrl: "https://example.com/news/3",
        sourceName: "Semana",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isBreaking: false,
        tags: ["música", "shakira", "álbum", "artistas"],
        readTime: 2,
      },
      {
        title: "Startup colombiana desarrolla tecnología revolucionaria para energía solar",
        content: "Una empresa emergente con sede en Medellín ha desarrollado una innovadora tecnología que aumenta la eficiencia de los paneles solares en un 35%. La startup Soltech Colombia, fundada por ingenieros de la Universidad Nacional, creó un sistema de seguimiento solar inteligente que optimiza la captación de energía durante todo el día. La tecnología utiliza inteligencia artificial para predecir patrones climáticos y ajustar automáticamente la posición de los paneles. El proyecto ha recibido financiación de 2 millones de dólares de inversionistas internacionales y el gobierno nacional. La empresa planea expandirse a otros países de América Latina en 2025 y ya ha firmado acuerdos con empresas energéticas de Brasil y Chile.",
        summary: "Soltech Colombia desarrolla tecnología que mejora la eficiencia de paneles solares en 35% usando IA, recibe $2M en financiación y planea expansión regional.",
        category: "Tecnología",
        author: "Andrés Parra",
        sourceUrl: "https://example.com/news/4",
        sourceName: "El Colombiano",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        isBreaking: false,
        tags: ["startup", "energía solar", "tecnología", "medellín"],
        readTime: 3,
      },
      {
        title: "Festival de Cine de Cartagena anuncia programación 2025",
        content: "El Festival Internacional de Cine de Cartagena (FICCI) reveló su programación para 2025, que incluye más de 200 películas de 40 países diferentes. El evento, que se realizará del 28 de febrero al 8 de marzo, tendrá como invitada de honor a la actriz colombiana Catalina Sandino Moreno. La programación incluye una retrospectiva del cine colombiano contemporáneo, con especial énfasis en producciones dirigidas por mujeres. Además, se realizarán talleres magistrales con cineastas internacionales y se otorgarán premios por valor de 100 millones de pesos. El festival espera recibir más de 50,000 visitantes y generar un impacto económico de 8,000 millones de pesos para la ciudad de Cartagena.",
        summary: "FICCI 2025 presenta 200 películas de 40 países con Catalina Sandino Moreno como invitada de honor, del 28 de febrero al 8 de marzo en Cartagena.",
        category: "Cultura",
        author: "Diana Torres",
        sourceUrl: "https://example.com/news/5",
        sourceName: "El Universal",
        imageUrl: "https://images.unsplash.com/photo-1489599944761-23d7edbaa50a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isBreaking: false,
        tags: ["cine", "festival", "cartagena", "cultura"],
        readTime: 2,
      },
      {
        title: "Inflación en Colombia cierra 2024 en 4.8%, por debajo de expectativas",
        content: "El Departamento Administrativo Nacional de Estadística (DANE) anunció que la inflación anual de Colombia cerró 2024 en 4.8%, cifra inferior a las expectativas del mercado que proyectaban un 5.2%. Los sectores que más contribuyeron a la moderación de la inflación fueron alimentos y vivienda, mientras que transporte y educación mostraron aumentos superiores al promedio. El Banco de la República destacó que las políticas monetarias implementadas durante el año lograron controlar las presiones inflacionarias. Los analistas consideran que este resultado positivo abre la puerta para posibles reducciones en las tasas de interés durante el primer trimestre de 2025, lo que podría impulsar el crecimiento económico.",
        summary: "La inflación colombiana cerró 2024 en 4.8%, por debajo del 5.2% esperado, lo que podría permitir reducciones en tasas de interés en 2025.",
        category: "Economía",
        author: "Roberto Silva",
        sourceUrl: "https://example.com/news/6",
        sourceName: "Portafolio",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isBreaking: false,
        tags: ["inflación", "economía", "dane", "banco república"],
        readTime: 3,
      }
    ];

    sampleArticles.forEach(articleData => {
      const id = this.currentId++;
      const article: Article = {
        ...articleData,
        id,
        scrapedAt: new Date(),
        views: Math.floor(Math.random() * 5000) + 1000, // Random views between 1000-6000
      };
      this.articles.set(id, article);
    });
  }

  // Articles
  async getArticles(limit = 50, offset = 0, category?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (category) {
      articles = articles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getBreakingNews(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isBreaking)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
  }

  async getMostRead(limit = 10): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    const article: Article = {
      ...insertArticle,
      id,
      scrapedAt: new Date(),
      views: 0,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticleViews(id: number): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.views += 1;
      this.articles.set(id, article);
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter(category => category.isActive);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values())
      .find(category => category.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Trending Topics
  async getTrendingTopics(limit = 10): Promise<TrendingTopic[]> {
    return Array.from(this.trendingTopics.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async updateTrendingTopic(insertTopic: InsertTrendingTopic): Promise<TrendingTopic> {
    const existing = Array.from(this.trendingTopics.values())
      .find(topic => topic.hashtag === insertTopic.hashtag);
    
    if (existing) {
      existing.count = insertTopic.count;
      existing.updatedAt = new Date();
      this.trendingTopics.set(existing.id, existing);
      return existing;
    } else {
      const id = this.currentId++;
      const topic: TrendingTopic = { ...insertTopic, id, updatedAt: new Date() };
      this.trendingTopics.set(id, topic);
      return topic;
    }
  }

  // Newsletter
  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const existing = Array.from(this.newsletters.values())
      .find(sub => sub.email === insertNewsletter.email);
    
    if (existing) {
      return existing;
    }

    const id = this.currentId++;
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      subscribedAt: new Date(),
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values())
      .filter(sub => sub.isActive);
  }

  // Weather
  async getWeatherData(): Promise<WeatherData[]> {
    return Array.from(this.weatherData.values());
  }

  async updateWeatherData(insertWeather: InsertWeatherData): Promise<WeatherData> {
    const existing = Array.from(this.weatherData.values())
      .find(weather => weather.city === insertWeather.city);
    
    if (existing) {
      existing.temperature = insertWeather.temperature;
      existing.description = insertWeather.description;
      existing.icon = insertWeather.icon;
      existing.updatedAt = new Date();
      this.weatherData.set(existing.id, existing);
      return existing;
    } else {
      const id = this.currentId++;
      const weather: WeatherData = { ...insertWeather, id, updatedAt: new Date() };
      this.weatherData.set(id, weather);
      return weather;
    }
  }

  // Sources
  async getSources(): Promise<Source[]> {
    return Array.from(this.sources.values());
  }

  async getActiveSource(): Promise<Source[]> {
    return Array.from(this.sources.values())
      .filter(source => source.isActive);
  }

  async createSource(insertSource: InsertSource): Promise<Source> {
    const id = this.currentId++;
    const source: Source = { ...insertSource, id, lastScraped: null };
    this.sources.set(id, source);
    return source;
  }
}

export const storage = new MemStorage();
