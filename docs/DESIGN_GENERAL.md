# DESIGN_GENERAL.md — Guía Maestra Universal de Diseño Apple HIG, Frontend Moderno, SEO y Rendimiento
> **Estándar Universal de Diseño Visual, Experiencia de Usuario (UI/UX) y Arquitectura de Frontend**  
> **Inspiración:** Apple Human Interface Guidelines (HIG), iPhone Duo, iOS 26/27, macOS & Fluid Interface Design  
> **Autor:** Johan Vasquez  
> **Ámbito:** Proyectos Personales, Aplicaciones Web Modernas, Plataformas SaaS y Productos Digitales  
> **Versión:** 1.0.0 (Universal)  

---

## 🧭 1. Manifiesto: El Nivel de Excelencia Apple

> *"No se trata únicamente de hacer que las cosas se vean bonitas. Se trata de cómo la gente se siente al interactuar con ellas, de cómo se mueven los elementos en la pantalla y de esa obsesión implacable por el detalle que distingue a un producto extraordinario de uno común."*

Esta guía compila los estándares estéticos, principios de interacción, librerías modernas de animación, optimizaciones de SEO técnico y patrones de cero latencia para construir interfaces de nivel mundial en cualquier proyecto personal o independiente.

---

## 📐 2. Los 8 Principios Esenciales de Apple HIG

### 2.1. Cero Bordes Visibles (*Zero Visible Borders*)
- **Filosofía:** Apple no recurre a bordes sólidos de `1px` para separar secciones. La separación y el volumen se logran mediante:
  1. **Luz Especular Superior (*Top Inset Highlight*):** Una línea interior semitransparente que simula luz física incidiendo desde arriba:
     ```css
     box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
     ```
  2. **Sombras Difusas Escalonadas (*Layered Ambient Shadows*):** Sombras multinivel con desenfoques amplios (blur de 20px a 40px) y baja opacidad (4% a 10%).
  3. **Aro Translúcido Sutil (*Subtle Ring*):** En lugar de un borde tosco, un contorno casi invisible `ring-1 ring-black/5` (en modo claro) o `ring-1 ring-white/10` (en modo oscuro).

### 2.2. Jerarquía de Esquinas Redondeadas (*Continuous Squircles*)
No usar el mismo radio en todos lados. Seguir la jerarquía armónica concéntrica:
- **Hero Pills / Dynamic Islands / Elementos Flotantes:** `rounded-[54px]` o `rounded-full` (9999px).
- **Tarjetas Principales y Paneles Modales:** `rounded-[22px]` a `rounded-[24px]`.
- **Botones de Acción, Formularios e Inputs:** `rounded-[12px]` a `rounded-[14px]`.
- **Insignias (Badges), Chips y Avatares:** `rounded-full` (50%).

### 2.3. Tipografía con Espaciado Negativo (*Negative Tracking*)
- **Fuentes Recomendadas:** Inter Tight, SF Pro Display / Text, Geist Sans, Apple SD Gothic Neo.
- **Régimen de Kerning:** Los encabezados grandes (`text-4xl`, `text-5xl`, `text-6xl`) **deben llevar tracking negativo** (`letter-spacing: -0.7px` a `-0.9px` o `-0.03em`) para lograr esa densidad editorial inconfundible de Apple.
- **Jerarquía de Pesos:** Títulos en `font-bold` (700) o `font-semibold` (600); textos de apoyo en `font-normal` (400) o `font-medium` (500) con tonos tenues (`text-neutral-500` / `text-neutral-400`).

### 2.4. Micro-interacciones Táctiles y Físicas
- Ningún botón debe reaccionar de golpe. Toda acción responde con física de resorte (*spring physics*):
  - **Hover:** Elevación suave (`scale: 1.02`, `y: -1px`).
  - **Tap / Active:** Contracción elástica natural (`scale: 0.96` a `0.98`).
  - **Cursor:** `cursor-pointer` con feedback inmediato.

### 2.5. Deferencia y Contraste Visual
- La interfaz debe dar un paso atrás para que el contenido sea el protagonista.
- Fondos claros usan blancos puros (`#ffffff`) o grises satinados (`#f5f5f7`).
- Fondos oscuros usan negros profundos (`#000000`) o grises carbón (`#0d0d0f`), complementados con desenfoque de cristal esmerilado (*frosted glass*).

### 2.6. Cristal Translúcido Esmerilado (*Vibrancy & Frosted Glass*)
- Uso elegante de `backdrop-blur-xl` o `backdrop-blur-2xl` combinado con colores de fondo semitransparentes (`bg-white/70` o `bg-black/60`).

### 2.7. Ritmo Espacial (Sistema de Rejilla de 8 Puntos)
- Los márgenes, rellenos y separaciones deben ser múltiplos de 4 u 8 píxeles: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px), `gap-3` (12px), `gap-6` (24px).

### 2.8. Profundidad Espacial Coherente
- Elementos jerárquicos flotan sobre el plano principal. Los modales, islas de comandos y hojas de acción proyectan sombras más amplias y desenfocadas conforme se acercan al usuario en el eje Z.

---

## ⚡ 3. Stack Tecnológico de Vanguardia

Para lograr este nivel de acabado visual sin sacrificar fluidez de 60/120 FPS:

| Capa | Herramienta / Librería | Propósito |
| :--- | :--- | :--- |
| **Framework Base** | **React 18/19** o **Next.js (App Router)** | Renderizado reactivo, Server Components y arquitectura modular. |
| **Motor de Estilos** | **Tailwind CSS (v3 / v4)** | Utilidades atómicas, variables CSS y diseño responsivo fluido. |
| **Componentes Accesibles** | **shadcn/ui** + **Radix UI** | Primitivas accesibles sin estilos rígidos preconcebidos (WAI-ARIA). |
| **Física de Resortes** | **Framer Motion** | Animaciones de layout declarativas con resortes elásticos (*springs*). |
| **Animación Cinematográfica** | **GSAP** + **Flip Plugin** | Secuencias complejas, transiciones de vistas y micro-animaciones de alto rendimiento. |
| **Desplazamiento Suave** | **Lenis Scroll** (`@studio-freight/lenis`) | Desplazamiento ultra suave con aceleración inercial tipo macOS. |
| **Iconografía** | **Lucide React** o **SF Symbols** | Iconos vectoriales limpios, con trazo uniforme de 1.5px a 2px. |
| **Búsqueda Instantánea** | **uFuzzy** / **Fuse.js** | Búsqueda difusa en memoria con latencias <5 milisegundos. |
| **Virtualización de Listas** | **@tanstack/react-virtual** | Renderizado de miles de elementos sin degradar el DOM ni la RAM. |

---

## 🧩 4. Recetas de Componentes Listas para Usar (TypeScript + Tailwind)

### 4.1. Tarjeta Apple Hero sin Bordes Visibles (`AppleHeroCard.tsx`)
```tsx
import React from "react";
import { motion } from "framer-motion";

interface AppleHeroCardProps {
  title: string;
  subtitle: string;
  tag?: string;
  children?: React.ReactNode;
}

export const AppleHeroCard: React.FC<AppleHeroCardProps> = ({
  title,
  subtitle,
  tag,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-[22px] bg-white p-7 text-neutral-900 
                 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_20px_48px_-12px_rgba(0,0,0,0.08)]
                 ring-1 ring-black/5 dark:bg-[#121214] dark:text-white dark:ring-white/10"
      style={{
        // Luz especular superior de Apple
        boxShadow:
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 20px 48px -12px rgba(0,0,0,0.08)",
      }}
    >
      {/* Resplandor ambiental de fondo */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />

      {tag && (
        <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold tracking-wide text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {tag}
        </span>
      )}

      <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>
      <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
        {subtitle}
      </p>

      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
};
```

---

### 4.2. Botón Píldora Interactivo con Resorte (`ApplePillButton.tsx`)
```tsx
import React from "react";
import { motion } from "framer-motion";

interface ApplePillButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "glass";
  icon?: React.ReactNode;
}

export const ApplePillButton: React.FC<ApplePillButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  icon,
}) => {
  const variantStyles = {
    primary:
      "bg-neutral-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_20px_-6px_rgba(0,0,0,0.25)] hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100",
    secondary:
      "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
    glass:
      "bg-white/70 text-neutral-900 backdrop-blur-xl ring-1 ring-black/5 hover:bg-white/90 dark:bg-black/60 dark:text-white dark:ring-white/10 dark:hover:bg-black/80",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-colors ${variantStyles[variant]}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </motion.button>
  );
};
```

---

### 4.3. Isla de Comandos Flotante (*Dynamic Island Pill*)
```tsx
import React from "react";
import { motion } from "framer-motion";

interface ActionIslandProps {
  activeCount: number;
  label: string;
  children?: React.ReactNode;
}

export const DynamicActionIsland: React.FC<ActionIslandProps> = ({
  activeCount,
  label,
  children,
}) => {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-4 
                 rounded-full bg-neutral-950/85 px-6 py-3 text-white backdrop-blur-2xl 
                 shadow-[0_12px_36px_rgba(0,0,0,0.35)] ring-1 ring-white/15"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold tracking-wide text-neutral-300">
          {activeCount} {label}
        </span>
      </div>

      <div className="h-4 w-px bg-white/20" />

      <div className="flex items-center gap-2">{children}</div>
    </motion.div>
  );
};
```

---

## 🔍 5. Optimización SEO Técnico y Búsqueda Ultrarrápida (<5ms)

### 5.1. Búsqueda en Tiempo Real en Cliente (Zero-Lag Search)
Para colecciones de hasta 20,000 elementos, filtrar en el cliente utilizando un algoritmo difuso optimizado como `uFuzzy` para obtener resultados en menos de 5 milisegundos sin llamadas al servidor:

```typescript
// utils/search.ts
import uFuzzy from "@leeoniya/ufuzzy";

const uf = new uFuzzy({
  intraMode: 1,      // Tolerancia a typos leves
  intraChars: "[a-z\\d]",
});

export function instantSearch<T>(
  query: string,
  haystack: string[],
  items: T[]
): T[] {
  if (!query.trim()) return items;
  
  const [haystackIdxs, exactMatches, order] = uf.search(haystack, query);
  if (!order || order.length === 0) return [];
  
  // Retorna elementos ordenados por relevancia en <5ms
  return order.map((idx) => items[haystackIdxs[idx]]);
}
```

### 5.2. Checklist de SEO Técnico de Nivel Mundial
1. **Schema.org JSON-LD:** Incluir datos estructurados semánticos en el `<head>` para que Google indexe la página con *Rich Snippets*:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "SoftwareApplication",
     "name": "Mi Proyecto",
     "operatingSystem": "Web",
     "applicationCategory": "ProductivityApplication",
     "offers": {
       "@type": "Offer",
       "price": "0.00",
       "priceCurrency": "USD"
     }
   }
   ```
2. **Open Graph & Twitter Cards:** Configurar imágenes de vista previa de alta fidelidad (`og:image` de 1200x630px con esquinas nítidas y tipografía limpia).
3. **Core Web Vitals Inquebrantables:**
   - **LCP (Largest Contentful Paint):** `< 1.2s`
   - **INP (Interaction to Next Paint):** `< 45ms`
   - **CLS (Cumulative Layout Shift):** `0.000` (sin saltos visuales al cargar fuentes o imágenes).
4. **URLs Canónicas y Sitemaps:** Generación automática de `sitemap.xml` y `robots.txt`.

---

## 🚀 6. Arquitectura Zero-Lag y Rendimiento Máximo

Para mantener 60/120 FPS constantes sin congelamientos de pantalla:

1. **Virtualización de Listas Extensas:**  
   Si una vista despliega más de 100 elementos o filas de tabla, renderizar únicamente los nodos visibles en pantalla mediante `@tanstack/react-virtual`:
   ```tsx
   import { useVirtualizer } from "@tanstack/react-virtual";
   // Solo monta los elementos visibles en el viewport; consumo de DOM constante.
   ```
2. **Formato de Imágenes de Próxima Generación:**  
   Convertir todo recurso gráfico a **AVIF** (con fallback a **WebP**). Ahorro de ancho de banda del 60-80% frente a JPEG/PNG estándar.
3. **Subsetting y Precarga de Tipografías:**  
   Cargar únicamente los glifos latinos necesarios (`unicode-range`), usando `font-display: swap;` para evitar parpadeos de texto invisible (FOIT).
4. **Code-Splitting y Dynamic Imports:**  
   Cargar componentes pesados (gráficos, escáneres de cámara, modales complejos) mediante importación diferida:
   ```tsx
   const HeavyModal = React.lazy(() => import("./HeavyModal"));
   ```

---

## 📋 7. Guía de Adopción Rápida para Nuevos Proyectos

Para trasladar este sistema de diseño a cualquier nuevo proyecto personal:
1. Copiar este archivo como `DESIGN.md` o `APPLE_DESIGN.md` en la raíz del nuevo repositorio.
2. Instalar el paquete de utilidades:
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   ```
3. Configurar en `tailwind.config.js` los radios squircle personalizados:
   ```js
   borderRadius: {
     'hero': '54px',
     'card': '22px',
     'control': '12px',
   }
   ```
4. Aplicar el principio de **cero bordes visibles** con luz especular `inset 0 1px 0 rgba(255,255,255,0.2)` y tracking negativo en encabezados.
