import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Instagram, ExternalLink } from "lucide-react";

export function SocialFeed() {
  const socialPosts = [
    {
      id: 1,
      platform: "twitter",
      author: "@NoticiasCOL",
      content: "🔴 ÚLTIMA HORA: Presidente anuncia nuevas medidas económicas para impulsar el empleo en Colombia #EconomíaColombia",
      time: "hace 15 min",
      likes: 234,
      shares: 89
    },
    {
      id: 2,
      platform: "facebook",
      author: "NoticiasCOL",
      content: "⚽ ¡Colombia clasificó al Mundial Sub-20! Tremendo partido contra Argentina 🇨🇴🆚🇦🇷",
      time: "hace 2 horas",
      likes: 1523,
      shares: 456
    },
    {
      id: 3,
      platform: "instagram",
      author: "@noticiascol",
      content: "🎬 Festival de Cine de Cartagena 2025 ya tiene su programación completa. ¡No te pierdas esta experiencia única!",
      time: "hace 4 horas",
      likes: 892,
      shares: 123
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-playfair flex items-center">
          <Twitter className="w-5 h-5 mr-2 text-blue-400" />
          Redes Sociales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {socialPosts.map((post) => (
            <div key={post.id} className="border-l-2 border-gray-200 pl-3 pb-3">
              <div className="flex items-center space-x-2 mb-2">
                {getPlatformIcon(post.platform)}
                <span className="font-medium text-sm">{post.author}</span>
                <span className="text-xs text-gray-500">{post.time}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {post.content}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>❤️ {post.likes}</span>
                <span>🔄 {post.shares}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-3">Síguenos en redes sociales:</p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Twitter className="w-4 h-4 mr-1" />
              Twitter
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Facebook className="w-4 h-4 mr-1" />
              Facebook
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Instagram className="w-4 h-4 mr-1" />
              Instagram
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}