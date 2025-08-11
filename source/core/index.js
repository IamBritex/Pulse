/**
 * Scale Manager - Sistema de escalado Canvas responsivo
 * Implementa escalado proporcional completo (Scale FIT) como Phaser
 * @author Pulse Project
 */
class ScaleManager {
    // Constantes para mejor rendimiento
    static ORIENTATION_CHANGE_DELAY = 100;
    static SCALE_PRECISION = 3;
    
    constructor(containerId, gameWidth = 1280, gameHeight = 720) {
        // Validación de parámetros
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        
        // Crear un wrapper interno para el contenido si no existe
        this.content = this.container.querySelector('.content') || this._createContentWrapper();
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.aspectRatio = gameWidth / gameHeight;
        
        // Cache para optimización
        this._cachedScale = 1;
        this._cachedRect = null;
        this._isUpdating = false;
        
        this.init();
    }
    
    /**
     * Crea un wrapper interno para todo el contenido del contenedor
     * Esto asegura que TODO se escale correctamente sin deformarse
     */
    _createContentWrapper() {
        // Obtener todo el contenido actual del contenedor
        const existingContent = Array.from(this.container.children);
        
        // Crear el wrapper con las dimensiones del canvas
        const wrapper = document.createElement('div');
        wrapper.className = 'content';
        wrapper.style.cssText = `
            width: ${this.gameWidth}px;
            height: ${this.gameHeight}px;
            position: absolute;
            top: 0;
            left: 0;
            transform-origin: 0 0;
            backface-visibility: hidden;
            contain: layout style;
            will-change: transform;
        `;
        
        // Mover todo el contenido existente al wrapper
        existingContent.forEach(child => {
            wrapper.appendChild(child);
        });
        
        // Agregar el wrapper al contenedor
        this.container.appendChild(wrapper);
        
        return wrapper;
    }
    
    init() {
        this.updateContentScale();
        
        // Throttling para mejor rendimiento
        const throttledUpdate = this._throttle(() => this.updateContentScale(), 16); // ~60fps
        
        window.addEventListener('resize', throttledUpdate);
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateContentScale(), ScaleManager.ORIENTATION_CHANGE_DELAY);
        });
    }
    
    updateContentScale() {
        if (this._isUpdating) return;
        this._isUpdating = true;
        
        requestAnimationFrame(() => {
            const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
            const windowAspectRatio = windowWidth / windowHeight;
            
            // Obtener rect del contenedor (optimizado con cache)
            const containerRect = this.container.getBoundingClientRect();
            this._cachedRect = containerRect;
            
            const containerScale = containerRect.width / this.gameWidth;
            
            // Solo actualizar si el scale cambió significativamente
            if (Math.abs(containerScale - this._cachedScale) > 0.001) {
                this._cachedScale = containerScale;
                
                // IMPORTANTE: Aplicar escala al contenido para mantener proporción exacta
                if (this.content) {
                    // Escalado que mantiene las proporciones sin deformación
                    this.content.style.transform = `scale(${containerScale})`;
                    this.content.style.transformOrigin = '0 0'; // Asegurar origin correcto
                    
                    // Forzar re-layout para evitar inconsistencias visuales
                    this.content.offsetHeight;
                }
                
                // Determinar tipo de fit
                const fitType = windowAspectRatio > this.aspectRatio ? 'letterbox' : 'pillarbox';
                
                // Dispatch evento optimizado
                this._dispatchScaleEvent(containerScale, windowWidth, windowHeight, fitType);
            }
            
            this._isUpdating = false;
        });
    }
    
    // Método privado para dispatch de eventos
    _dispatchScaleEvent(scale, windowWidth, windowHeight, fitType) {
        const event = new CustomEvent('scaleChanged', {
            detail: { 
                scale,
                gameWidth: this.gameWidth,
                gameHeight: this.gameHeight,
                windowWidth,
                windowHeight,
                fitType,
                scaledGameWidth: this.gameWidth * scale,
                scaledGameHeight: this.gameHeight * scale
            }
        });
        window.dispatchEvent(event);
    }
    
    // Throttle helper para optimización
    _throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // === MÉTODOS PÚBLICOS DE UTILIDAD ===
    
    /**
     * Obtiene las dimensiones base del juego
     * @returns {{width: number, height: number}}
     */
    getGameDimensions() {
        return {
            width: this.gameWidth,
            height: this.gameHeight
        };
    }
    
    /**
     * Obtiene el factor de escala actual (optimizado con cache)
     * @returns {number}
     */
    getCurrentScale() {
        return this._cachedScale || (this._cachedScale = this.container.getBoundingClientRect().width / this.gameWidth);
    }
    
    /**
     * Obtiene las dimensiones escaladas actuales
     * @returns {{width: number, height: number}}
     */
    getScaledDimensions() {
        const scale = this.getCurrentScale();
        return {
            width: this.gameWidth * scale,
            height: this.gameHeight * scale
        };
    }
    
    /**
     * Convierte coordenadas de pantalla a coordenadas del juego
     * @param {number} screenX - Coordenada X de pantalla
     * @param {number} screenY - Coordenada Y de pantalla
     * @returns {{x: number, y: number}}
     */
    screenToGame(screenX, screenY) {
        const rect = this._cachedRect || this.container.getBoundingClientRect();
        const scale = this.getCurrentScale();
        
        return {
            x: (screenX - rect.left) / scale,
            y: (screenY - rect.top) / scale
        };
    }
    
    /**
     * Convierte coordenadas del juego a coordenadas de pantalla
     * @param {number} gameX - Coordenada X del juego
     * @param {number} gameY - Coordenada Y del juego
     * @returns {{x: number, y: number}}
     */
    gameToScreen(gameX, gameY) {
        const rect = this._cachedRect || this.container.getBoundingClientRect();
        const scale = this.getCurrentScale();
        
        return {
            x: rect.left + (gameX * scale),
            y: rect.top + (gameY * scale)
        };
    }
    
    /**
     * Fuerza una actualización del escalado
     */
    forceUpdate() {
        this._cachedScale = null;
        this._cachedRect = null;
        this.updateContentScale();
    }
    
    /**
     * Destruye el ScaleManager y limpia los event listeners
     */
    destroy() {
        window.removeEventListener('resize', this.updateContentScale);
        window.removeEventListener('orientationchange', this.updateContentScale);
        this.container = null;
        this.content = null;
    }
}

// === INICIALIZACIÓN SINGLETON ===
let scaleManagerInstance = null;

/**
 * Factory function para crear/obtener instancia única de ScaleManager
 * @param {string} containerId - ID del contenedor
 * @param {number} gameWidth - Ancho del juego
 * @param {number} gameHeight - Alto del juego
 * @returns {ScaleManager}
 */
function createScaleManager(containerId = 'gameContainer', gameWidth = 1280, gameHeight = 720) {
    if (!scaleManagerInstance) {
        scaleManagerInstance = new ScaleManager(containerId, gameWidth, gameHeight);
    }
    return scaleManagerInstance;
}

// Auto-inicialización optimizada
document.addEventListener('DOMContentLoaded', () => {
    createScaleManager();
    
    // Aplicar cursor personalizado globalmente
    document.body.style.cursor = 'url("public/assets/images/Move.png"), auto';
    // También aplicar a todos los elementos para asegurar consistencia
    document.documentElement.style.cursor = 'url("public/assets/images/Move.png"), auto';
}, { once: true });

// === FUNCIÓN HELPER GLOBAL PARA FACILITAR INTEGRACIÓN ===

/**
 * Función helper global para facilitar la integración con el ScaleManager
 * Espera a que el wrapper .content esté disponible y ejecuta el callback
 * @param {Function} callback - Función a ejecutar cuando el ScaleManager esté listo
 * @param {number} retries - Número máximo de intentos (default: 20)
 * @param {number} delay - Delay entre intentos en ms (default: 50)
 */
window.waitForScaleManager = function(callback, retries = 20, delay = 50) {
    const gameContainer = document.getElementById('gameContainer');
    const contentWrapper = gameContainer?.querySelector('.content');
    
    if (contentWrapper && scaleManagerInstance) {
        // ScaleManager está listo, ejecutar callback
        callback(contentWrapper, scaleManagerInstance);
    } else if (retries > 0) {
        // Reintentar después del delay
        setTimeout(() => {
            window.waitForScaleManager(callback, retries - 1, delay);
        }, delay);
    } else {
        console.error('ScaleManager not ready after maximum retries');
        console.warn('Make sure source/core/index.js is loaded before your script');
    }
};

/**
 * Función helper para crear contenedores que se adapten automáticamente al ScaleManager
 * @param {string} className - Clase CSS para el contenedor
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<HTMLElement>} Promesa que resuelve con el contenedor creado
 */
window.createScaledContainer = function(className = 'game-screen', options = {}) {
    return new Promise((resolve, reject) => {
        window.waitForScaleManager((contentWrapper, scaleManager) => {
            const container = document.createElement('div');
            container.className = className;
            
            // Estilos por defecto para ocupar todo el canvas virtual
            const defaultStyles = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
                overflow: 'hidden',
                ...options.styles
            };
            
            // Aplicar estilos
            Object.assign(container.style, defaultStyles);
            
            // Agregar al wrapper del ScaleManager
            contentWrapper.appendChild(container);
            
            resolve(container);
        }, 20, 50);
    });
};

/**
 * Función helper para obtener coordenadas centradas en el canvas virtual
 * @param {number} width - Ancho del elemento
 * @param {number} height - Alto del elemento
 * @returns {{x: number, y: number}} Coordenadas para centrar el elemento
 */
window.getCenterCoordinates = function(width = 0, height = 0) {
    return {
        x: 640 - (width / 2),   // Centro horizontal del canvas 1280x720
        y: 360 - (height / 2)   // Centro vertical del canvas 1280x720
    };
};

/**
 * Función helper para posicionar elementos fácilmente en el canvas virtual
 * @param {HTMLElement} element - Elemento a posicionar
 * @param {number} x - Coordenada X en el canvas virtual (0-1280)
 * @param {number} y - Coordenada Y en el canvas virtual (0-720)
 * @param {string} anchor - Punto de anclaje: 'top-left', 'center', 'top-center', etc.
 */
window.positionInCanvas = function(element, x, y, anchor = 'top-left') {
    element.style.position = 'absolute';
    
    switch(anchor) {
        case 'center':
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.transform = 'translate(-50%, -50%)';
            break;
        case 'top-center':
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.transform = 'translateX(-50%)';
            break;
        case 'bottom-center':
            element.style.left = x + 'px';
            element.style.bottom = (720 - y) + 'px';
            element.style.transform = 'translateX(-50%)';
            break;
        case 'center-left':
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.transform = 'translateY(-50%)';
            break;
        case 'center-right':
            element.style.right = (1280 - x) + 'px';
            element.style.top = y + 'px';
            element.style.transform = 'translateY(-50%)';
            break;
        default: // 'top-left'
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            break;
    }
};

// Exportar para uso modular (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScaleManager, createScaleManager };
}