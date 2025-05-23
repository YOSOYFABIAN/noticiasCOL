import { Link } from "wouter";
import { CATEGORIES, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-playfair font-bold mb-4">
              Noticias<span className="text-brand-secondary">COL</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Tu fuente confiable de noticias colombianas con resúmenes inteligentes y 
              actualizaciones automáticas powered by AI.
            </p>
            <div className="flex space-x-3">
              <a 
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link 
                    href={`/category/${category.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Compañía</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/advertising" className="hover:text-white transition-colors">
                  Publicidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <a href="/rss" className="hover:text-white transition-colors">
                  RSS
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="text-gray-400 text-sm space-y-2">
              <p>
                <i className="fas fa-envelope mr-2"></i>
                {CONTACT_INFO.email}
              </p>
              <p>
                <i className="fas fa-phone mr-2"></i>
                {CONTACT_INFO.phone}
              </p>
              <p>
                <i className="fas fa-map-marker-alt mr-2"></i>
                {CONTACT_INFO.address}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} NoticiasCOL. Todos los derechos reservados. | 
            Powered by AI & Web Scraping
          </p>
        </div>
      </div>
    </footer>
  );
}
