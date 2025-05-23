#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Construyendo NoticiasCOL para Netlify...');

// Crear directorio build si no existe
if (!fs.existsSync('build')) {
  fs.mkdirSync('build');
}

// Construir el frontend
console.log('📦 Construyendo frontend...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error construyendo frontend:', error.message);
  process.exit(1);
}

// Crear archivo _redirects para Netlify
console.log('🔧 Configurando redirects para SPA...');
const redirectsContent = `/*    /index.html   200`;
fs.writeFileSync('dist/_redirects', redirectsContent);

// Crear archivo de configuración de Netlify
console.log('⚙️ Creando netlify.toml...');
const netlifyConfig = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`;

fs.writeFileSync('netlify.toml', netlifyConfig);

console.log('✅ Build completado. Archivos listos para Netlify en la carpeta dist/');
console.log('📋 Próximos pasos:');
console.log('   1. Sube la carpeta del proyecto a tu repositorio Git');
console.log('   2. Conecta tu repositorio con Netlify');
console.log('   3. Configura las variables de entorno en Netlify');
console.log('   4. ¡Deploy automático!');