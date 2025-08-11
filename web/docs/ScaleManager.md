# ScaleManager - Sistema de Escalado Responsivo

El ScaleManager es un sistema que permite que tu contenido se comporte como un "canvas virtual" de 1280x720 píxeles, escalándose proporcionalmente sin deformación en cualquier tamaño de pantalla.

## ¿Cómo funciona?

El ScaleManager crea automáticamente un wrapper `.content` dentro del `#gameContainer` y aplica transformaciones CSS para mantener las proporciones 16:9 (1280x720).

## Integración en nuevos archivos JavaScript

### Método 1: Funciones Helper Globales (RECOMENDADO - MÁS FÁCIL)

El ScaleManager ahora incluye funciones helper que simplifican mucho la integración:

```javascript
class MiEstado {
    constructor() {
        this.container = null;
        this.init();
    }
    
    async init() {
        // Crear contenedor que se adapta automáticamente
        this.container = await window.createScaledContainer('mi-estado');
        
        // Crear contenido
        this.createContent();
    }
    
    createContent() {
        // Ejemplo 1: Título centrado
        const titulo = document.createElement('h1');
        titulo.textContent = 'Mi Título';
        titulo.style.cssText = `
            font-size: 60px;
            color: white;
            margin: 0;
        `;
        
        // Posicionar en el centro del canvas
        window.positionInCanvas(titulo, 640, 200, 'center');
        this.container.appendChild(titulo);
        
        // Ejemplo 2: Botón centrado
        const boton = document.createElement('button');
        boton.textContent = 'Jugar';
        boton.style.cssText = `
            width: 200px;
            height: 60px;
            font-size: 24px;
        `;
        
        // Posicionar en el centro
        const center = window.getCenterCoordinates(200, 60);
        window.positionInCanvas(boton, center.x, center.y);
        this.container.appendChild(boton);
        
        // Ejemplo 3: Texto en esquina inferior derecha
        const info = document.createElement('div');
        info.textContent = 'Versión 1.0';
        window.positionInCanvas(info, 1180, 680, 'bottom-center');
        this.container.appendChild(info);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.miEstado = new MiEstado();
});
```

### Método 2: Con Callback de espera

```javascript
class MiEstado {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Esperar a que el ScaleManager esté listo
        window.waitForScaleManager((contentWrapper, scaleManager) => {
            this.createScreen(contentWrapper);
        });
    }
    
    createScreen(contentWrapper) {
        this.container = document.createElement('div');
        this.container.className = 'mi-estado';
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        `;
        
        this.createContent();
        contentWrapper.appendChild(this.container);
    }
    
    createContent() {
        // Tu contenido aquí
    }
}
```

### Método 3: Integración Manual (Para casos avanzados)

Para que cualquier script funcione con el ScaleManager, sigue este patrón:

```javascript
class MiEstado {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        this.createScreen();
    }
    
    createScreen() {
        // 1. Obtener el contenedor del juego
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) {
            console.error('Game container not found');
            return;
        }
        
        // 2. CRÍTICO: Buscar el wrapper .content que crea el ScaleManager
        let contentWrapper = gameContainer.querySelector('.content');
        if (!contentWrapper) {
            // Si el ScaleManager aún no ha creado el wrapper, esperamos
            setTimeout(() => this.createScreen(), 50);
            return;
        }
        
        // 3. Crear tu contenedor principal
        this.container = document.createElement('div');
        this.container.className = 'mi-estado';
        
        // 4. Estilos para que ocupe todo el espacio del canvas virtual
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
        `;
        
        // 5. Agregar tu contenido aquí
        this.createContent();
        
        // 6. IMPORTANTE: Agregar al wrapper .content, NO al game-container
        contentWrapper.appendChild(this.container);
    }
    
    createContent() {
        // Tu contenido aquí - usa dimensiones como si fuera un canvas de 1280x720
        const miElemento = document.createElement('div');
        miElemento.style.cssText = `
            position: absolute;
            left: 640px;  // Centro horizontal del canvas 1280x720
            top: 360px;   // Centro vertical del canvas 1280x720
            transform: translate(-50%, -50%);
            // ... más estilos
        `;
        
        this.container.appendChild(miElemento);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.miEstado = new MiEstado();
    }, 200); // Dar tiempo al ScaleManager para inicializarse
});
```

### Método 2: Función Helper Global

Puedes crear una función helper para simplificar la integración:

```javascript
// Agregar al final de source/core/index.js o crear un nuevo archivo utils.js

window.waitForScaleManager = function(callback, retries = 10) {
    const gameContainer = document.getElementById('gameContainer');
    const contentWrapper = gameContainer?.querySelector('.content');
    
    if (contentWrapper) {
        callback(contentWrapper);
    } else if (retries > 0) {
        setTimeout(() => window.waitForScaleManager(callback, retries - 1), 50);
    } else {
        console.error('ScaleManager not ready after retries');
    }
};

// Uso en tus scripts:
window.waitForScaleManager((contentWrapper) => {
    const miContainer = document.createElement('div');
    // ... configurar el container
    contentWrapper.appendChild(miContainer);
});
```

## Funciones Helper Disponibles

El ScaleManager incluye varias funciones helper globales para facilitar el desarrollo:

### `window.waitForScaleManager(callback, retries, delay)`
Espera a que el ScaleManager esté listo y ejecuta el callback.
- `callback(contentWrapper, scaleManager)`: Función a ejecutar
- `retries`: Número máximo de intentos (default: 20)
- `delay`: Delay entre intentos en ms (default: 50)

### `window.createScaledContainer(className, options)`
Crea un contenedor que se adapta automáticamente al ScaleManager.
- `className`: Clase CSS para el contenedor (default: 'game-screen')
- `options.styles`: Objeto con estilos CSS adicionales
- Retorna: Promise que resuelve con el elemento HTML creado

```javascript
// Ejemplo
const container = await window.createScaledContainer('menu-screen', {
    styles: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: '10'
    }
});
```

### `window.getCenterCoordinates(width, height)`
Obtiene coordenadas para centrar un elemento en el canvas virtual.
- `width`: Ancho del elemento
- `height`: Alto del elemento
- Retorna: `{x, y}` coordenadas centradas en el canvas 1280x720

```javascript
const center = window.getCenterCoordinates(200, 100);
// center = {x: 540, y: 310} para centrar un elemento de 200x100
```

### `window.positionInCanvas(element, x, y, anchor)`
Posiciona un elemento en el canvas virtual con diferentes puntos de anclaje.
- `element`: Elemento HTML a posicionar
- `x, y`: Coordenadas en el canvas virtual (0-1280, 0-720)
- `anchor`: Punto de anclaje
  - `'top-left'` (default): Esquina superior izquierda
  - `'center'`: Centro del elemento
  - `'top-center'`: Centro superior
  - `'bottom-center'`: Centro inferior
  - `'center-left'`: Centro izquierdo
  - `'center-right'`: Centro derecho

```javascript
// Posicionar título centrado arriba
window.positionInCanvas(titulo, 640, 150, 'center');

// Posicionar botón en esquina inferior derecha
window.positionInCanvas(boton, 1200, 650, 'bottom-center');

// Posicionar menú en el lado izquierdo
window.positionInCanvas(menu, 100, 360, 'center-left');
```

## Reglas Importantes

### ✅ Qué SÍ hacer:

1. **Siempre agregar contenido al wrapper `.content`**
   ```javascript
   contentWrapper.appendChild(miElemento);
   ```

2. **Usar coordenadas como si fuera un canvas de 1280x720**
   ```javascript
   left: 640px;  // Centro horizontal
   top: 360px;   // Centro vertical
   width: 200px; // Tamaño específico
   ```

3. **Usar `position: absolute` para elementos posicionados**
   ```javascript
   position: absolute;
   left: 100px;
   top: 200px;
   ```

4. **Esperar a que el ScaleManager esté listo**
   ```javascript
   setTimeout(() => init(), 200);
   ```

### ❌ Qué NO hacer:

1. **NO agregar contenido directamente al `#gameContainer`**
   ```javascript
   // ❌ MAL
   gameContainer.appendChild(miElemento);
   
   // ✅ BIEN
   contentWrapper.appendChild(miElemento);
   ```

2. **NO usar unidades responsivas como %, vw, vh en elementos internos**
   ```javascript
   // ❌ MAL
   width: 50vw;
   
   // ✅ BIEN
   width: 640px; // 50% de 1280px
   ```

3. **NO asumir que el wrapper existe inmediatamente**
   ```javascript
   // ❌ MAL
   const wrapper = gameContainer.querySelector('.content');
   wrapper.appendChild(elemento); // Puede ser null
   
   // ✅ BIEN
   const wrapper = gameContainer.querySelector('.content');
   if (wrapper) {
       wrapper.appendChild(elemento);
   } else {
       setTimeout(() => tryAgain(), 50);
   }
   ```

## Coordenadas de Referencia Canvas 1280x720

- **Centro**: (640, 360)
- **Esquina superior izquierda**: (0, 0)
- **Esquina superior derecha**: (1280, 0)
- **Esquina inferior izquierda**: (0, 720)
- **Esquina inferior derecha**: (1280, 720)
- **Cuarto superior izquierdo**: (320, 180)
- **Cuarto superior derecho**: (960, 180)
- **Cuarto inferior izquierdo**: (320, 540)
- **Cuarto inferior derecho**: (960, 540)

## Ejemplo de Posicionamiento

```javascript
// Título centrado arriba
top: 150px;    // ~20% desde arriba
left: 640px;   // Centro horizontal
transform: translate(-50%, -50%);

// Botón centrado
top: 360px;    // Centro vertical
left: 640px;   // Centro horizontal
transform: translate(-50%, -50%);

// Texto inferior
bottom: 100px; // Desde abajo
left: 640px;   // Centro horizontal
transform: translateX(-50%);

// Menú lateral izquierdo
left: 100px;   // Margen izquierdo
top: 50%;      // Centro vertical
transform: translateY(-50%);
```

## Debugging

Si tu contenido no se escala correctamente:

1. **Verifica que esté dentro del wrapper `.content`**
   ```javascript
   console.log(miElemento.closest('.content')); // Debe retornar el wrapper
   ```

2. **Inspecciona el DOM**: Tu estructura debe ser:
   ```
   #gameContainer
   └── .content (creado por ScaleManager)
       └── .mi-estado (tu contenedor)
           └── elementos hijos
   ```

3. **Verifica los estilos CSS**: El wrapper `.content` debe tener:
   ```css
   transform: scale(X) translate(-50%, -50%);
   ```

## Notas Técnicas

- El ScaleManager se inicializa automáticamente al cargar `source/core/index.js`
- Usa `transform: scale()` para mantener proporciones sin deformación
- Los elementos `position: fixed` no se escalan (por diseño)
- El sistema es compatible con touch, mouse y teclado
