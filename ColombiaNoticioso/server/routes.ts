import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";
import { startAutoScraping } from "./scraper";
import { generateNewsSummary } from "./ai-processor";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start auto-scraping when server starts
  startAutoScraping();

  // Get all articles with pagination and category filter
  app.get("/api/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      
      const articles = await storage.getArticles(limit, offset, category);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  // Get single article by ID and increment views
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Increment view count
      await storage.updateArticleViews(id);
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  // Get breaking news
  app.get("/api/breaking-news", async (req, res) => {
    try {
      const breakingNews = await storage.getBreakingNews();
      res.json(breakingNews);
    } catch (error) {
      console.error("Error fetching breaking news:", error);
      res.status(500).json({ message: "Error fetching breaking news" });
    }
  });

  // Get most read articles
  app.get("/api/most-read", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const mostRead = await storage.getMostRead(limit);
      res.json(mostRead);
    } catch (error) {
      console.error("Error fetching most read articles:", error);
      res.status(500).json({ message: "Error fetching most read articles" });
    }
  });

  // Search articles
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }

      const results = await storage.searchArticles(query);
      res.json(results);
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({ message: "Error searching articles" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  // Get trending topics
  app.get("/api/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const trending = await storage.getTrendingTopics(limit);
      res.json(trending);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      res.status(500).json({ message: "Error fetching trending topics" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData);
      res.json({ message: "Successfully subscribed to newsletter", subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email format", errors: error.errors });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  // Get weather data
  app.get("/api/weather", async (req, res) => {
    try {
      const weather = await storage.getWeatherData();
      res.json(weather);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Error fetching weather data" });
    }
  });

  // Generate AI summary of current news
  app.get("/api/ai-summary", async (req, res) => {
    try {
      const recentArticles = await storage.getArticles(10, 0);
      const titles = recentArticles.map(article => article.title);
      
      if (titles.length === 0) {
        return res.json({ summary: "No hay noticias disponibles para resumir." });
      }

      const summary = await generateNewsSummary(titles);
      res.json({ summary });
    } catch (error) {
      console.error("Error generating AI summary:", error);
      res.status(500).json({ message: "Error generating news summary" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
