import { useState, useEffect } from "react";
import { useBreakingNews } from "@/hooks/use-news";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Radio } from "lucide-react";

export function LiveTicker() {
  const { data: breakingNews } = useBreakingNews();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!breakingNews || breakingNews.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-playfair flex items-center">
          <Radio className="w-5 h-5 mr-2 animate-pulse" />
          EN VIVO
          <Badge variant="secondary" className="ml-2 bg-white text-red-600 text-xs">
            {currentTime.toLocaleTimeString('es-CO', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {breakingNews.slice(0, 3).map((news, index) => (
            <div key={news.id} className="flex items-start space-x-3 border-l-2 border-white/30 pl-3">
              <Badge variant="secondary" className="bg-white/20 text-white text-xs flex-shrink-0">
                {String(index + 1).padStart(2, '0')}
              </Badge>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium leading-tight line-clamp-2">{news.title}</h4>
                <div className="flex items-center text-xs opacity-75 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>
                    {new Date(news.publishedAt).toLocaleTimeString('es-CO', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}