# NoticiasCOL - Plataforma de Noticias Colombianas con IA

Una plataforma completa de agregación y publicación de noticias automática enfocada en Colombia. Utiliza web scraping para recopilar artículos de fuentes confiables colombianas, con tecnología de IA de OpenAI para generar resúmenes concisos.

## 🚀 Características

- **Web Scraping Automático**: Recopila noticias de fuentes colombianas confiables
- **IA de OpenAI**: Genera resúmenes automáticos y procesa contenido
- **Categorías Múltiples**: Política, Deportes, Entretenimiento, Cultura, Tecnología, Economía
- **Google AdSense**: Monetización completa integrada
- **Diseño Responsivo**: Optimizado para móviles y escritorio
- **SEO Optimizado**: Configurado para Google News
- **Live Ticker**: Noticias en tiempo real
- **Feed de Redes Sociales**: Integración social
- **Newsletter**: Sistema de suscripción
- **Tendencias**: Temas más populares

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter
- **Backend**: Node.js, Express, TypeScript
- **IA**: OpenAI GPT-4o
- **Scraping**: Cheerio, Axios
- **UI**: shadcn/ui components
- **Íconos**: Lucide React
- **Build**: Vite

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repositorio>
cd noticiasCOL
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
# Crea un archivo .env con:
OPENAI_API_KEY=tu_openai_api_key_aqui
```

4. **Ejecuta en desarrollo**
```bash
npm run dev
```

## 🌐 Deploy en Netlify

### Opción 1: Deploy Automático desde Git

1. **Sube tu código a GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conecta con Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Haz clic en "New site from Git"
   - Conecta tu repositorio GitHub
   - Configura:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Configura Variables de Entorno en Netlify**
   - Ve a Site settings → Environment variables
   - Agrega: `OPENAI_API_KEY` con tu clave de OpenAI

### Opción 2: Deploy Manual

1. **Construye el proyecto**
```bash
npm run build:netlify
```

2. **Sube la carpeta `dist` a Netlify**
   - Arrastra la carpeta `dist` a netlify.com/drop

## 🔧 Configuración

### Variables de Entorno

```env
# Requeridas para producción
OPENAI_API_KEY=sk-...        # Tu clave de OpenAI API

# Opcional (ya configurado)
VITE_ADSENSE_CLIENT=ca-pub-7272644636473162
```

### Fuentes de Noticias Configuradas

- **El Tiempo** (eltiempo.com)
- **Revista Semana** (semana.com)
- **El Colombiano** (elcolombiano.com)
- **Caracol Radio** (caracol.com.co)

## 📱 Características del Frontend

### Componentes Principales

- **Header**: Navegación y logo
- **Live Ticker**: Noticias en vivo
- **Article Cards**: Tarjetas de artículos con imágenes
- **Sidebar**: Tendencias, clima, más leídos
- **Social Feed**: Integración de redes sociales
- **Newsletter**: Suscripción automática
- **Footer**: Enlaces y información

### Páginas

- **Home** (`/`): Página principal con todas las noticias
- **Categoría** (`/categoria/[slug]`): Noticias por categoría
- **Artículo** (`/articulo/[id]`): Vista detallada del artículo
- **Búsqueda** (`/buscar`): Resultados de búsqueda

## 🤖 IA y Procesamiento

### Funcionalidades de IA

- **Resúmenes Automáticos**: Genera resúmenes concisos de artículos
- **Categorización**: Clasifica artículos automáticamente
- **Análisis de Sentimiento**: Detecta noticias de última hora
- **Extracción de Tags**: Genera etiquetas relevantes
- **Tiempo de Lectura**: Calcula tiempo estimado de lectura

### Procesamiento de Contenido

```javascript
// Ejemplo de procesamiento con IA
const processedArticle = await processArticleWithAI({
  title: "Título del artículo",
  content: "Contenido completo...",
  url: "https://fuente.com/articulo",
  sourceName: "El Tiempo"
});
```

## 💰 Monetización

### Google AdSense Integrado

- **Banner Ads**: En header y entre contenido
- **Sidebar Ads**: En barra lateral
- **Mobile Ads**: Optimizados para móviles
- **Client ID**: `ca-pub-7272644636473162`

## 🔍 SEO y Google News

### Optimizaciones SEO

- Meta tags dinámicos
- Open Graph para redes sociales
- Estructura semántica HTML5
- URLs amigables
- Sitemap automático
- Schema markup para artículos

### Configuración Google News

- RSS feeds automáticos
- Estructura de URLs optimizada
- Metadatos de artículos
- Fechas y autores estructurados

## 📊 APIs Disponibles

### Endpoints del Backend

```
GET /api/articles              # Obtener artículos
GET /api/articles/:id          # Artículo específico
GET /api/breaking-news         # Noticias de última hora
GET /api/categories            # Categorías disponibles
GET /api/trending              # Temas trending
GET /api/search?q=query        # Búsqueda de artículos
GET /api/most-read             # Más leídos
GET /api/weather               # Datos del clima
POST /api/newsletter           # Suscripción newsletter
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Test de cobertura
npm run test:coverage
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run build:netlify # Build optimizado para Netlify
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 🔧 Estructura del Proyecto

```
noticiasCOL/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilidades y configuración
├── server/                 # Backend Node.js
│   ├── routes.ts           # Rutas de la API
│   ├── scraper.ts          # Web scraping
│   ├── ai-processor.ts     # Procesamiento con IA
│   └── storage.ts          # Almacenamiento de datos
├── shared/                 # Tipos compartidos
└── dist/                   # Build de producción
```

## 🤝 Contribución

1. Fork del proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

## 🎯 Roadmap

- [ ] App móvil React Native
- [ ] Notificaciones push
- [ ] API pública para desarrolladores
- [ ] Dashboard de analytics
- [ ] Integración con más fuentes
- [ ] Comentarios de usuarios
- [ ] Sistema de favoritos

---

**NoticiasCOL** - La plataforma de noticias colombianas más completa y moderna. 🇨🇴