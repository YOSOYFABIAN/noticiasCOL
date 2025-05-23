import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, SOCIAL_LINKS } from "@/lib/constants";
import { useSearchArticles } from "@/hooks/use-news";
import { NewsletterSignup } from "./newsletter-signup";

export function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: searchResults } = useSearchArticles(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-brand-primary text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>{getCurrentDate()}</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Bogotá: 18°C</span>
          </div>
          <div className="flex items-center space-x-3">
            <a 
              href={SOCIAL_LINKS.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href={SOCIAL_LINKS.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href={SOCIAL_LINKS.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href={SOCIAL_LINKS.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-brand-primary">
              Noticias<span className="text-brand-secondary">COL</span>
            </h1>
            <Badge variant="destructive" className="ml-2 bg-brand-accent text-white">
              LIVE
            </Badge>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar noticias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {searchQuery && searchResults && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 5).map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.id}`}
                      className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{article.category}</p>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    No se encontraron resultados
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Newsletter Button - Desktop */}
          <div className="hidden lg:block">
            <NewsletterSignup>
              <Button className="bg-brand-secondary text-white hover:bg-red-700">
                <i className="fas fa-envelope mr-2"></i>
                Suscríbete
              </Button>
            </NewsletterSignup>
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Buscar noticias..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full px-3"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  <Link 
                    href="/" 
                    className="py-2 px-3 rounded hover:bg-gray-100 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="py-2 px-3 rounded hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Newsletter */}
                <div className="pt-4 border-t">
                  <NewsletterSignup>
                    <Button className="w-full bg-brand-secondary text-white hover:bg-red-700">
                      <i className="fas fa-envelope mr-2"></i>
                      Suscríbete al Newsletter
                    </Button>
                  </NewsletterSignup>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto md:overflow-visible space-x-8 py-3">
            <li>
              <Link 
                href="/" 
                className={`hover:text-gray-200 transition-colors whitespace-nowrap font-medium ${
                  location === "/" ? "text-yellow-300" : ""
                }`}
              >
                Inicio
              </Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className={`hover:text-gray-200 transition-colors whitespace-nowrap ${
                    location === `/category/${category.slug}` ? "text-yellow-300" : ""
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
