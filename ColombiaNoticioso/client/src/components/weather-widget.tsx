import { useWeather } from "@/hooks/use-news";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, MapPin } from "lucide-react";

export function WeatherWidget() {
  const { data: weather, isLoading } = useWeather();

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="text-yellow-400" size={20} />;
      case 'cloud':
        return <Cloud className="text-gray-400" size={20} />;
      case 'cloud-sun':
        return <CloudRain className="text-blue-400" size={20} />;
      case 'rain':
        return <CloudRain className="text-blue-500" size={20} />;
      default:
        return <Sun className="text-yellow-400" size={20} />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 28) return "text-red-500";
    if (temp >= 20) return "text-orange-500";
    if (temp >= 15) return "text-yellow-500";
    return "text-blue-500";
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-playfair flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Clima en Colombia
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-5 h-5 bg-white/20 rounded" />
                  <Skeleton className="h-4 w-16 bg-white/20" />
                </div>
                <Skeleton className="h-4 w-12 bg-white/20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {weather?.map((city) => (
              <div key={city.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(city.icon)}
                  <span className="text-sm font-medium">{city.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${getTemperatureColor(city.temperature)}`}>
                    {city.temperature}°C
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && weather && weather.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/20">
            <p className="text-xs opacity-75 text-center">
              Actualizado hace {new Date().toLocaleTimeString('es-CO', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
        
        {!isLoading && (!weather || weather.length === 0) && (
          <div className="text-center py-4">
            <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-75">
              Información del clima no disponible
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
