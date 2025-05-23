import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  author: text("author"),
  sourceUrl: text("source_url").notNull(),
  sourceName: text("source_name").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  scrapedAt: timestamp("scraped_at").defaultNow().notNull(),
  views: integer("views").default(0).notNull(),
  isBreaking: boolean("is_breaking").default(false).notNull(),
  tags: text("tags").array(),
  readTime: integer("read_time"), // in minutes
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const trendingTopics = pgTable("trending_topics", {
  id: serial("id").primaryKey(),
  hashtag: text("hashtag").notNull(),
  count: integer("count").notNull(),
  category: text("category"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  temperature: integer("temperature").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  baseUrl: text("base_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastScraped: timestamp("last_scraped"),
  selectors: json("selectors"), // JSON object with CSS selectors
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  scrapedAt: true,
  views: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  subscribedAt: true,
});

export const insertTrendingTopicSchema = createInsertSchema(trendingTopics).omit({
  id: true,
  updatedAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  updatedAt: true,
});

export const insertSourceSchema = createInsertSchema(sources).omit({
  id: true,
  lastScraped: true,
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type TrendingTopic = typeof trendingTopics.$inferSelect;
export type InsertTrendingTopic = z.infer<typeof insertTrendingTopicSchema>;
export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type Source = typeof sources.$inferSelect;
export type InsertSource = z.infer<typeof insertSourceSchema>;
