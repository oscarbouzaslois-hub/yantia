# 🎭 EatyBlinders — Descubre recetas sin prejuicios

App web (PWA) en español para comedores exigentes. Cata ingredientes estilo *Tinder*, descubre qué recetas puedes hacer con lo que realmente te gusta, cocina paso a paso con temporizadores, planifica la semana y genera la lista de la compra automáticamente.

**Diseñada para comelonas**: Sin limitaciones. Sin "coma lo que le toque". Solo recetas que encajan con tus gustos reales (incluyendo matices: «tomate crudo no, frito sí»).

**100 % gratis de operar**: es un sitio estático sin backend. Los datos de cada persona se guardan en su propio dispositivo (localStorage). Sin base de datos, sin servidores, sin costes.

## 📱 Usar en el móvil
Abre la web y elige **«Añadir a pantalla de inicio»** (Compartir → Añadir a inicio en iOS; menú ⋮ → Instalar app en Android). Funciona offline tras la primera visita.

## 🚀 Desplegar tu propia copia (gratis)
- **Vercel**: importa el repo → Framework: *Other* → sin build → Output: raíz. Listo.
- **GitHub Pages**: Settings → Pages → Deploy from branch (`main`, `/root`).

## 🛠️ Stack
React 18 + lucide-react servidos por CDN (esm.sh) con import maps. Sin paso de build. Fotos de ingredientes: CDN público de Spoonacular con ficha ilustrada de respaldo.

## ⚙️ Características
- **Descubrir**: Cata ingredientes al estilo Tinder. Desliza left (no te va) / right (te gusta).
- **Recetas personalizadas**: Se desbloquean automáticamente conforme exploras más ingredientes. Desbloqueo exponencial: cuantos más ingredientes pruebes, más recetas descubrirás.
- **Múltiples métodos de cocción**: Recetas clásicas, con Thermomix o en airfryer. Elige el método que prefieras.
- **Recetas congelables**: Identifica qué platos puedes preparar en batch y congelar.
- **Matices**: Personaliza por forma de preparación («pollo asado», «pollo frito», etc.).
- **Planificador semanal**: Monta tu menú y genera automáticamente la lista de la compra.
- **Modo cocina**: Temporizadores integrados. Cocina sin mirar el móvil.
- **Logros**: Desbloquea insignias conforme exploras ingredientes y pruebas recetas.

## 📝 Licencia
GPL-3.0 — Úsala, cópiala y compártela libremente. Contribuciones bienvenidas.

---

**URL en vivo**: https://eatyblinders.vercel.app
