import OpenAI from "openai";
import type { InsertArticle } from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.API_KEY || "default_key"
});

interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
  sourceName: string;
}

interface ProcessedArticleData {
  summary: string;
  category: string;
  tags: string[];
  readTime: number;
  isBreaking: boolean;
}

export async function processArticleWithAI(scrapedArticle: ScrapedArticle): Promise<InsertArticle> {
  try {
    const processedData = await analyzeArticleContent(scrapedArticle.content, scrapedArticle.title);
    
    const insertArticle: InsertArticle = {
      title: scrapedArticle.title,
      content: scrapedArticle.content,
      summary: processedData.summary,
      category: processedData.category,
      author: scrapedArticle.author || 'Redacción',
      sourceUrl: scrapedArticle.url,
      sourceName: scrapedArticle.sourceName,
      imageUrl: scrapedArticle.imageUrl,
      publishedAt: scrapedArticle.publishedAt,
      isBreaking: processedData.isBreaking,
      tags: processedData.tags,
      readTime: processedData.readTime,
    };

    return insertArticle;
  } catch (error) {
    console.error('Error processing article with AI:', error);
    
    // Fallback processing without AI
    return {
      title: scrapedArticle.title,
      content: scrapedArticle.content,
      summary: generateFallbackSummary(scrapedArticle.content),
      category: inferCategoryFromTitle(scrapedArticle.title),
      author: scrapedArticle.author || 'Redacción',
      sourceUrl: scrapedArticle.url,
      sourceName: scrapedArticle.sourceName,
      imageUrl: scrapedArticle.imageUrl,
      publishedAt: scrapedArticle.publishedAt,
      isBreaking: false,
      tags: [],
      readTime: estimateReadTime(scrapedArticle.content),
    };
  }
}

async function analyzeArticleContent(content: string, title: string): Promise<ProcessedArticleData> {
  const prompt = `
Analiza el siguiente artículo de noticias colombianas y proporciona:

1. Un resumen conciso de 2-3 oraciones que capture los puntos principales
2. La categoría más apropiada (debe ser una de: Política, Deportes, Entretenimiento, Economía, Tecnología, Cultura)
3. Tags relevantes (máximo 5)
4. Si es noticia de última hora (breaking news)
5. Tiempo estimado de lectura en minutos

Título: ${title}

Contenido: ${content.substring(0, 3000)}

Responde en formato JSON con esta estructura exacta:
{
  "summary": "Resumen del artículo",
  "category": "Categoría",
  "tags": ["tag1", "tag2", "tag3"],
  "isBreaking": false,
  "readTime": 3
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un experto en análisis de noticias colombianas. Analiza el contenido y proporciona un resumen, categorización y metadata precisos. Responde siempre en formato JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || generateFallbackSummary(content),
      category: validateCategory(result.category) || "Política",
      tags: Array.isArray(result.tags) ? result.tags.slice(0, 5) : [],
      readTime: typeof result.readTime === 'number' ? result.readTime : estimateReadTime(content),
      isBreaking: Boolean(result.isBreaking),
    };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    throw error;
  }
}

export async function generateNewsSummary(articles: string[]): Promise<string> {
  try {
    const prompt = `
Genera un resumen ejecutivo de las noticias más importantes de Colombia basado en los siguientes titulares:

${articles.join('\n')}

El resumen debe ser:
- Máximo 3 párrafos
- Enfocado en los temas más relevantes
- Con un tono periodístico profesional
- Destacando tendencias y conexiones entre las noticias

Responde en formato JSON:
{
  "summary": "Tu resumen aquí"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un analista de noticias experto en Colombia. Genera resúmenes concisos y informativos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.summary || "No hay suficiente información para generar un resumen.";
  } catch (error) {
    console.error('Error generating news summary:', error);
    return "Error generando resumen de noticias.";
  }
}

function generateFallbackSummary(content: string): string {
  // Extract first two sentences as summary
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 2).join('. ').trim() + '.';
}

function validateCategory(category: string): string | null {
  const validCategories = ['Política', 'Deportes', 'Entretenimiento', 'Economía', 'Tecnología', 'Cultura'];
  return validCategories.includes(category) ? category : null;
}

function inferCategoryFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('gobierno') || titleLower.includes('presidente') || titleLower.includes('congreso') || titleLower.includes('política')) {
    return 'Política';
  }
  if (titleLower.includes('fútbol') || titleLower.includes('deportes') || titleLower.includes('selección') || titleLower.includes('liga')) {
    return 'Deportes';
  }
  if (titleLower.includes('economía') || titleLower.includes('peso') || titleLower.includes('inflación') || titleLower.includes('banco')) {
    return 'Economía';
  }
  if (titleLower.includes('tecnología') || titleLower.includes('digital') || titleLower.includes('startup')) {
    return 'Tecnología';
  }
  if (titleLower.includes('cultura') || titleLower.includes('festival') || titleLower.includes('arte')) {
    return 'Cultura';
  }
  if (titleLower.includes('entretenimiento') || titleLower.includes('famoso') || titleLower.includes('actor')) {
    return 'Entretenimiento';
  }
  
  return 'Política'; // Default category
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}
