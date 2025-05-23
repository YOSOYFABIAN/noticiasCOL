import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from './storage';
import { processArticleWithAI } from './ai-processor';
import type { InsertArticle, Source } from '@shared/schema';

interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
  sourceName: string;
}

export class NewsScraper {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async scrapeAllSources(): Promise<void> {
    try {
      const sources = await storage.getActiveSource();
      console.log(`Starting scraping for ${sources.length} sources`);

      for (const source of sources) {
        try {
          await this.scrapeSource(source);
          console.log(`Successfully scraped ${source.name}`);
        } catch (error) {
          console.error(`Error scraping ${source.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in scrapeAllSources:', error);
    }
  }

  private async scrapeSource(source: Source): Promise<void> {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 30000,
      });

      const $ = cheerio.load(response.data);
      const articles = await this.extractArticles($, source);

      for (const article of articles) {
        try {
          // Check if article already exists
          const existingArticles = await storage.searchArticles(article.title);
          if (existingArticles.length > 0) {
            continue; // Skip if already exists
          }

          // Process with AI for summarization and categorization
          const processedArticle = await processArticleWithAI(article);
          
          // Save to storage
          await storage.createArticle(processedArticle);
          console.log(`Saved article: ${article.title}`);
        } catch (error) {
          console.error(`Error processing article "${article.title}":`, error);
        }
      }
    } catch (error) {
      console.error(`Error scraping source ${source.name}:`, error);
      throw error;
    }
  }

  private async extractArticles($: cheerio.CheerioAPI, source: Source): Promise<ScrapedArticle[]> {
    const articles: ScrapedArticle[] = [];
    
    try {
      // Extract article links from homepage
      const articleLinks = this.extractArticleLinks($, source);
      
      // Limit to prevent overwhelming the system
      const limitedLinks = articleLinks.slice(0, 10);
      
      for (const link of limitedLinks) {
        try {
          const articleData = await this.scrapeArticleContent(link, source);
          if (articleData) {
            articles.push(articleData);
          }
        } catch (error) {
          console.error(`Error scraping article ${link}:`, error);
        }
      }
    } catch (error) {
      console.error('Error extracting articles:', error);
    }

    return articles;
  }

  private extractArticleLinks($: cheerio.CheerioAPI, source: Source): string[] {
    const links: string[] = [];
    
    // Common selectors for article links
    const linkSelectors = [
      'a[href*="/noticia"]',
      'a[href*="/articulo"]',
      'a[href*="/news"]',
      'a[href*="/politica"]',
      'a[href*="/deportes"]',
      'a[href*="/economia"]',
      '.article-link',
      '.news-link',
      'h2 a',
      'h3 a',
      '.title a'
    ];

    linkSelectors.forEach(selector => {
      $(selector).each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const fullUrl = href.startsWith('http') 
            ? href 
            : new URL(href, source.baseUrl).href;
          
          if (this.isValidArticleUrl(fullUrl) && !links.includes(fullUrl)) {
            links.push(fullUrl);
          }
        }
      });
    });

    return links;
  }

  private isValidArticleUrl(url: string): boolean {
    // Filter out non-article URLs
    const excludePatterns = [
      '/categoria/',
      '/author/',
      '/tag/',
      '/page/',
      '/search/',
      '#',
      'javascript:',
      'mailto:',
      '.pdf',
      '.jpg',
      '.png',
      '.gif'
    ];

    return !excludePatterns.some(pattern => url.includes(pattern));
  }

  private async scrapeArticleContent(url: string, source: Source): Promise<ScrapedArticle | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
        },
        timeout: 20000,
      });

      const $ = cheerio.load(response.data);
      const selectors = source.selectors as any;

      // Extract title
      const title = this.extractText($, [
        selectors?.title,
        'h1',
        '.title',
        '.headline',
        '.article-title'
      ]);

      if (!title || title.length < 10) {
        return null; // Skip articles without proper titles
      }

      // Extract content
      const content = this.extractText($, [
        selectors?.content,
        '.article-content',
        '.content',
        '.article-body',
        '.post-content',
        'article p'
      ]);

      if (!content || content.length < 100) {
        return null; // Skip articles without substantial content
      }

      // Extract image
      const imageUrl = this.extractImage($, [
        selectors?.image,
        '.featured-image img',
        '.article-image img',
        'article img',
        '.main-image img'
      ], source.baseUrl);

      // Extract author
      const author = this.extractText($, [
        selectors?.author,
        '.author',
        '.byline',
        '.article-author',
        '.writer'
      ]) || 'Redacción';

      // Extract or estimate publish date
      const publishedAt = this.extractDate($, [
        selectors?.date,
        '.publish-date',
        '.article-date',
        'time',
        '.date'
      ]) || new Date();

      return {
        title: this.cleanText(title),
        content: this.cleanText(content),
        url,
        imageUrl,
        author: this.cleanText(author),
        publishedAt,
        sourceName: source.name,
      };
    } catch (error) {
      console.error(`Error scraping article content from ${url}:`, error);
      return null;
    }
  }

  private extractText($: cheerio.CheerioAPI, selectors: string[]): string {
    for (const selector of selectors) {
      if (!selector) continue;
      
      const element = $(selector).first();
      if (element.length > 0) {
        return element.text().trim();
      }
    }
    return '';
  }

  private extractImage($: cheerio.CheerioAPI, selectors: string[], baseUrl: string): string | undefined {
    for (const selector of selectors) {
      if (!selector) continue;
      
      const element = $(selector).first();
      if (element.length > 0) {
        const src = element.attr('src') || element.attr('data-src');
        if (src) {
          return src.startsWith('http') ? src : new URL(src, baseUrl).href;
        }
      }
    }
    return undefined;
  }

  private extractDate($: cheerio.CheerioAPI, selectors: string[]): Date | null {
    for (const selector of selectors) {
      if (!selector) continue;
      
      const element = $(selector).first();
      if (element.length > 0) {
        const dateText = element.text().trim() || element.attr('datetime');
        if (dateText) {
          const date = new Date(dateText);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
    }
    return null;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
  }
}

// Singleton instance
export const newsScraper = new NewsScraper();

// Auto-scraping functionality
export function startAutoScraping() {
  // Scrape immediately
  newsScraper.scrapeAllSources().catch(console.error);
  
  // Then scrape every 30 minutes
  setInterval(() => {
    newsScraper.scrapeAllSources().catch(console.error);
  }, 30 * 60 * 1000);
  
  console.log('Auto-scraping started - running every 30 minutes');
}
