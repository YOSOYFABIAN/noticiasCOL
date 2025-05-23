import { useTrendingTopics } from "@/hooks/use-news";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Hash } from "lucide-react";

export function TrendingTopics() {
  const { data: trending, isLoading } = useTrendingTopics(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-playfair">
          <TrendingUp className="w-5 h-5 mr-2 text-brand-primary" />
          Tendencias en Colombia
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trending?.map((topic, index) => (
              <div 
                key={topic.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Badge 
                  variant="secondary" 
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-brand-primary text-white"
                >
                  {index + 1}
                </Badge>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <Hash className="w-4 h-4 mr-1 text-gray-400" />
                    {topic.hashtag.replace('#', '')}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>{topic.count.toLocaleString()} menciones</span>
                    {topic.category && (
                      <>
                        <span>•</span>
                        <span>{topic.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && (!trending || trending.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <Hash className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay tendencias disponibles en este momento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
