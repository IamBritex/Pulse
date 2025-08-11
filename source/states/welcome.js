/**
 * Welcome State - Pantalla de bienvenida
 */
class WelcomeState {
    constructor() {
        this.container = null;
        this.backgroundImage = null;
        this.titleElement = null;
        this.splashTextElement = null;
        this.isLoaded = false;
        this.keyListener = null;
        this.isTransitioning = false;
        
        // Propiedades para el efecto parallax
        this.parallaxEnabled = false;
        this.parallaxListener = null;
        
        this.init();
    }
    
    init() {
        this.createWelcomeScreen();
        this.loadBackgroundImage();
        this.setupKeyListener();
    }
    
    createWelcomeScreen() {
        // Obtener el contenedor del juego
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) {
            console.error('Game container not found');
            return;
        }
        
        // IMPORTANTE: Buscar el wrapper .content que crea el ScaleManager
        // Si no existe, esperar a que se cree
        let contentWrapper = gameContainer.querySelector('.content');
        if (!contentWrapper) {
            // Si el ScaleManager aún no ha creado el wrapper, esperamos un poco
            setTimeout(() => this.createWelcomeScreen(), 50);
            return;
        }
        
        // Crear el contenedor principal del welcome
        this.container = document.createElement('div');
        this.container.className = 'welcome-state';
        
        // Crear elemento de imagen de fondo
        this.backgroundImage = document.createElement('img');
        this.backgroundImage.className = 'welcome-bg';
        this.backgroundImage.src = 'public/assets/images/bg.png';
        this.backgroundImage.alt = 'Pulse Background';
        
        // Agregar imagen al contenedor
        this.container.appendChild(this.backgroundImage);
        
        // Crear el título PULSE
        this.createTitle();
        
        // Crear el texto splash en la parte inferior
        this.createSplashText();
        
        // CRÍTICO: Agregar al wrapper .content, NO al game-container directamente
        contentWrapper.appendChild(this.container);
    }
    
    createTitle() {
        // Crear elemento del título
        const title = document.createElement('div');
        title.className = 'pulse-title';
        title.textContent = 'PULSE';
        
        // Agregar título al contenedor
        this.container.appendChild(title);
        
        // Guardar referencia para animaciones futuras
        this.titleElement = title;
    }
    
    createSplashText() {
        // Crear elemento del texto splash
        const splashText = document.createElement('div');
        splashText.className = 'splash-text';
        splashText.innerHTML = 'Presiona cualquier tecla para<br>continuar';
        
        // Agregar texto splash al contenedor
        this.container.appendChild(splashText);
        
        // Guardar referencia para animaciones futuras
        this.splashTextElement = splashText;
    }
    
    loadBackgroundImage() {
        // Manejar la carga de la imagen
        this.backgroundImage.onload = () => {
            this.isLoaded = true;
            this.onImageLoaded();
        };
        
        this.backgroundImage.onerror = () => {
            console.error('Error loading background image: public/assets/images/bg.png');
            this.showFallback();
        };
    }
    
    onImageLoaded() {
        // Agregar fade-in effect cuando la imagen se carga
        this.backgroundImage.style.opacity = '0';
        this.backgroundImage.style.transition = 'opacity 0.5s ease-in-out';
        
        // Trigger fade-in
        requestAnimationFrame(() => {
            this.backgroundImage.style.opacity = '1';
        });
        
        // Configurar parallax después de la carga
        setTimeout(() => {
            this.setupParallaxEffect();
        }, 500);
        
        console.log('Welcome background loaded successfully');
    }
    
    showFallback() {
        // Mostrar color de fondo si la imagen no carga
        this.backgroundImage.style.cssText += `
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 24px;
            font-weight: bold;
        `;
        this.backgroundImage.innerHTML = 'PULSE';
        this.backgroundImage.removeAttribute('src');
    }
    
    setupParallaxEffect() {
        if (!this.backgroundImage || !this.container) return;
        
        this.parallaxListener = (event) => {
            this.updateParallax(event);
        };
        
        // Agregar listener al contenedor del juego
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.addEventListener('mousemove', this.parallaxListener);
            this.parallaxEnabled = true;
            console.log('Welcome parallax effect enabled');
        }
    }
    
    updateParallax(event) {
        if (!this.backgroundImage || !this.parallaxEnabled) return;
        
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        // Obtener las dimensiones y posición del contenedor
        const rect = gameContainer.getBoundingClientRect();
        
        // Calcular la posición del mouse relativa al contenedor (0-1)
        const mouseX = (event.clientX - rect.left) / rect.width;
        const mouseY = (event.clientY - rect.top) / rect.height;
        
        // Centrar los valores (convertir de 0-1 a -0.5 a 0.5)
        const centerX = mouseX - 0.5;
        const centerY = mouseY - 0.5;
        
        // Calcular el desplazamiento del parallax (mayor intensidad para movimiento más visible)
        const parallaxStrength = 50; // Mayor intensidad para movimiento más visible
        const offsetX = centerX * parallaxStrength;
        const offsetY = centerY * parallaxStrength;
        
        // Aplicar la transformación al fondo
        this.backgroundImage.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    
    removeParallaxEffect() {
        if (this.parallaxListener) {
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer) {
                gameContainer.removeEventListener('mousemove', this.parallaxListener);
            }
            this.parallaxListener = null;
            this.parallaxEnabled = false;
            
            // Resetear la posición del fondo
            if (this.backgroundImage) {
                this.backgroundImage.style.transform = 'translate(0px, 0px)';
            }
            
            console.log('Welcome parallax effect disabled');
        }
    }

    /**
     * Configura el listener para detectar cualquier tecla presionada
     */
    setupKeyListener() {
        this.keyListener = (event) => {
            // Solo procesar si no estamos en transición
            if (!this.isTransitioning && this.isLoaded) {
                console.log('Key pressed, starting transition to main menu');
                this.transitionToMainMenu();
            }
        };
        
        // Agregar listener para cualquier tecla
        document.addEventListener('keydown', this.keyListener);
        
        // También agregar listener para clicks (opcional)
        document.addEventListener('click', this.keyListener);
        document.addEventListener('touchstart', this.keyListener);
    }
    
    /**
     * Inicia la transición al main menu (animación in-place)
     */
    transitionToMainMenu() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        console.log('Transitioning to main menu...');
        
        // Remover listeners para evitar múltiples transiciones
        this.removeKeyListener();
        
        // Animar el título a su nueva posición y propiedades
        if (this.titleElement) {
            this.titleElement.style.top = '15%';
            this.titleElement.style.left = '15%';
            this.titleElement.style.fontSize = '80px';
            this.titleElement.style.color = 'rgba(255, 255, 255, 0.8)';
        }
        
        // Animar el splash text a su nueva posición y cambiar contenido
        if (this.splashTextElement) {
            this.splashTextElement.style.top = '22%';
            this.splashTextElement.style.left = '15%';
            this.splashTextElement.style.width = '237px';
            this.splashTextElement.style.height = '27px';
            this.splashTextElement.style.lineHeight = '1px';
            this.splashTextElement.style.transform = 'translate(-50%, -50%)';
            this.splashTextElement.innerHTML = 'Now with Ray Tracing';
        }
        
        // Marcar como completado después de la animación
        setTimeout(() => {
            this.isTransitioning = false;
            console.log('Transition to main menu completed');
            
            // Cambiar clase del contenedor para indicar que estamos en main menu
            this.container.className = 'main-menu-state';
            
            // Crear instancia del MainMenuState para manejar los objetos del menú
            const initMainMenu = () => {
                if (typeof MainMenuState !== 'undefined' && window.MainMenuState) {
                    if (!window.mainMenuState) {
                        window.mainMenuState = new MainMenuState();
                    }
                    window.mainMenuState.init();
                    window.mainMenuState.transitionFromWelcome();
                    
                    // Opcional: agregar listeners para el main menu aquí
                    this.setupMainMenuListeners();
                } else {
                    // Esperar un poco más si MainMenuState no está disponible
                    console.log('Waiting for MainMenuState to load...');
                    setTimeout(initMainMenu, 100);
                }
            };
            
            initMainMenu();
        }, 800); // Duración de la transición CSS de elementos
    }
    
    /**
     * Configura listeners para el main menu (placeholder para futuras funcionalidades)
     */
    setupMainMenuListeners() {
        // Aquí puedes agregar listeners para botones del menú, navegación, etc.
        console.log('Main menu is ready for interaction');
    }
    
    /**
     * Remueve los listeners de teclas
     */
    removeKeyListener() {
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
            document.removeEventListener('click', this.keyListener);
            document.removeEventListener('touchstart', this.keyListener);
            this.keyListener = null;
        }
    }
    
    // Métodos de utilidad para otros estados
    destroy() {
        // Remover listeners antes de destruir
        this.removeKeyListener();
        this.removeParallaxEffect();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.backgroundImage = null;
        this.titleElement = null;
        this.splashTextElement = null;
        this.isLoaded = false;
        this.isTransitioning = false;
    }
    
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
    
    show() {
        if (this.container) {
            this.container.style.display = 'flex';
        }
    }
    
    getContainer() {
        return this.container;
    }
    
    isImageLoaded() {
        return this.isLoaded;
    }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el ScaleManager esté completamente inicializado
    setTimeout(() => {
        window.welcomeState = new WelcomeState();
    }, 200); // Aumentamos el tiempo para asegurar que el wrapper .content esté creado
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.WelcomeState = WelcomeState;
}