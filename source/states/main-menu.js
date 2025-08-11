/**
 * Main Menu State - Menú principal del juego
 */
class MainMenuState {
    constructor() {
        this.container = null;
        this.backgroundImage = null;
        this.titleElement = null;
        this.splashTextElement = null;
        this.backgroundObjectElement = null;
        this.controlCenterElement = null;
        this.timeDisplayElement = null;
        this.localTimeElement = null;
        this.sessionTimeElement = null;
        this.sessionStartTime = Date.now();
        this.timeUpdateInterval = null;
        this.splashTexts = []; // Array para almacenar las líneas de splash text
        this.userObjElement = null;
        this.usernameElement = null;
        this.userAvatarElement = null;
        this.socialObjElement = null;
        this.socialIconElement = null;
        this.socialTextElement = null;
        this.dlButtonElement = null;
        this.infoBtnElement = null;
        this.musicBtnElement = null;
        this.optionsButtonElement = null;
        this.noticiasElement = null;
        this.noticiasTextElement = null;
        this.noticiasBitmapElement = null;
        this.noticiasContentElement = null;
        this.noticiasDividerElement = null;
        this.noticiasReadMoreElement = null;
        this.playElement = null;
        this.multijugadorElement = null;
        this.editorElement = null;
        this.explorarElement = null;
        this.exitElement = null;
        this.isLoaded = false;
        this.isTransitioning = false;
        
        // Propiedades para la modal de info
        this.infoModalOverlay = null;
        this.webInfoObj = null;
        this.infoModalContent = null;
        this.infoModalClose = null;
        this.infoModalExtraBtn = null;
        this.isInfoModalOpen = false;
        this.webViewerInfo = null; // Instancia del web viewer
        this.currentUrl = 'https://iambritex.github.io/Pulse-web/'; // URL que se mostrará en el web viewer
        
        // Propiedades para el efecto parallax
        this.parallaxEnabled = false;
        this.parallaxListener = null;
        this.currentParallaxX = 0;
        this.currentParallaxY = 0;
        this.targetParallaxX = 0;
        this.targetParallaxY = 0;
        this.parallaxAnimationId = null;
        
        // Propiedades para el control de zoom del background
        this.backgroundZoomed = true; // Estado del zoom (true = zoomed, false = original)
        this.backgroundZoomAnimationId = null;
        this.isModalOpen = false; // Estado general de modales abiertas
        
        // Sistema de audio para efectos de sonido
        this.audioSystem = {
            openWindow: null,
            clickDown: null,
            clickUp: null
        };
        
        // No inicializar automáticamente, será llamado desde WelcomeState
    }
    
    init() {
        // Reiniciar el tiempo de sesión cada vez que se inicializa
        this.sessionStartTime = Date.now();
        this.createMainMenuScreen();
        this.loadBackgroundImage();
        this.loadSplashTexts(); // Cargar los textos de splash
        this.initializeAudioSystem(); // Inicializar sistema de audio
    }
    
    /**
     * Inicializa el sistema de audio para efectos de sonido
     */
    initializeAudioSystem() {
        try {
            // Cargar sonidos para modales
            this.audioSystem.openWindow = new Audio('public/assets/sounds/openWindow.ogg');
            this.audioSystem.clickDown = new Audio('public/assets/sounds/ClickDown.ogg');
            this.audioSystem.clickUp = new Audio('public/assets/sounds/ClickUp.ogg');
            
            // Configurar volumen
            Object.values(this.audioSystem).forEach(audio => {
                if (audio) {
                    audio.volume = 1; // Nivel de volumen
                    audio.preload = 'auto';
                }
            });
            
            console.log('Audio system initialized successfully');
        } catch (error) {
            console.warn('Error initializing audio system:', error);
        }
    }
    
    /**
     * Reproduce un sonido específico
     * @param {string} soundName - Nombre del sonido ('openWindow', 'clickDown', 'clickUp')
     */
    playSound(soundName) {
        try {
            const audio = this.audioSystem[soundName];
            if (audio) {
                // Resetear el audio para permitir reproducción múltiple
                audio.currentTime = 0;
                audio.play().catch(error => {
                    console.warn(`Error playing sound ${soundName}:`, error);
                });
            } else {
                console.warn(`Sound ${soundName} not found in audio system`);
            }
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }
    
    createMainMenuScreen() {
        // Obtener el contenedor del juego
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) {
            console.error('Game container not found');
            return;
        }
        
        // IMPORTANTE: Buscar el wrapper .content que crea el ScaleManager
        let contentWrapper = gameContainer.querySelector('.content');
        if (!contentWrapper) {
            setTimeout(() => this.createMainMenuScreen(), 50);
            return;
        }
        
        // Crear el contenedor principal del main menu
        this.container = document.createElement('div');
        this.container.className = 'main-menu-state';
        
        // Crear elemento de imagen de fondo (reutiliza la misma imagen)
        this.backgroundImage = document.createElement('img');
        this.backgroundImage.className = 'main-menu-bg';
        this.backgroundImage.src = 'public/assets/images/bg.png';
        this.backgroundImage.alt = 'Pulse Background';
        
        this.container.appendChild(this.backgroundImage);
        
        // Crear el título PULSE
        this.createTitle();
        
        // Crear el texto splash
        this.createSplashText();
        
        // Crear el nav
        this.createControlCenter();
        
        // Crear el cuadro de fondo
        this.createBackgroundObject();
        
        // Crear todos los objetos del menú
        this.createMenuObjects();
        
        // Crear el objeto de noticias
        this.createNoticiasObject();
        
        // CRÍTICO: Agregar al wrapper .content, NO al game-container directamente
        contentWrapper.appendChild(this.container);
    }
    
    createTitle() {
        // Crear elemento del título
        const title = document.createElement('div');
        title.className = 'pulse-title-menu';
        title.textContent = 'PULSE';
        
        // Agregar título al contenedor
        this.container.appendChild(title);
        
        // Guardar referencia para animaciones futuras
        this.titleElement = title;
    }
    
    createSplashText() {
        // Crear elemento del texto splash
        const splashText = document.createElement('div');
        splashText.className = 'splash-text-menu';
        splashText.textContent = 'Loading...'; // Texto temporal hasta cargar el archivo
        
        // Agregar texto splash al contenedor
        this.container.appendChild(splashText);
        
        // Guardar referencia para animaciones futuras
        this.splashTextElement = splashText;
    }
    
    createControlCenter() {
        // Crear elemento de la barra de navegación superior
        const controlCenter = document.createElement('div');
        controlCenter.className = 'controlcenter-body';
        
        // Crear el contenedor del tiempo
        this.createTimeDisplay(controlCenter);
        
        // Crear el objeto de usuario
        this.createUserObject(controlCenter);
        
        // Crear el objeto social
        this.createSocialObject(controlCenter);
        
        // Crear botones de navegación
        this.createNavigationButtons(controlCenter);
        
        // Agregar barra de navegación al contenedor
        this.container.appendChild(controlCenter);
        
        // Guardar referencia
        this.controlCenterElement = controlCenter;
        
        // Iniciar el timer de actualización de tiempo
        this.startTimeUpdate();
    }
    
    createTimeDisplay(parent) {
        // Crear contenedor del tiempo
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'time-display';
        
        // Crear elemento de tiempo local
        const localTime = document.createElement('div');
        localTime.className = 'local-time';
        
        // Crear elemento de tiempo de sesión
        const sessionTime = document.createElement('div');
        sessionTime.className = 'session-time';
        
        // Agregar elementos al contenedor de tiempo
        timeDisplay.appendChild(localTime);
        timeDisplay.appendChild(sessionTime);
        
        // Agregar contenedor de tiempo al parent
        parent.appendChild(timeDisplay);
        
        // Guardar referencias
        this.timeDisplayElement = timeDisplay;
        this.localTimeElement = localTime;
        this.sessionTimeElement = sessionTime;
        
        // Actualizar inmediatamente
        this.updateTimeDisplay();
    }
    
    startTimeUpdate() {
        // Limpiar interval anterior si existe
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }
        
        // Actualizar cada segundo
        this.timeUpdateInterval = setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);
    }
    
    updateTimeDisplay() {
        if (!this.localTimeElement || !this.sessionTimeElement) return;
        
        // Actualizar tiempo local en formato AM/PM
        const now = new Date();
        const localTimeString = now.toLocaleTimeString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        this.localTimeElement.textContent = localTimeString;
        
        // Calcular tiempo de sesión
        const sessionElapsed = Date.now() - this.sessionStartTime;
        const hours = Math.floor(sessionElapsed / (1000 * 60 * 60));
        const minutes = Math.floor((sessionElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((sessionElapsed % (1000 * 60)) / 1000);
        
        this.sessionTimeElement.textContent = `${hours}h ${minutes}m ${seconds}s en esta sesion`;
    }
    
    createUserObject(parent) {
        // Crear contenedor del objeto de usuario
        const userObj = document.createElement('div');
        userObj.className = 'user-obj';
        
        // Crear imagen de avatar (placeholder para usuarios no logueados)
        const userAvatar = document.createElement('img');
        userAvatar.className = 'user-avatar';
        userAvatar.src = 'public/assets/images/Placeholder.png';
        userAvatar.alt = 'User Avatar Placeholder';
        
        // Crear elemento de nombre de usuario
        const username = document.createElement('div');
        username.className = 'username';
        username.textContent = 'login'; // Mostrar "login" cuando no hay sesión iniciada
        
        // Agregar elementos al contenedor de usuario
        userObj.appendChild(userAvatar);
        userObj.appendChild(username);
        
        // Agregar contenedor de usuario al parent
        parent.appendChild(userObj);
        
        // Guardar referencias
        this.userObjElement = userObj;
        this.usernameElement = username;
        this.userAvatarElement = userAvatar;
    }
    
    createSocialObject(parent) {
        // Crear contenedor del objeto social
        const socialObj = document.createElement('div');
        socialObj.className = 'social-obj';
        
        // Crear imagen del icono social
        const socialIcon = document.createElement('img');
        socialIcon.className = 'social-icon';
        socialIcon.src = 'public/assets/images/main-menu/social.png';
        socialIcon.alt = 'Social Icon';
        
        // Crear elemento de texto social
        const socialText = document.createElement('div');
        socialText.className = 'social-text';
        socialText.textContent = 'Social';
        
        // Agregar elementos al contenedor social
        socialObj.appendChild(socialIcon);
        socialObj.appendChild(socialText);
        
        // Agregar contenedor social al parent
        parent.appendChild(socialObj);
        
        // Guardar referencias
        this.socialObjElement = socialObj;
        this.socialIconElement = socialIcon;
        this.socialTextElement = socialText;
    }
    
    createNavigationButtons(parent) {
        // Crear botón DL como imagen
        const dlButton = document.createElement('img');
        dlButton.className = 'dl-button';
        dlButton.src = 'public/assets/images/main-menu/DL-button.png';
        dlButton.alt = 'DL Button';
        
        // Crear botón Info como imagen
        const infoBtn = document.createElement('img');
        infoBtn.className = 'info-btn';
        infoBtn.src = 'public/assets/images/main-menu/info-btn.png';
        infoBtn.alt = 'Info Button';
        
        // Crear botón Music como imagen
        const musicBtn = document.createElement('img');
        musicBtn.className = 'music-btn';
        musicBtn.src = 'public/assets/images/main-menu/music.png';
        musicBtn.alt = 'Music Button';
        
        // Crear botón Options como imagen
        const optionsButton = document.createElement('img');
        optionsButton.className = 'options-button';
        optionsButton.src = 'public/assets/images/main-menu/options-button.png';
        optionsButton.alt = 'Options Button';
        
        // Agregar botones al parent
        parent.appendChild(dlButton);
        parent.appendChild(infoBtn);
        parent.appendChild(musicBtn);
        parent.appendChild(optionsButton);
        
        // Guardar referencias
        this.dlButtonElement = dlButton;
        this.infoBtnElement = infoBtn;
        this.musicBtnElement = musicBtn;
        this.optionsButtonElement = optionsButton;
    }
    
    createBackgroundObject() {
        // Crear elemento del cuadro de fondo
        const backgroundObj = document.createElement('div');
        backgroundObj.className = 'background-obj';
        
        // Agregar cuadro de fondo al contenedor
        this.container.appendChild(backgroundObj);
        
        // Guardar referencia
        this.backgroundObjectElement = backgroundObj;
    }
    
    createNoticiasObject() {
        // Crear elemento del cuadro de noticias
        const noticiasObj = document.createElement('div');
        noticiasObj.className = 'noticias-obj';
        
        // Crear elemento del texto "Noticias"
        const noticiasText = document.createElement('div');
        noticiasText.className = 'noticias-text';
        noticiasText.textContent = 'Noticias';
        
        // Crear elemento de imagen para mostrar la imagen del markdown
        const noticiasImage = document.createElement('img');
        noticiasImage.className = 'noticias-bitmap';
        noticiasImage.style.cssText = `
            width: 242.49px;
            height: 135.49px;
            object-fit: cover;
            object-position: center;
            border-radius: 10px;
            display: block;
        `;
        noticiasImage.alt = 'Imagen de noticias';
        
        // Crear contenedor de contenido de noticias
        const noticiasContent = document.createElement('div');
        noticiasContent.className = 'noticias-content';
        
        // Crear línea divisoria
        const noticiasDivider = document.createElement('div');
        noticiasDivider.className = 'noticias-divider';
        
        // Crear texto "Leer más noticias..."
        const noticiasReadMore = document.createElement('div');
        noticiasReadMore.className = 'noticias-read-more';
        noticiasReadMore.textContent = 'Leer más noticias...';
        
        // Agregar elementos al cuadro de noticias
        noticiasObj.appendChild(noticiasText);
        noticiasObj.appendChild(noticiasImage);
        noticiasObj.appendChild(noticiasContent);
        noticiasObj.appendChild(noticiasDivider);
        noticiasObj.appendChild(noticiasReadMore);
        
        // Agregar cuadro de noticias al contenedor
        this.container.appendChild(noticiasObj);
        
        // Guardar referencias
        this.noticiasElement = noticiasObj;
        this.noticiasTextElement = noticiasText;
        this.noticiasBitmapElement = noticiasImage;
        this.noticiasContentElement = noticiasContent;
        this.noticiasDividerElement = noticiasDivider;
        this.noticiasReadMoreElement = noticiasReadMore;
        
        // Cargar el contenido del archivo MD más reciente
        this.loadLatestNewsContent();
    }
    
    /**
     * Configura los event listeners para los botones del menú
     */
    setupButtonListeners() {
        // Listener para botón DL
        if (this.dlButtonElement) {
            this.dlButtonElement.addEventListener('click', () => {
                this.animateButtonJump(this.dlButtonElement);
                console.log('DL button clicked');
            });
        }
        
        // Listener para botón Info
        if (this.infoBtnElement) {
            this.infoBtnElement.addEventListener('click', () => {
                this.animateButtonJump(this.infoBtnElement);
                this.showInfoModal();
                console.log('Info button clicked - Modal opened');
            });
        }
        
        // Listener para botón Music
        if (this.musicBtnElement) {
            this.musicBtnElement.addEventListener('click', () => {
                this.animateButtonJump(this.musicBtnElement);
                console.log('Music button clicked');
            });
        }
        
        // Listener para botón Options
        if (this.optionsButtonElement) {
            this.optionsButtonElement.addEventListener('click', () => {
                this.animateButtonJump(this.optionsButtonElement);
                console.log('Options button clicked');
            });
        }
        
        console.log('Button listeners configured');
    }
    
    /**
     * Anima el efecto de salto de un botón
     */
    animateButtonJump(buttonElement) {
        if (!buttonElement) return;
        
        // Agregar clase de animación
        buttonElement.classList.add('jump');
        
        // Remover la clase después de la animación
        setTimeout(() => {
            buttonElement.classList.remove('jump');
        }, 300);
    }
    
    /**
     * Remueve los event listeners de los botones
     */
    removeButtonListeners() {
        // Nota: Como usamos addEventListener con funciones arrow inline,
        // no podemos removerlas específicamente. En su lugar, los elementos
        // se limpiarán cuando se destruya el contenedor.
        console.log('Button listeners will be cleaned up with container destruction');
    }
    
    /**
     * Carga dinámicamente el componente web-viewer
     */
    async loadWebViewerComponent() {
        return new Promise((resolve, reject) => {
            // Verificar si ya está cargado
            if (window.WebViewerInfo) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'source/states/components/web-viewer-info.js';
            script.onload = () => {
                console.log('Web viewer component loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load web viewer component');
                reject(new Error('Failed to load web viewer component'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Crea la modal de información
     */
    createInfoModal() {
        // Crear overlay de fondo con blur
        this.infoModalOverlay = document.createElement('div');
        this.infoModalOverlay.className = 'info-modal-overlay';
        
        // Crear ventana principal de la modal
        this.webInfoObj = document.createElement('div');
        this.webInfoObj.className = 'web-info-obj';
        
        // Crear botón de cerrar con imagen
        this.infoModalClose = document.createElement('button');
        this.infoModalClose.className = 'info-modal-close';
        this.infoModalClose.setAttribute('aria-label', 'Cerrar ventana de información');
        
        const closeImg = document.createElement('img');
        closeImg.src = 'public/assets/images/main-menu/quit-btn.png';
        closeImg.alt = 'Cerrar';
        this.infoModalClose.appendChild(closeImg);
        
        // Crear botón adicional con imagen (go-to button)
        this.infoModalExtraBtn = document.createElement('button');
        this.infoModalExtraBtn.className = 'info-modal-extra-btn';
        this.infoModalExtraBtn.setAttribute('aria-label', 'Abrir en nueva pestaña');
        
        const extraImg = document.createElement('img');
        extraImg.src = 'public/assets/images/main-menu/go-to-btn.png';
        extraImg.alt = 'Go To';
        this.infoModalExtraBtn.appendChild(extraImg);
        
        // Crear contenido de la modal como contenedor para el web viewer
        this.infoModalContent = document.createElement('div');
        this.infoModalContent.className = 'info-modal-content';
        this.infoModalContent.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.1);
        `;
        
        // Ensamblar la modal
        this.webInfoObj.appendChild(this.infoModalClose);
        this.webInfoObj.appendChild(this.infoModalExtraBtn);
        this.webInfoObj.appendChild(this.infoModalContent);
        this.infoModalOverlay.appendChild(this.webInfoObj);
        
        // Agregar event listeners
        this.infoModalClose.addEventListener('click', () => {
            this.playSound('clickDown'); // Sonido de cerrar modal
            this.hideInfoModal();
        });
        
        // Event listener para el botón go-to (abrir en nueva pestaña)
        this.infoModalExtraBtn.addEventListener('click', () => {
            this.playSound('clickUp'); // Sonido de ir a la página
            if (this.currentUrl) {
                window.open(this.currentUrl, '_blank');
                console.log('Opening URL in new tab:', this.currentUrl);
            }
        });
        
        // Cerrar modal al hacer click en el overlay (fuera de la ventana)
        this.infoModalOverlay.addEventListener('click', (event) => {
            if (event.target === this.infoModalOverlay) {
                this.playSound('clickDown'); // Sonido de cerrar modal
                this.hideInfoModal();
            }
        });
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isInfoModalOpen) {
                this.playSound('clickDown'); // Sonido de cerrar modal
                this.hideInfoModal();
            }
        });
        
        console.log('Info modal created');
    }
    
    /**
     * Muestra la modal de información con animaciones
     */
    async showInfoModal() {
        if (this.isInfoModalOpen) return;
        
        // Reproducir sonido de abrir ventana
        this.playSound('openWindow');
        
        // Desactivar parallax y hacer zoom out del background
        this.disableParallaxAndZoomOut();
        
        // Crear la modal si no existe
        if (!this.infoModalOverlay) {
            this.createInfoModal();
        }
        
        // Agregar modal al contenedor
        if (this.container) {
            this.container.appendChild(this.infoModalOverlay);
        }
        
        // Cargar dinámicamente el web viewer y crear instancia
        try {
            await this.loadWebViewerComponent();
            
            // Crear instancia del web viewer si no existe
            if (!this.webViewerInfo) {
                this.webViewerInfo = new WebViewerInfo();
            }
            
            // Crear el iframe con la URL externa
            this.webViewerInfo.createWebFrame(this.currentUrl, this.infoModalContent);
            
        } catch (error) {
            console.error('Error loading web viewer:', error);
            // Fallback: mostrar mensaje de error
            this.infoModalContent.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: rgba(255, 255, 255, 0.9); text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 20px;">EY!</div>
                    <h2 style="font-size: 24px; margin-bottom: 15px;">Error de Conexión</h2>
                    <p style="font-size: 16px; max-width: 80%; opacity: 0.8;">
                        No se pudo cargar el contenido web. Verifica tu conexión a internet.
                    </p>
                </div>
            `;
        }
        
        // Mostrar modal con animación
        setTimeout(() => {
            this.infoModalOverlay.classList.add('show');
            this.isInfoModalOpen = true;
        }, 10);
        
        console.log('Info modal shown with parallax disabled and background zoomed out');
    }
    
    /**
     * Cambia la URL del web viewer
     * @param {string} newUrl - Nueva URL a mostrar
     */
    setWebViewerUrl(newUrl) {
        this.currentUrl = newUrl;
        if (this.webViewerInfo && this.isInfoModalOpen) {
            this.webViewerInfo.updateUrl(newUrl);
        }
    }

    /**
     * Oculta la modal de información con animaciones
     */
    hideInfoModal() {
        if (!this.isInfoModalOpen || !this.infoModalOverlay) return;
        
        // Ocultar modal con animación
        this.infoModalOverlay.classList.remove('show');
        this.isInfoModalOpen = false;
        
        // Reactivar parallax y hacer zoom in del background
        this.enableParallaxAndZoomIn();
        
        // Destruir web viewer si existe
        if (this.webViewerInfo) {
            this.webViewerInfo.destroy();
            this.webViewerInfo = null;
        }
        
        // Remover del DOM después de la animación
        setTimeout(() => {
            if (this.infoModalOverlay && this.infoModalOverlay.parentNode) {
                this.infoModalOverlay.parentNode.removeChild(this.infoModalOverlay);
            }
        }, 300);
        
        console.log('Info modal hidden with parallax enabled and background zoomed in');
    }
    
    displayFallbackImage() {
        if (!this.noticiasBitmapElement) return;
        
        // Usar una imagen placeholder o crear una imagen de fallback
        this.noticiasBitmapElement.src = 'public/assets/images/Placeholder.png';
        this.noticiasBitmapElement.alt = 'Sin imagen disponible';
        
        console.log('Mostrando imagen de fallback para noticias');
    }
    
    async loadLatestNewsContent() {
        if (!this.noticiasContentElement) return;
        
        try {
            // Cargar el archivo news.md desde la nueva ruta
            const response = await fetch('web/news/news.md');
            if (response.ok) {
                const content = await response.text();
                
                // Obtener la fecha de última modificación del header de respuesta
                const lastModified = response.headers.get('last-modified');
                let fileDate = null;
                if (lastModified) {
                    fileDate = new Date(lastModified);
                } else {
                    // Fallback: usar fecha actual
                    fileDate = new Date();
                }
                
                this.displayNewsContent(content, fileDate);
                this.extractAndDisplayImage(content);
            } else {
                this.displayFallbackNews();
            }
        } catch (error) {
            console.log('No se pudo cargar el contenido de noticias:', error);
            this.displayFallbackNews();
        }
    }
    
    displayNewsContent(content, fileDate = null) {
        if (!this.noticiasContentElement) return;
        
        // Limpiar el contenedor y cambiar a innerHTML para manejar HTML
        this.noticiasContentElement.innerHTML = '';
        
        // Calcular tiempo transcurrido desde la última modificación
        let timeAgo = '';
        if (fileDate) {
            const now = new Date();
            const diffMs = now - fileDate;
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);
            
            if (diffSeconds < 60) {
                timeAgo = `(hace ${diffSeconds}s)`;
            } else if (diffMinutes < 60) {
                timeAgo = `(hace ${diffMinutes}m)`;
            } else if (diffHours < 24) {
                timeAgo = `(hace ${diffHours}h)`;
            } else if (diffDays === 1) {
                timeAgo = `(hace 1 día)`;
            } else if (diffDays < 7) {
                timeAgo = `(hace ${diffDays} días)`;
            } else if (diffWeeks === 1) {
                timeAgo = `(hace 1 semana)`;
            } else if (diffWeeks < 4) {
                timeAgo = `(hace ${diffWeeks} semanas)`;
            } else if (diffMonths === 1) {
                timeAgo = `(hace 1 mes)`;
            } else if (diffMonths < 12) {
                timeAgo = `(hace ${diffMonths} meses)`;
            } else if (diffYears === 1) {
                timeAgo = `(hace 1 año)`;
            } else if (diffYears > 1) {
                timeAgo = `(hace ${diffYears} años)`;
            } else {
                // Formato dd/mm/aa para fechas muy antiguas
                const day = fileDate.getDate().toString().padStart(2, '0');
                const month = (fileDate.getMonth() + 1).toString().padStart(2, '0');
                const year = fileDate.getFullYear().toString().slice(-2);
                timeAgo = `(${day}/${month}/${year})`;
            }
        }
        
        // Procesar el contenido markdown
        let processedContent = content
            // Remover referencias de imágenes con formato [![IMG](...)]
            .replace(/\[\!\[IMG\]\([^)]*\)\]/g, '')
            // Remover otros enlaces de imagen simples ![...](...) que no queremos mostrar
            .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
            // Procesar encabezados de markdown manteniendo la jerarquía
            .replace(/^### (.+)$/gm, '<h4 style="font-size: 14px; font-weight: 600; margin: 8px 0 4px 0; color: rgba(255, 255, 255, 0.95);">$1</h4>')
            .replace(/^## (.+)$/gm, '<h3 style="font-size: 16px; font-weight: 600; margin: 10px 0 6px 0; color: rgba(255, 255, 255, 0.95);">$1</h3>')
            .replace(/^# (.+)$/gm, '<h2 style="font-size: 18px; font-weight: 600; margin: 12px 0 8px 0; color: rgba(255, 255, 255, 0.95);">$1</h2>')
            // Procesar texto en negrita
            .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: rgba(255, 255, 255, 0.95);">$1</strong>')
            // Procesar texto en cursiva
            .replace(/\*(.+?)\*/g, '<em style="font-style: italic; color: rgba(255, 255, 255, 0.9);">$1</em>')
            // Procesar enlaces manteniendo solo el texto
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Limpiar líneas vacías múltiples
            .replace(/\n\s*\n/g, '\n')
            .trim();
        
        // Si el contenido es muy corto después del procesamiento, usar fallback
        if (processedContent.replace(/<[^>]*>/g, '').length < 10) {
            this.displayFallbackNews();
            return;
        }
        
        // Crear el contenido final con la fecha
        let finalHTML = '';
        
        // Agregar indicador de tiempo si existe
        if (timeAgo) {
            finalHTML += `<div style="font-size: 9px; color: rgba(255, 255, 255, 0.6); margin-bottom: 8px; font-weight: 400;">${timeAgo}</div>`;
        }
        
        // Dividir en párrafos y procesar cada uno
        const paragraphs = processedContent.split('\n').filter(p => p.trim());
        
        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i].trim();
            
            // Si ya es un encabezado HTML, agregarlo directamente
            if (paragraph.startsWith('<h')) {
                finalHTML += paragraph;
            } else if (paragraph.length > 0) {
                // Es un párrafo normal
                finalHTML += `<p style="margin: 4px 0; line-height: 1.4; font-size: 12px; color: rgba(255, 255, 255, 0.9);">${paragraph}</p>`;
            }
        }
        
        // Aplicar estilos de contenedor para mejor interlineado
        this.noticiasContentElement.style.cssText += `
            line-height: 1.3;
            word-spacing: normal;
            letter-spacing: 0px;
        `;
        
        this.noticiasContentElement.innerHTML = finalHTML;
    }
    
    displayFallbackNews() {
        if (!this.noticiasContentElement) return;
        
        const fallbackContent = 'Bienvenido a Pulse! Aquí encontrarás las últimas noticias y actualizaciones del juego. Mantente al día con nuevas funcionalidades, eventos especiales y mucho más...';
        this.noticiasContentElement.textContent = fallbackContent;
    }
    
    extractAndDisplayImage(markdownContent) {
        if (!this.noticiasBitmapElement) return;
        
        // Buscar la primera imagen en el markdown usando regex
        const imageRegex = /!\[.*?\]\((.*?)\)/;
        const match = markdownContent.match(imageRegex);
        
        if (match && match[1]) {
            const imagePath = match[1];
            
            // Configurar el elemento img directamente
            this.noticiasBitmapElement.onload = () => {
                console.log('Imagen de noticias cargada correctamente');
            };
            
            this.noticiasBitmapElement.onerror = () => {
                console.log('Error al cargar imagen, usando fallback');
                this.displayFallbackImage();
            };
            
            // Asignar la ruta de la imagen
            this.noticiasBitmapElement.src = imagePath.startsWith('http') ? imagePath : `web/news/${imagePath}`;
        } else {
            // Si no se encuentra imagen en el markdown, usar fallback
            this.displayFallbackImage();
        }
    }
    
    /**
     * Carga los textos de splash desde el archivo
     */
    async loadSplashTexts() {
        try {
            const response = await fetch('public/assets/data/splash-text.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const content = await response.text();
            
            // Dividir por líneas y filtrar líneas vacías
            this.splashTexts = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
            
            if (this.splashTexts.length === 0) {
                throw new Error('No splash texts found');
            }
            
            // Seleccionar y mostrar un texto aleatorio
            this.displayRandomSplashText();
            
            console.log(`Loaded ${this.splashTexts.length} splash texts`);
            
        } catch (error) {
            console.error('Error loading splash texts:', error);
            this.displayFallbackSplashText();
        }
    }
    
    /**
     * Muestra un texto de splash aleatorio
     */
    displayRandomSplashText() {
        if (!this.splashTextElement || this.splashTexts.length === 0) return;
        
        // Seleccionar índice aleatorio
        const randomIndex = Math.floor(Math.random() * this.splashTexts.length);
        const selectedText = this.splashTexts[randomIndex];
        
        // Actualizar el texto con animación suave
        this.splashTextElement.style.opacity = '0';
        
        setTimeout(() => {
            this.splashTextElement.textContent = selectedText;
            this.splashTextElement.style.opacity = '1';
        }, 15);
        
        console.log(`Displaying splash text: "${selectedText}"`);
    }
    
    /**
     * Muestra texto de splash de fallback si no se puede cargar el archivo
     */
    displayFallbackSplashText() {
        if (!this.splashTextElement) return;
        
        const fallbackTexts = [
            'Now with Ray Tracing',
            '¡Calienta esos dedos!',
            'Feel the beat',
            'Ready to pulse?'
        ];
        
        const randomIndex = Math.floor(Math.random() * fallbackTexts.length);
        this.splashTextElement.textContent = fallbackTexts[randomIndex];
        this.splashTextElement.style.opacity = '1';
    }
    
    /**
     * Crea todos los objetos del menú principal
     */
    createMenuObjects() {
        // Crear objeto Play
        this.playElement = document.createElement('div');
        this.playElement.className = 'play-obj';
        this.playElement.style.pointerEvents = 'auto';
        
        // Crear texto principal para Play
        const playText = document.createElement('div');
        playText.className = 'menu-text';
        playText.textContent = 'Jugar';
        this.playElement.appendChild(playText);
        
        // Crear texto secundario para Play
        const playSecondaryText = document.createElement('div');
        playSecondaryText.className = 'menu-secondary-text';
        playSecondaryText.textContent = '¡Calienta esos dedos!';
        this.playElement.appendChild(playSecondaryText);

        
        // Crear icono para Play
        const playIcon = document.createElement('img');
        playIcon.className = 'menu-icon';
        playIcon.src = 'public/assets/images/main-menu/Play.png';
        playIcon.alt = 'Jugar';
        this.playElement.appendChild(playIcon);
        
        this.container.appendChild(this.playElement);
        
        // Crear objeto Multijugador
        this.multijugadorElement = document.createElement('div');
        this.multijugadorElement.className = 'multijugador-obj';
        this.multijugadorElement.style.pointerEvents = 'auto';
        
        // Crear texto principal para Multijugador
        const multijugadorText = document.createElement('div');
        multijugadorText.className = 'menu-text';
        multijugadorText.textContent = 'Multijugador';
        multijugadorText.style.width = '120px'; // Más ancho para el texto más largo
        this.multijugadorElement.appendChild(multijugadorText);
        
        // Crear texto secundario para Multijugador
        const multijugadorSecondaryText = document.createElement('div');
        multijugadorSecondaryText.className = 'menu-secondary-text';
        multijugadorSecondaryText.textContent = 'Compite contra la comunidad';
        multijugadorSecondaryText.style.width = '180px'; // Más ancho para el texto más largo
        this.multijugadorElement.appendChild(multijugadorSecondaryText);
        
        // Crear icono para Multijugador
        const multijugadorIcon = document.createElement('img');
        multijugadorIcon.className = 'menu-icon';
        multijugadorIcon.src = 'public/assets/images/main-menu/Multiplayer.png';
        multijugadorIcon.alt = 'Multijugador';
        this.multijugadorElement.appendChild(multijugadorIcon);
        
        this.container.appendChild(this.multijugadorElement);
        
        // Crear objeto Editor
        this.editorElement = document.createElement('div');
        this.editorElement.className = 'editor-obj';
        this.editorElement.style.pointerEvents = 'auto';
        
        // Crear texto principal para Editor
        const editorText = document.createElement('div');
        editorText.className = 'menu-text';
        editorText.textContent = 'Editor';
        this.editorElement.appendChild(editorText);
        
        // Crear texto secundario para Editor
        const editorSecondaryText = document.createElement('div');
        editorSecondaryText.className = 'menu-secondary-text';
        editorSecondaryText.textContent = 'Crea arte puro';
        this.editorElement.appendChild(editorSecondaryText);
        
        // Crear icono para Editor
        const editorIcon = document.createElement('img');
        editorIcon.className = 'menu-icon';
        editorIcon.src = 'public/assets/images/main-menu/Editor.png';
        editorIcon.alt = 'Editor';
        this.editorElement.appendChild(editorIcon);
        
        this.container.appendChild(this.editorElement);
        
        // Crear objeto Explorar
        this.explorarElement = document.createElement('div');
        this.explorarElement.className = 'explorar-obj';
        this.explorarElement.style.pointerEvents = 'auto';
        
        // Crear texto principal para Explorar
        const explorarText = document.createElement('div');
        explorarText.className = 'menu-text';
        explorarText.textContent = 'Explorar';
        this.explorarElement.appendChild(explorarText);
        
        // Crear texto secundario para Explorar
        const explorarSecondaryText = document.createElement('div');
        explorarSecondaryText.className = 'menu-secondary-text';
        explorarSecondaryText.textContent = 'Descubre nuevos mapas';
        explorarSecondaryText.style.width = '160px'; // Más ancho para el texto más largo
        this.explorarElement.appendChild(explorarSecondaryText);
        
        // Crear icono para Explorar
        const explorarIcon = document.createElement('img');
        explorarIcon.className = 'menu-icon';
        explorarIcon.src = 'public/assets/images/main-menu/Explorer.png';
        explorarIcon.alt = 'Explorar';
        this.explorarElement.appendChild(explorarIcon);
        
        this.container.appendChild(this.explorarElement);
        
        // Crear objeto Exit
        this.exitElement = document.createElement('div');
        this.exitElement.className = 'exit-obj';
        this.exitElement.style.pointerEvents = 'auto';
        
        // Crear texto principal para Exit
        const exitText = document.createElement('div');
        exitText.className = 'menu-text';
        exitText.textContent = 'Salir';
        this.exitElement.appendChild(exitText);
        
        // Crear texto secundario para Exit
        const exitSecondaryText = document.createElement('div');
        exitSecondaryText.className = 'menu-secondary-text';
        exitSecondaryText.textContent = 'Vuelve pronto';
        this.exitElement.appendChild(exitSecondaryText);
        
        // Crear icono para Exit
        const exitIcon = document.createElement('img');
        exitIcon.className = 'menu-icon';
        exitIcon.src = 'public/assets/images/main-menu/Exit.png';
        exitIcon.alt = 'Salir';
        this.exitElement.appendChild(exitIcon);
        
        this.container.appendChild(this.exitElement);
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
        // Configurar parallax después de que la imagen se carga
        setTimeout(() => {
            this.setupParallaxEffect();
        });
        
        console.log('Main menu background loaded successfully');
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
    
    /**
     * Configura el efecto parallax para el background
     */
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
            console.log('Main menu parallax effect enabled');
        }
    }
    
    /**
     * Actualiza la posición del background basado en la posición del mouse
     */
    updateParallax(event) {
        if (!this.backgroundImage || !this.parallaxEnabled || this.isModalOpen) return;
        
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
        
        // Calcular el desplazamiento del parallax (intensidad más sutil para el main menu)
        const parallaxStrength = 55; // Intensidad ajustada
        this.targetParallaxX = centerX * parallaxStrength;
        this.targetParallaxY = centerY * parallaxStrength;
        
        // Iniciar la animación suave si no está ya corriendo
        if (!this.parallaxAnimationId) {
            this.animateParallax();
        }
    }
    
    /**
     * Anima el parallax con interpolación suave usando requestAnimationFrame
     */
    animateParallax() {
        if (!this.parallaxEnabled || !this.backgroundImage || this.isModalOpen) {
            this.parallaxAnimationId = null;
            return;
        }
        
        // Factor de suavizado (entre 0 y 1, más cerca de 0 = más suave)
        const lerpFactor = 0.12;
        
        // Interpolación lineal hacia los valores objetivo
        this.currentParallaxX += (this.targetParallaxX - this.currentParallaxX) * lerpFactor;
        this.currentParallaxY += (this.targetParallaxY - this.currentParallaxY) * lerpFactor;
        
        // Aplicar la transformación suavizada con el zoom
        const scaleValue = this.backgroundZoomed ? 'scale(1.1)' : 'scale(1)';
        this.backgroundImage.style.transform = `translate(${this.currentParallaxX}px, ${this.currentParallaxY}px) ${scaleValue}`;
        
        // Continuar la animación si hay diferencia significativa
        const diffX = Math.abs(this.targetParallaxX - this.currentParallaxX);
        const diffY = Math.abs(this.targetParallaxY - this.currentParallaxY);
        
        if (diffX > 0.1 || diffY > 0.1) {
            this.parallaxAnimationId = requestAnimationFrame(() => this.animateParallax());
        } else {
            this.parallaxAnimationId = null;
        }
    }
    
    /**
     * Remueve el efecto parallax
     */
    removeParallaxEffect() {
        if (this.parallaxListener) {
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer) {
                gameContainer.removeEventListener('mousemove', this.parallaxListener);
            }
            this.parallaxListener = null;
            this.parallaxEnabled = false;
            
            // Cancelar animación en curso
            if (this.parallaxAnimationId) {
                cancelAnimationFrame(this.parallaxAnimationId);
                this.parallaxAnimationId = null;
            }
            
            // Resetear valores de parallax
            this.currentParallaxX = 0;
            this.currentParallaxY = 0;
            this.targetParallaxX = 0;
            this.targetParallaxY = 0;
            
            console.log('Main menu parallax effect disabled');
        }
    }
    
    /**
     * Anima el zoom del background a escala original (sin zoom)
     */
    zoomBackgroundToOriginal() {
        if (!this.backgroundImage || !this.backgroundZoomed) return;
        
        this.backgroundZoomed = false;
        
        // Cancelar animación de zoom en curso
        if (this.backgroundZoomAnimationId) {
            cancelAnimationFrame(this.backgroundZoomAnimationId);
            this.backgroundZoomAnimationId = null;
        }
        
        // Animar suavemente a escala original
        this.backgroundImage.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.backgroundImage.style.transform = 'translate(0px, 0px) scale(1)';
        
        console.log('Background zoomed to original scale');
    }
    
    /**
     * Anima el zoom del background de vuelta al estado zoom (130%)
     */
    zoomBackgroundToZoomed() {
        if (!this.backgroundImage || this.backgroundZoomed) return;
        
        this.backgroundZoomed = true;
        
        // Animar suavemente de vuelta al zoom
        this.backgroundImage.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.backgroundImage.style.transform = 'translate(0px, 0px) scale(1.1)';
        
        console.log('Background zoomed back to zoomed scale');
        
        // Remover transition después de la animación para permitir parallax suave
        setTimeout(() => {
            if (this.backgroundImage) {
                this.backgroundImage.style.transition = '';
            }
        }, 800);
    }
    
    /**
     * Desactiva el parallax y hace zoom out del background
     */
    disableParallaxAndZoomOut() {
        if (this.isModalOpen) return; // Ya está desactivado
        
        this.isModalOpen = true;
        
        // Desactivar parallax primero
        this.removeParallaxEffect();
        
        // Luego hacer zoom out
        this.zoomBackgroundToOriginal();
        
        console.log('Parallax disabled and background zoomed out for modal');
    }
    
    /**
     * Reactiva el parallax y hace zoom in del background
     */
    enableParallaxAndZoomIn() {
        if (!this.isModalOpen) return; // Ya está activado
        
        this.isModalOpen = false;
        
        // Primero hacer zoom in
        this.zoomBackgroundToZoomed();
        
        // Luego reactivar parallax después de la animación
        setTimeout(() => {
            if (!this.isModalOpen) { // Verificar que no se haya abierto otra modal
                this.setupParallaxEffect();
            }
        }, 800); // Esperar a que termine la animación de zoom
        
        console.log('Background zoomed in and parallax enabled after modal close');
    }
    
    /**
     * Muestra el main menu con transición suave
     */
    show() {
        if (this.container) {
            this.container.style.opacity = '1';
            this.isTransitioning = false;
        }
    }
    
    /**
     * Oculta el main menu
     */
    hide() {
        if (this.container) {
            this.container.style.opacity = '0';
        }
    }
    
    /**
     * Transición desde welcome state con animación de elementos
     */
    transitionFromWelcome() {
        this.isTransitioning = true;
        
        // Mostrar el contenedor del main menu
        this.show();
        
        this.showMenuObjectsWithDelay();
        
        // Configurar listeners de botones después de la transición
        setTimeout(() => {
            this.setupButtonListeners();
        }, 300);
        
        setTimeout(() => {
            this.isTransitioning = false;
            console.log('Transition to main menu completed');
        }, 800); // Duración de la transición CSS actualizada
    }
    
    /**
     * Muestra todos los objetos del menú con delays escalonados
     */
    showMenuObjectsWithDelay() {
        // Mostrar control center primero
        setTimeout(() => {
            if (this.controlCenterElement) {
                this.controlCenterElement.classList.add('show');
            }
        }, 100);
        
        // Mostrar background object
        setTimeout(() => {
            if (this.backgroundObjectElement) {
                this.backgroundObjectElement.classList.add('show');
            }
        }, 200);
        
        // Mostrar objeto de noticias
        setTimeout(() => {
            if (this.noticiasElement) {
                this.noticiasElement.classList.add('show');
            }
        }, 300);
        
        // Mostrar objetos del menú con delays escalonados
        const menuObjects = [
            { element: this.playElement, delay: 400 },
            { element: this.multijugadorElement, delay: 600 },
            { element: this.editorElement, delay: 800 },
            { element: this.explorarElement, delay: 1000 },
            { element: this.exitElement, delay: 1200 }
        ];
        
        menuObjects.forEach(({ element, delay }) => {
            setTimeout(() => {
                if (element) {
                    element.classList.add('show');
                }
            }, delay);
        });
    }
    
    /**
     * Limpia el sistema de audio
     */
    destroyAudioSystem() {
        try {
            Object.values(this.audioSystem).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.src = '';
                    audio.load(); // Resetea el elemento audio
                }
            });
            
            this.audioSystem = {
                openWindow: null,
                clickDown: null,
                clickUp: null
            };
            
            console.log('Audio system destroyed');
        } catch (error) {
            console.warn('Error destroying audio system:', error);
        }
    }
    
    // Métodos de utilidad para otros estados
    destroy() {
        // Limpiar listeners de botones
        this.removeButtonListeners();
        
        // Limpiar efecto parallax
        this.removeParallaxEffect();
        
        // Limpiar animaciones de zoom de background
        if (this.backgroundZoomAnimationId) {
            cancelAnimationFrame(this.backgroundZoomAnimationId);
            this.backgroundZoomAnimationId = null;
        }
        
        // Limpiar sistema de audio
        this.destroyAudioSystem();
        
        // Limpiar modal de info si está abierta
        if (this.isInfoModalOpen) {
            this.hideInfoModal();
        }
        
        // Limpiar interval de tiempo
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.backgroundImage = null;
        this.titleElement = null;
        this.splashTextElement = null;
        this.backgroundObjectElement = null;
        this.controlCenterElement = null;
        this.timeDisplayElement = null;
        this.localTimeElement = null;
        this.sessionTimeElement = null;
        this.userObjElement = null;
        this.usernameElement = null;
        this.userAvatarElement = null;
        this.socialObjElement = null;
        this.socialIconElement = null;
        this.socialTextElement = null;
        this.dlButtonElement = null;
        this.infoBtnElement = null;
        this.musicBtnElement = null;
        this.optionsButtonElement = null;
        this.noticiasElement = null;
        this.noticiasTextElement = null;
        this.noticiasBitmapElement = null;
        this.noticiasContentElement = null;
        this.noticiasDividerElement = null;
        this.noticiasReadMoreElement = null;
        this.playElement = null;
        this.multijugadorElement = null;
        this.editorElement = null;
        this.explorarElement = null;
        this.exitElement = null;
        this.isLoaded = false;
        this.splashTexts = []; // Limpiar array de splash texts
        
        // Limpiar modal de info
        this.infoModalOverlay = null;
        this.webInfoObj = null;
        this.infoModalContent = null;
        this.infoModalClose = null;
        this.infoModalExtraBtn = null;
        this.isInfoModalOpen = false;
        
        // Limpiar web viewer
        if (this.webViewerInfo) {
            this.webViewerInfo.destroy();
            this.webViewerInfo = null;
        }
        this.currentUrl = 'https://www.google.com'; // Reset URL
    }
    
    getContainer() {
        return this.container;
    }
    
    isImageLoaded() {
        return this.isLoaded;
    }
    
    isInTransition() {
        return this.isTransitioning;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.MainMenuState = MainMenuState;
}
