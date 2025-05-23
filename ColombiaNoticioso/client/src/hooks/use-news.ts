import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS, REFRESH_INTERVALS } from "@/lib/constants";
import type { Article, Category, TrendingTopic, WeatherData } from "@shared/schema";

export function useArticles(category?: string, limit = 20, offset = 0) {
  return useQuery({
    queryKey: [API_ENDPOINTS.articles, { category, limit, offset }],
    refetchInterval: REFRESH_INTERVALS.articles,
    staleTime: REFRESH_INTERVALS.articles / 2,
  });
}

export function useArticle(id: number) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: [API_ENDPOINTS.articles, id],
    enabled: !!id,
  });

  // Increment view count when article is fetched
  const incrementViews = useMutation({
    mutationFn: async () => {
      // The API automatically increments views when fetching by ID
      return apiRequest("GET", `${API_ENDPOINTS.articles}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.mostRead] });
    },
  });

  return {
    ...query,
    incrementViews: incrementViews.mutate,
  };
}

export function useBreakingNews() {
  return useQuery({
    queryKey: [API_ENDPOINTS.breakingNews],
    refetchInterval: REFRESH_INTERVALS.breakingNews,
    staleTime: REFRESH_INTERVALS.breakingNews / 2,
  });
}

export function useMostRead(limit = 10) {
  return useQuery({
    queryKey: [API_ENDPOINTS.mostRead, { limit }],
    refetchInterval: REFRESH_INTERVALS.articles,
    staleTime: REFRESH_INTERVALS.articles / 2,
  });
}

export function useSearchArticles(query: string) {
  return useQuery({
    queryKey: [API_ENDPOINTS.search, { q: query }],
    enabled: query.length >= 2,
    staleTime: 60000, // 1 minute
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [API_ENDPOINTS.categories],
    staleTime: Infinity, // Categories rarely change
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: [API_ENDPOINTS.categories, slug],
    enabled: !!slug,
    staleTime: Infinity,
  });
}

export function useTrendingTopics(limit = 10) {
  return useQuery({
    queryKey: [API_ENDPOINTS.trending, { limit }],
    refetchInterval: REFRESH_INTERVALS.trending,
    staleTime: REFRESH_INTERVALS.trending / 2,
  });
}

export function useWeather() {
  return useQuery({
    queryKey: [API_ENDPOINTS.weather],
    refetchInterval: REFRESH_INTERVALS.weather,
    staleTime: REFRESH_INTERVALS.weather / 2,
  });
}

export function useAISummary() {
  return useQuery({
    queryKey: [API_ENDPOINTS.aiSummary],
    refetchInterval: REFRESH_INTERVALS.articles,
    staleTime: REFRESH_INTERVALS.articles / 2,
  });
}

export function useNewsletterSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", API_ENDPOINTS.newsletter, { email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.newsletter] });
    },
  });
}
