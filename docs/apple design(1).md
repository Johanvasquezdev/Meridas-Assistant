# Apple Human Interface & System Design Guide — Blue Hawk
> **Documento Maestro de Diseño de Experiencia, Tokens Visuales y Filosofía de Producto**  
> **Inspirado en:** Apple Human Interface Guidelines (HIG), iPhone Duo, iOS Design System & Preflight  
> **Proyecto:** Blue Hawk Inventory System  
> **Versión:** 1.0.0 (2026)  

---

![Apple Design Principles & Visual Hierarchy](/C:/Users/johan/.gemini/antigravity/brain/ad0308ff-fe23-450d-9f66-fb39a10106a0/.user_uploaded/media_1789396016151.png)

---

## 1. La Filosofía: "¿Por Qué lo Hicieron de Esta Manera?"

> *"Apple es una compañía que sobresale en diseño no solo porque hace que las cosas se vean bonitas, sino porque piensa con obsesión implacable en cómo las personas van a **sentir** y **moverse** dentro de la interfaz."*

En **Blue Hawk Inventory**, el diseño no es decoración superficial: es **claridad operativa, velocidad táctil y reducción del error humano** en ambientes de alta exigencia técnica (racks de servidores, bodegas de telecomunicaciones, inspección de campo y escritorios administrativos).

Al estudiar la arquitectura visual de Apple (desde iOS hasta el concepto de pantalla extendida del iPhone Duo):
- No copiamos pantallas estáticas; **adoptamos la intención detrás de cada decisión**.
- Cada radio de curvatura (*squircle*), cada microespacio de 4px, cada sombra difusa y cada milisegundo de rebote táctil existe para responder a una necesidad cognitiva concreta.

---

## 2. Los 8 Principios Fundamentales (Apple HIG)

| Principio | Directiva Central | Aplicación en Blue Hawk Inventory |
| :--- | :--- | :--- |
| **1. Propósito (*Purpose*)** | Hacer algo significativo y enfocado. | La app existe para inventariar y auditar sin fricción. Escanear un serial con IA toma menos de 3 segundos. |
| **2. Agencia (*Agency*)** | Permitir que el usuario actúe con libertad. | El operador puede elegir entre confirmación humana o modo automático. Todo error tiene botón de escape o deshacer. |
| **3. Responsabilidad (*Responsibility*)** | Actuar en beneficio del usuario y la empresa. | Trazabilidad inmutable (`audit_logs`), política estricta de 15 días de préstamo y borrado seguro de datos. |
| **4. Familiaridad (*Familiarity*)** | Construir sobre lo que la gente ya conoce. | Gestos táctiles nativos de iOS, tarjetas con elevación física real y selectores estándar de sistema. |
| **5. Flexibilidad (*Flexibility*)** | Adaptarse a diversos contextos y pantallas. | Funciona idéntico en iPhone (430×932), iPad en bodega, laptop de IT o terminal de rack. |
| **6. Simplicidad (*Simplicity*)** | Ser claro, directo y conciso. | Cero bordes gruesos. La jerarquía visual guía la vista sin necesidad de cajas divisorias agresivas. |
| **7. Artesanía (*Craft*)** | Cuidar obsesivamente cada detalle. | Tipografía con *tight tracking* (-0.8px), sombras multicapa orgánicas y transiciones `ease-out-quad`. |
| **8. Deleite (*Delight*)** | Hacerlo humano y gratificante. | Micro-interacciones con compresión táctil (`active:scale-[0.98]`), transparencias de vidrio esmerilado y colores vivaces. |

---

## 3. Especificaciones del Sistema de Diseño (Design Tokens)

### 3.1. Tipografía: Escala Tensa y Deliberada (*Tight Tracking*)
Utilizamos **Inter Tight** y **SF Pro Rounded** para lograr un impacto visual limpio, moderno y de alta densidad de información:

```
┌───────────────────────────┬──────────────┬──────────────┬─────────────────────────────────────┐
│ Nivel Jerárquico          │ Tamaño (px)  │ Interletrado │ Peso / Estilo                       │
├───────────────────────────┼──────────────┼──────────────┼─────────────────────────────────────┤
│ Super Greeting / Display  │ 26px         │ -0.9px       │ Extra Bold / Rounded (Black/900)    │
│ Page Titles               │ 22px         │ -0.8px       │ Bold (700)                          │
│ Section Headings          │ 18px - 19px  │ -0.7px       │ Bold / Semi-bold (600)              │
│ Body Copy                 │ 14px - 16px  │ -0.2px       │ Regular / Medium (400 - 500)        │
│ Labels, Chips & Captions  │ 12px - 13px  │ +0.1px       │ Semi-bold / Monospace (para serial) │
└───────────────────────────┴──────────────┴──────────────┴─────────────────────────────────────┘
```

> **Por qué funciona:**  
> Un interletraje negativo (*letter-spacing* de `-0.7px` a `-0.9px`) en titulares grandes elimina el aspecto "desperdigado" de la tipografía genérica, otorgándole a los títulos un carácter intencional, editorial y contundente, mientras que el cuerpo de texto se mantiene legible a 14-16px.

---

### 3.2. Color: Variables Dinámicas y Rampa Armónica

El sistema de color se controla mediante variables CSS semánticas para garantizar compatibilidad total e inmediata entre **Modo Claro** y **Modo Oscuro**:

- **Acento Primario Apple:** `#3866D6` (*Electric Royal Blue*) combinado con la identidad corporativa de Blue Hawk (`#0E80BE` y `#1F2F4A`).
- **Fondos de Alto Impacto:** Identidades cromáticas vibrantes por sección o categoría (como en la referencia visual):
  - *Neón Esmeralda:* `#10B981` / `#22C55E` (Activos nuevos / disponibles).
  - *Coral / Rose:* `#F43F5E` (Alertas críticas, retiros definitivos).
  - *Solar Amber:* `#FACC15` (Mantenimiento, advertencia de préstamo vencido >15 días).
  - *Violeta Profundo:* `#8B5CF6` / `#6366F1` (Servidores y telecomunicaciones centrales).
  - *Obsidiana / Grafito:* `#0B0F19` (Paneles de control, terminal y modo noche).
- **Rampa de 5 Pasos para Datos y Gráficos:**
  1. `Nivel 1 (Base/Pista):` Color neutro silenciado de fondo (`#E2E8F0` / `#1E293B`).
  2. `Nivel 2 (Bajo):` `#93C5FD` (Azul hielo).
  3. `Nivel 3 (Medio):` `#60A5FA` (Azul cielo).
  4. `Nivel 4 (Alto):` `#3866D6` (Azul vibrante).
  5. `Nivel 5 (Máximo/Crítico):` `#1E40AF` / `#1F2F4A` (Azul profundo Blue Hawk).

---

### 3.3. Tratamiento de Superficies: "Cero Bordes Visibles" (*Zero Visible Borders*)

En el diseño clásico de software empresarial se abusa de bordes grises de 1px que saturan la vista.  
En el estándar de Apple, **las tarjetas no tienen bordes visibles**. La separación se logra mediante tres capas sutiles:

1. **Brillo Inset (*Inset Top Highlight*):**  
   `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.20)` (en claro) o `rgba(255, 255, 255, 0.08)` (en oscuro). Simula el bisel de vidrio del borde superior de la pantalla.
2. **Sombra Flotante Multicapa (*Flawless Soft Shadow*):**  
   ```css
   box-shadow: 
     0 2px 4px -1px rgba(0, 0, 0, 0.03),
     0 8px 24px -4px rgba(0, 0, 0, 0.06),
     0 20px 48px -12px rgba(0, 0, 0, 0.08);
   ```
3. **Anillo Translúcido de 1px (*Subtle Ring*):**  
   `ring-1 ring-black/5` en modo claro, `ring-1 ring-white/10` en modo oscuro.

---

### 3.4. Jerarquía Matemática de Radios (*Squircle Curvature*)

El radio de curvatura desciende de forma armónica desde el dispositivo exterior hasta el control más interno:

```
[ Chasis del Dispositivo (54px) ]
    └── [ Tarjetas Maestras / Modales (18px - 22px) ]
            └── [ Filas, Inputs y Subtarjetas (10px - 14px) ]
                    └── [ Chips y Badges (8px - 10px) ]
                            └── [ Botones de Acción Circular (50% / rounded-full) ]
```

- **54px:** Marco de teléfono o ventana principal flotante.
- **18px - 22px:** Tarjetas de inventario, modales de escaneo, contenedores de estadísticas.
- **10px - 14px:** Campos de entrada (*inputs*), filas de auditoría, dropdowns de categoría.
- **8px - 10px:** Etiquetas de estado (*"Activo"*, *"En Reparación"*).
- **Pill / 50% (`rounded-full`):** Botones principales de acción (*"Get Started"*, *"Nuevo Inventario"*, *"Escanear QR"*).

---

### 3.5. Espaciado Predecible y Denso

- **Márgenes de Pantalla:** `26px` fijos en móvil (430px de ancho).
- **Separación entre Grupos de Tarjetas:** `16px - 22px`.
- **Padding Interno de Componentes:** `12px` (compacto) a `20px` (hero cards).
- **Área Táctil Mínima (HIG Touch Target):** **44×44 pt** sin excepción para evitar toques fallidos en pantallas táctiles o teléfonos en campo.

---

## 4. Anatomía de la Experiencia Móvil (Canvas 430×932px)

Basado en la lámina de diseño de iPhone (8 pantallas de referencia):

1. **Status Bar & Dynamic Island (Tope):**
   - Altura de 54px con muesca Dynamic Island centralizada y datos de hora (12:30), señal Wi-Fi y batería a los costados.
2. **Hero Section Cromático:**
   - Gran fondo de color con degradado sutil hacia el centro.
   - Ilustración 3D, memojis o gráficos de activos agrupados con anillos blancos superpuestos (`-space-x-3 ring-2 ring-white`).
3. **Tarjeta Inferior Deslizante (*Floating Bottom Sheet*):**
   - Tarjeta blanca o negra en contraste puro que sube desde el tercio inferior.
   - Píldora de arrastre superior (*grabber*): `w-8 h-1 bg-slate-300 rounded-full mx-auto mb-3`.
   - Titular tenso a 22px con interletraje negativo.
4. **Botón Principal de Acción Táctil (*The Hero Pill Button*):**
   - Altura estandarizada de 50-54px.
   - Radio completo `rounded-full`.
   - Fondo negro azabache `#000000` con texto blanco ultra-bold, o blanco puro en modo oscuro.
   - Efecto de pulsación háptica virtual: `transition-transform duration-100 active:scale-[0.97]`.
5. **Home Indicator (Pie):**
   - Línea de seguridad iOS: `w-32 h-1 bg-slate-400/60 rounded-full mx-auto mt-4`.

---

## 5. Implementación en el Código de Blue Hawk

### 5.1. Clases y Utilidades Tailwind Estandarizadas
En `frontend/tailwind.config.js` y `index.css`:

```js
// Configuración de Tokens Apple en Tailwind
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        'apple-card': '20px',
        'apple-sheet': '28px',
        'apple-device': '54px',
        'apple-control': '12px',
      },
      letterSpacing: {
        'apple-tight': '-0.035em', // ~ -0.8px en títulos
        'apple-display': '-0.045em', // ~ -1.0px en super display
      },
      boxShadow: {
        'apple-subtle': '0 2px 4px -1px rgba(0,0,0,0.03), 0 8px 20px -4px rgba(0,0,0,0.05)',
        'apple-float': '0 12px 32px -6px rgba(0,0,0,0.08), 0 4px 12px -2px rgba(0,0,0,0.03)',
        'apple-modal': '0 25px 50px -12px rgba(15,23,42,0.25)',
      }
    }
  }
}
```

### 5.2. Reglas para Futuras Vistas y Componentes
1. **Nunca usar bordes negros o grises sólidos de 1px** en contenedores grandes. Reemplazar por `bg-white shadow-apple-subtle ring-1 ring-slate-900/5`.
2. **Titulares con -0.8px tracking obligatorio:** Siempre aplicar `tracking-apple-tight` a títulos de sección o modales.
3. **Botones primarios estilo Pill:** Todo botón principal debe ser `h-11 sm:h-12 px-6 rounded-full font-bold transition-all active:scale-[0.97]`.
4. **Respetar la Cadena de Mando y Políticas (`POLITICS.md`):** Todo modal técnico debe contar con acceso rápido a manuales, confirmación nominal de custodia y recordatorio del límite de 15 días.

---

## 6. Stack Tecnológico de Vanguardia: Bibliotecas y Frameworks para Diseños y Animaciones Sobresalientes

Para alcanzar el nivel de excelencia visual, fluidez táctil y refinamiento que caracteriza al diseño de Apple y la referencia del iPhone Duo, la arquitectura frontend debe integrar herramientas de primer nivel especializadas en rendimiento, físicas de animación y accesibilidad:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA DE EXPERIENCIA VISUAL                            │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────┤
│ CAPA DE ESTRUCTURA Y RUTAS    │ CAPA DE ESTILOS Y PRIMITIVAS │ CAPA DE FÍSICAS & GESTOS │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────┤
│ • React 18 / 19 (Concurrent)  │ • Tailwind CSS (Tokens)       │ • GSAP (Timeline, Flip) │
│ • Next.js (App Router)        │ • shadcn/ui (Accessible Base) │ • Framer Motion / Motion│
│ • TypeScript (Strict Typing)  │ • Radix UI Primitives         │ • Lenis (Smooth Scroll) │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────┘
```

---

### 6.1. Roles y Responsabilidades del Stack

#### 1. React 18 / 19 & Next.js (App Router & Server Components)
- **Transiciones Instantáneas sin Pantallazos Blancos:** Aprovecha `React.startTransition` y los Server Components de Next.js para transmitir (*streaming*) datos del inventario en segundo plano mientras la interfaz mantiene animaciones a 60/120 FPS sin bloqueos en el hilo principal.
- **View Transitions API:** Integración con la API nativa de transición de vistas para navegación entre pantallas que emula el cambio fluido de vistas en iOS sin recarga de navegador.
- **Rendimiento de Cero Runtime:** Renderizado del cascarón de la app en servidor para tiempos de carga inicial inferiores a 0.8 segundos.

#### 2. Tailwind CSS (Tokens Semánticos y Diseño Atómico)
- **Configuración de Variables CSS:** Permite alternar instantáneamente entre temas claro y oscuro sin redibujar componentes ni recalcular hojas de estilo pesadas.
- **Utilidades Personalizadas:** Soporte nativo para `backdrop-blur-xl`, filtros de saturación de color (`backdrop-saturate-150`), máscaras degradadas y la utilidad `cn()` combinando `clsx` y `tailwind-merge`.
- **Interletrado Tenso Integrado:** Configuración del tracking negativo directo en clases utilitarias (`tracking-tight` / `tracking-[-0.035em]`).

#### 3. shadcn/ui & Radix UI Primitives (Componentes Sin Estilo Cerrado)
- **Filosofía de Código Propio (*Own Your Code*):** A diferencia de librerías rígidas, shadcn/ui se copia directamente en el proyecto, permitiendo modificar radios (`rounded-[20px]`), sombras y efectos de vidrio esmerilado sin pelear contra selectores CSS ajenos.
- **Diálogos, Sheets y Drawers Táctiles:** Componentes de hoja deslizable inferior (*bottom sheets*) con accesibilidad WAI-ARIA completa, navegación por teclado, focus-trapping y bloqueo de scroll nativo en fondo.
- **Tooltips y Popovers con Micro-delays:** Animaciones de entrada escalonadas (`animate-in fade-in-0 zoom-in-95 duration-150`).

#### 4. GSAP (GreenSock Animation Platform) + Flip & ScrollTrigger
- **Coreografía Compleja y Cinemática:** Utilizado cuando múltiples elementos deben coordinarse con precisión de milisegundos (por ejemplo, el despliegue del Dynamic Island, la elevación de tarjetas en cascada y el revelado de texto).
- **GSAP Flip Plugin (First, Last, Invert, Play):** La herramienta definitiva para transiciones morfológicas: transforma una fila compacta de inventario en una tarjeta expandida a pantalla completa de forma 100% fluida y sin saltos de layout.
- **Rendimiento Máximo:** GSAP opera directamente sobre matrices de transformación CSS y capas compuestas de la GPU, garantizando 120 FPS incluso en teléfonos móviles de gama media.

#### 5. Framer Motion / Motion for React (Físicas de Resorte de iOS)
- **Simulación de Físicas Reales:** Mientras las transiciones CSS tradicionales usan curvas de Bézier estáticas (`ease-in-out`), Framer Motion simula masa, rigidez y amortiguación (*spring physics*):
  ```ts
  transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.8 }
  ```
- **Gestos Táctiles con Rebote:** Comportamiento nativo al arrastrar (*drag-to-dismiss* en modales y hojas inferiores) con resistencia elástica en los bordes.
- **Shared Layout Animations (`layoutId`):** Permite que un badge o imagen "viaje" visualmente desde una vista de lista hasta la cabecera de la ficha técnica al hacer clic.

#### 6. Lenis (Smooth Scrolling Inercial)
- **Sensación de Pantalla ProMotion:** Lenis sincroniza la rueda del mouse y el scroll táctil con el refresco de pantalla, eliminando el scroll entrecortado y dotando a la interfaz de la sensación de inercia y pesadez del cristal de Apple.

---

### 6.2. Recetas Prácticas de Componentes Apple

#### Receta A: Tarjeta con Efecto "Zero Visible Borders" y Resorte Táctil (Framer Motion + Tailwind)

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AppleCardProps {
  title: string;
  subtitle: string;
  badge?: string;
  accentColor?: string;
  onClick?: () => void;
}

export const AppleHeroCard: React.FC<AppleCardProps> = ({
  title,
  subtitle,
  badge = "Nuevo",
  accentColor = "from-emerald-400 to-emerald-600",
  onClick
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      className="relative w-full max-w-sm rounded-[22px] p-6 cursor-pointer select-none overflow-hidden
                 bg-white dark:bg-slate-900 
                 ring-1 ring-black/5 dark:ring-white/10
                 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.03),0_12px_28px_-6px_rgba(0,0,0,0.06)]
                 transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)]"
    >
      {/* Inset Top Highlight (Simula bisel de vidrio Apple) */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent pointer-events-none" />

      {/* Floating Pill Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${accentColor} shadow-sm`}>
          <Sparkles className="w-3 h-3" />
          <span>{badge}</span>
        </span>
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Tight Typography */}
      <h3 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-[-0.035em] leading-tight mb-1">
        {title}
      </h3>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
        {subtitle}
      </p>
    </motion.div>
  );
};
```

---

#### Receta B: Entrada Cinemática Escalonada con GSAP (Estilo Keynote / iPhone Duo)

```tsx
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const AppleOnboardingView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Dynamic Island drop-in
    tl.from('.dynamic-island', {
      y: -60,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    // 2. Hero graphic and avatars scale-up
    tl.from('.hero-badge-group', {
      scale: 0.7,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08
    }, '-=0.4');

    // 3. Tight Headlines slide & fade
    tl.from('.apple-headline', {
      y: 25,
      opacity: 0,
      duration: 0.6,
      letterSpacing: '0.02em', // Comprime de espaciado neutro a -0.035em
    }, '-=0.3');

    // 4. Floating Bottom Sheet emergence
    tl.from('.bottom-sheet-card', {
      y: 120,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.4');

    // 5. Hero Action Pill Pulse
    tl.from('.hero-pill-button', {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.2');

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-[430px] h-[932px] rounded-[54px] bg-[#10B981] overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
      {/* Dynamic Island */}
      <div className="dynamic-island w-28 h-7 bg-black rounded-full mx-auto mt-2 flex items-center justify-between px-3">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
      </div>

      {/* Hero Avatar Cluster */}
      <div className="hero-badge-group flex items-center justify-center -space-x-3 my-auto">
        <div className="w-14 h-14 rounded-full bg-white ring-4 ring-white shadow-lg overflow-hidden flex items-center justify-center font-bold text-slate-800">JH</div>
        <div className="w-16 h-16 rounded-full bg-slate-900 ring-4 ring-white shadow-xl flex items-center justify-center font-bold text-white z-10">WB</div>
        <div className="w-14 h-14 rounded-full bg-blue-600 ring-4 ring-white shadow-lg flex items-center justify-center font-bold text-white">DB</div>
      </div>

      {/* Floating Bottom Card */}
      <div className="bottom-sheet-card bg-white rounded-[28px] p-6 shadow-2xl space-y-4">
        <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto" />
        <h2 className="apple-headline text-[24px] font-extrabold text-slate-900 tracking-[-0.035em] text-center leading-tight">
          Control Total de Activos
        </h2>
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Trazabilidad, escaneo óptico con IA y auditoría en tiempo real para Blue Hawk Technologies.
        </p>
        <button className="hero-pill-button w-full h-12 bg-slate-950 text-white rounded-full font-bold text-sm shadow-md transition-transform active:scale-[0.97]">
          Comenzar Inventario
        </button>
      </div>
    </div>
  );
};
```

---

#### Receta C: Botón "Hero Pill" con Feedback Háptico Visual

```tsx
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeroPillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
}

export const HeroPillButton: React.FC<HeroPillButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    h-12 px-7 rounded-full text-xs font-bold tracking-tight
    transition-all duration-150 ease-out select-none cursor-pointer
    active:scale-[0.96] active:brightness-95
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  `;

  const variants = {
    primary: 'bg-slate-950 text-white shadow-md hover:bg-slate-800 focus-visible:ring-slate-950',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400',
    glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10 shadow-sm hover:bg-white/90'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

### 6.3. Guía de Rendimiento para Mantener 60/120 FPS Estables

1. **Animar Únicamente Propiedades Aceleradas por Hardware (GPU):**
   - ✅ `transform` (`translateX`, `translateY`, `scale`, `rotate`).
   - ✅ `opacity`.
   - ❌ **Nunca animar:** `width`, `height`, `top`, `left`, `margin`, `padding` (provocan recálculo de geometría y caída de frames).
2. **Respetar Preferencias de Accesibilidad (`prefers-reduced-motion`):**
   - Siempre envolver animaciones con variantes condicionales:
     ```css
     @media (prefers-reduced-motion: reduce) {
       * {
         animation-duration: 0.01ms !important;
         transition-duration: 0.01ms !important;
       }
     }
     ```
3. **Uso Prudente de `backdrop-blur`:**
   - Limitar el desenfoque a un máximo de 2-3 capas superpuestas en pantalla simultáneamente para prevenir sobrecarga de la GPU móvil.

---

## 7. Optimización SEO, Indexación Semántica y Motores de Búsqueda Algorítmica

Un diseño extraordinario no debe estar oculto en una caja negra inaccesible. Para que una aplicación desarrollada con esta estética posicione en los primeros lugares de los motores de búsqueda (Google, Bing), sea comprendida por asistentes de IA (Google Gemini, Perplexity, ChatGPT Search) e indexada por los sistemas de búsqueda del sistema operativo (Apple Spotlight, Siri Shortcuts), la arquitectura debe implementar **SEO técnico y semántica algorítmica de nivel enterprise**:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DE VISIBILIDAD & ALGORITMOS                           │
├───────────────────────────────┬───────────────────────────────┬───────────────────────────┤
│ SEMÁNTICA & CORE WEB VITALS   │ METADATA & SCHEMA ORG JSON-LD │ BÚSQUEDA INSTANTÁNEA <5MS │
├───────────────────────────────┼───────────────────────────────┼───────────────────────────┤
│ • LCP < 1.2s, INP < 45ms      │ • Graph Schema estructurado   │ • Algoritmo Fuzzy uFuzzy  │
│ • CLS = 0.000 (Cero saltos)   │ • Dynamic OpenGraph / Twitter │ • Filtrado O(log n) Trie  │
│ • Jerarquía HTML5 pura        │ • Sitemap dinámico con ETag   │ • Embeddings & Búsqueda IA│
└───────────────────────────────┴───────────────────────────────┴───────────────────────────┘
```

---

### 7.1. Los 3 Pilares del SEO Técnico en Interfaces de Alto Diseño

#### 1. Core Web Vitals Inquebrantables (Ranking #1)
Google premia de forma directa a las páginas que responden con inmediatez. Nuestro estándar de diseño bloquea cualquier degradación:
- **LCP (*Largest Contentful Paint*) < 1.2s:** El elemento visual más grande de la pantalla (generalmente el título hero o la tarjeta destacada) debe renderizarse y estar pintado en pantalla en menos de 1.2 segundos.
- **INP (*Interaction to Next Paint*) < 45ms:** Sustituto moderno de FID. Mide la latencia desde que el usuario hace clic o tap en un botón hasta que la pantalla presenta la siguiente respuesta visual. Con Framer Motion y físicas de resorte, el feedback táctil es inmediato (<16ms, 1 frame a 60Hz).
- **CLS (*Cumulative Layout Shift*) = 0.000:** Cero saltos visuales durante la carga. Reservamos espacio dimensional explícito (`aspect-ratio` o `min-h`) para avatares, tarjetas flotantes y fotos antes de que sus recursos terminen de bajar.

#### 2. Jerarquía Semántica HTML5 Pura
Ningún motor de búsqueda puede interpretar un árbol compuesto exclusivamente por etiquetas `<div>` anidadas. La estructura debe ser un libro abierto:
- `<header>`: Encabezado institucional, selector de perfiles y navegación principal.
- `<nav aria-label="Navegación del Inventario">`: Controles de ruta y cambio de pestañas.
- `<main id="main-content">`: Contenedor semántico principal accesible por lectores de pantalla y bots.
- `<article>`: Cada tarjeta de inventario o ficha de equipo individual.
- `<h1>`: Único por página, contundente, con tipografía tensa a 22-26px.
- `<section aria-labelledby="section-title">`: Agrupaciones lógicas de activos o categorías.
- `<footer>`: Información legal, versiones y cumplimiento normativo.

#### 3. Metadatos Dinámicos y Datos Estructurados JSON-LD (Schema.org)
Implementación en Next.js (App Router `generateMetadata`):

```tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const asset = await getAsset(params.id);

  return {
    title: `${asset.name} (${asset.internal_code}) | Blue Hawk Inventory`,
    description: `Ficha técnica oficial de ${asset.brand} ${asset.model}. Ubicación actual: ${asset.location_path}. Estado: ${asset.status}.`,
    alternates: {
      canonical: `https://inventory.bluehawk.tech/assets/${asset.internal_code}`,
    },
    openGraph: {
      title: `${asset.name} · Blue Hawk Technologies`,
      description: `Activo registrado: S/N ${asset.serial_number} en ${asset.location_path}`,
      url: `https://inventory.bluehawk.tech/assets/${asset.internal_code}`,
      siteName: 'Blue Hawk Inventory',
      images: [
        {
          url: asset.photo_url || '/og-default-asset.png',
          width: 1200,
          height: 630,
          alt: asset.name,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${asset.name} (${asset.internal_code})`,
      description: `Activo de telecomunicaciones en ${asset.location_path}`,
    },
  };
}

// Inyección de JSON-LD estructurado para motores de búsqueda y asistentes de IA
export function AssetStructuredData({ asset }: { asset: any }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: asset.name,
    model: asset.model,
    brand: {
      '@type': 'Brand',
      name: asset.brand,
    },
    sku: asset.internal_code,
    serialNumber: asset.serial_number,
    category: asset.category_name,
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      availability: asset.status === 'Activo' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

---

### 7.2. Algoritmos de Búsqueda Instantánea en Tiempo Real (<5ms)

Cuando un técnico u operador busca un equipo entre miles de registros, una consulta que tarda 800ms arruina la percepción de calidad. Implementamos una **arquitectura de búsqueda híbrida**:

1. **Búsqueda Difusa en Cliente (*Client-Side Fuzzy Search* con `uFuzzy` / `Fuse.js`):**
   - Tolera errores de tipeo comunes en campo (ej. *"Cisko Catlist"* encuentra automáticamente *"Cisco Catalyst 2960-X"*).
   - Pre-indexación en memoria de los campos clave: `internal_code`, `serial_number`, `mac_address`, `brand`, `model`, `location_path`.
   - Tiempo de respuesta: **menos de 3 milisegundos para 10,000 artículos**, ejecutándose en un Web Worker para no congelar las animaciones de la UI.
2. **Normalización y Matching de Hardware (Serial & MAC):**
   - Algoritmo de despojado de caracteres: ignora mayúsculas/minúsculas, guiones (`-`), dos puntos (`:`) y espacios.
   - Si el técnico escribe `245a4c998877`, el algoritmo localiza instantáneamente `24:5A:4C:99:88:77`.
3. **Búsqueda Semántica con Embeddings (IA Vectorial):**
   - Para consultas en lenguaje natural (ej. *"los switches del segundo piso que tienen puertos PoE"*), el backend genera una representación vectorial y ejecuta una búsqueda de similitud de coseno, entregando resultados contextuales precisos.

---

## 8. Arquitectura de Carga Cero ("Zero-Lag Architecture"): Máxima Belleza Visual sin Lentitud

> **El Mito:** *"Para que una página se vea tan bien como los productos de Apple, tiene que ser pesada y lenta."*  
> **La Realidad:** Las mejores interfaces de Apple son rápidas precisamente porque su ingeniería es tan rigurosa como su diseño visual.

Para mantener sombras multicapa, desenfoques de cristal (`backdrop-blur`), tipografía rica y animaciones de 120 FPS sin ralentizar la carga ni provocar caídas de frames, aplicamos las siguientes técnicas de ingeniería extrema:

---

### 8.1. Font Subsetting y Cero Desplazamiento de Diseño (CLS = 0)

1. **Auto-hosting de Fuentes Locales (WOFF2 Subsets):**
   - Nunca cargar fuentes desde Google Fonts con llamadas a servidores externos bloqueantes.
   - Las fuentes **Inter Tight** y **SF Pro Rounded** se cargan localmente en formato `.woff2` pre-comprimido, conservando únicamente los caracteres latinos necesarios (~28 KB por peso en lugar de 350 KB).
2. **Emparejamiento Métrico con Fallback (*Size Adjust*):**
   - En Next.js (`next/font`), configuramos `fallback: ['system-ui', '-apple-system', 'sans-serif']` con ajuste automático de métricas (`ascent-override`, `descent-override`).
   - El navegador reserva el espacio exacto del texto antes de que la fuente web termine de cargarse. **El diseño no salta ni un solo píxel (CLS = 0.000)**.

---

### 8.2. Optimización de Imágenes de Próxima Generación (AVIF / WebP)

1. **Formatos Modernos con Compresión Perceptual:**
   - Toda fotografía de hardware o captura de etiqueta se convierte automáticamente en el backend a formato **AVIF** (60% más ligero que JPEG con idéntica fidelidad de color).
2. **Srcset Adaptativo para Pantallas Retina:**
   - La etiqueta `<picture>` o el componente `Image` de Next.js entrega tamaños adaptados a la densidad del dispositivo:
     - `1x` (120 KB) para pantallas de monitor estándar.
     - `2x` / `3x` Super Retina (280 KB) para iPhone Pro y MacBook Liquid Retina.
3. **Priorización Crítica de Carga:**
   - La imagen o avatar del Hero Section lleva `priority={true}` y `fetchpriority="high"` (empieza a descargarse en los primeros 100ms de la conexión).
   - Todas las fotos de la grilla inferior llevan `loading="lazy"`, `decoding="async"` y un marcador de posición borroso instantáneo (*Blurhash / Low Quality Image Placeholder*).

---

### 8.3. Code-Splitting Agresivo y Carga Dinámica (*Lazy Splitting*)

Mantener el bundle JavaScript inicial por debajo de **75 KB (gzipped)** para que el tiempo de interacción (*Time to Interactive*) sea inferior a 600ms:

```tsx
import dynamic from 'next/dynamic';

// Componentes pesados cargados EXCLUSIVAMENTE cuando el usuario los solicita:
const QrScannerCamera = dynamic(
  () => import('@/components/qr/QrScannerModal').then((mod) => mod.QrScannerModal),
  { ssr: false, loading: () => <ScannerLoadingSkeleton /> }
);

const PrintLabelGenerator = dynamic(
  () => import('@/components/qr/PrintLabelModal').then((mod) => mod.PrintLabelModal),
  { ssr: false }
);

const InventoryAnalyticsChart = dynamic(
  () => import('@/components/dashboard/HighEndCharts'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
```

> **Resultado:** Las librerías complejas (cámara `html5-qrcode`, generador canvas QR, motores gráficos de visualización) consumen 0 KB en la pantalla inicial de inicio y solo se transfieren por la red en el momento exacto en que el usuario presiona el botón.

---

### 8.4. Virtualización de Listas Extensas (@tanstack/react-virtual)

Si el inventario de Blue Hawk contiene 10,000 equipos registrados, intentar renderizar 10,000 elementos en el árbol DOM destruirá la memoria RAM del teléfono móvil y provocará scroll congelado.

- **Solución Apple Virtual DOM:**  
  Utilizamos `@tanstack/react-virtual`. Únicamente se renderizan en el DOM los **12 a 15 elementos visibles en la ventana de visualización** (*viewport*), reutilizando los mismos nodos a medida que el usuario hace scroll:
  - Consumo de memoria RAM: **Constante (<35 MB)** sin importar si hay 50 o 50,000 artículos.
  - Tasa de refresco: **120 FPS estables** incluso con sombras y vidrios activos.

---

### 8.5. Estrategia de Caché Multinivel SWR (Stale-While-Revalidate)

- **Carga en 0 Milisegundos:** Cuando el usuario navega entre "Inventario", "Categorías" y "Ubicaciones", los datos se extraen instantáneamente de la memoria caché local en `0 ms`.
- **Revalidación Silenciosa:** Mientras el usuario ya está viendo la pantalla con fluidez total, una petición ligera HTTP con `ETag` verifica en segundo plano si existen cambios en el servidor. Si los hay, actualiza la pantalla con una micro-transición imperceptible.
- **Tolerancia a Cortes de Red (Offline First):** La aplicación sigue permitiendo consultar activos aunque se corte la conexión en sótanos o salas de servidores aisladas.

---

## 9. Herramientas y Recursos Oficiales Vinculados

- **Skill Oficial Instalada en el Sistema:** `apple-hig` (156 especificaciones destiladas de Apple Human Interface Guidelines en `.agent/skills/apple-hig` y `~/.gemini/config/skills/apple-hig`).
- **Figma Preflight:** [Plugin Comunitario Preflight para Figma](https://www.figma.com/community/plugin/1631402957788623931/preflight?fuid=1554636967385960163).
- **Apple Developer HIG:** [Human Interface Guidelines Oficial](https://developer.apple.com/design/human-interface-guidelines/).
- **GreenSock GSAP Docs:** [Documentación Oficial de GSAP & Flip](https://gsap.com/docs/v3/).
- **Framer Motion Docs:** [Framer Motion / Motion for React](https://motion.dev/).
- **shadcn/ui:** [Librería de Componentes Radix + Tailwind](https://ui.shadcn.com/).
- **Google Core Web Vitals Guide:** [Optimización de LCP, INP y CLS](https://web.dev/vitals/).
- **Schema.org:** [Estándar de Metadatos Estructurados](https://schema.org/).
- **Documentación de Proyecto:** [CONTEXT.md](./CONTEXT.md) y [POLITICS.md](./POLITICS.md).
