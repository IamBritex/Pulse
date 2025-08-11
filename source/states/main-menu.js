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
        this.currentUrl = 'https://es.wikipedia.org/wiki/Videojuego'; // URL que se mostrará en el web viewer
        
        // No inicializar automáticamente, será llamado desde WelcomeState
    }
    
    init() {
        this.createMainMenuScreen();
        this.loadBackgroundImage();
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
        
        // Agregar imagen al contenedor
        this.container.appendChild(this.backgroundImage);
        
        // Crear el título PULSE (posición y propiedades del main menu)
        this.createTitle();
        
        // Crear el texto splash (nuevo texto)
        this.createSplashText();
        
        // Crear la barra de navegación superior
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
        splashText.textContent = 'Now with Ray Tracing';
        
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
        
        // Crear imagen de avatar
        const userAvatar = document.createElement('img');
        userAvatar.className = 'user-avatar';
        userAvatar.src = 'public/assets/images/Placeholder.png';
        userAvatar.alt = 'User Avatar';
        
        // Crear elemento de nombre de usuario
        const username = document.createElement('div');
        username.className = 'username';
        username.textContent = 'user';
        
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
        
        // Crear elemento del bitmap que captura el contenedor
        const noticiasBitmap = document.createElement('canvas');
        noticiasBitmap.className = 'noticias-bitmap';
        noticiasBitmap.width = 242.49;
        noticiasBitmap.height = 135.49;
        
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
        noticiasObj.appendChild(noticiasBitmap);
        noticiasObj.appendChild(noticiasContent);
        noticiasObj.appendChild(noticiasDivider);
        noticiasObj.appendChild(noticiasReadMore);
        
        // Agregar cuadro de noticias al contenedor
        this.container.appendChild(noticiasObj);
        
        // Guardar referencias
        this.noticiasElement = noticiasObj;
        this.noticiasTextElement = noticiasText;
        this.noticiasBitmapElement = noticiasBitmap;
        this.noticiasContentElement = noticiasContent;
        this.noticiasDividerElement = noticiasDivider;
        this.noticiasReadMoreElement = noticiasReadMore;
        
        // Cargar el contenido del archivo MD más reciente
        this.loadLatestNewsContent();
        
        // Programar la captura del bitmap después de que todo esté renderizado
        setTimeout(() => {
            this.captureBitmap();
        }, 100);
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
            this.hideInfoModal();
        });
        
        // Event listener para el botón go-to (abrir en nueva pestaña)
        this.infoModalExtraBtn.addEventListener('click', () => {
            if (this.currentUrl) {
                window.open(this.currentUrl, '_blank');
                console.log('Opening URL in new tab:', this.currentUrl);
            }
        });
        
        // Cerrar modal al hacer click en el overlay (fuera de la ventana)
        this.infoModalOverlay.addEventListener('click', (event) => {
            if (event.target === this.infoModalOverlay) {
                this.hideInfoModal();
            }
        });
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isInfoModalOpen) {
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
                    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
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
        
        console.log('Info modal shown');
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
        
        console.log('Info modal hidden');
    }
    
    captureBitmap() {
        if (!this.noticiasBitmapElement || !this.container) return;
        
        // Usar html2canvas para capturar el contenedor completo
        if (typeof html2canvas !== 'undefined') {
            html2canvas(this.container, {
                width: this.container.offsetWidth,
                height: this.container.offsetHeight,
                scale: 0.5, // Escala reducida para que quepa en el bitmap
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                // Obtener el contexto del canvas del bitmap
                const ctx = this.noticiasBitmapElement.getContext('2d');
                
                // Limpiar el canvas
                ctx.clearRect(0, 0, this.noticiasBitmapElement.width, this.noticiasBitmapElement.height);
                
                // Calcular la escala para que la imagen quepa completamente
                const scaleX = this.noticiasBitmapElement.width / canvas.width;
                const scaleY = this.noticiasBitmapElement.height / canvas.height;
                const scale = Math.min(scaleX, scaleY);
                
                // Calcular el tamaño escalado
                const scaledWidth = canvas.width * scale;
                const scaledHeight = canvas.height * scale;
                
                // Calcular la posición centrada
                const x = (this.noticiasBitmapElement.width - scaledWidth) / 2;
                const y = (this.noticiasBitmapElement.height - scaledHeight) / 2;
                
                // Dibujar la imagen capturada en el canvas del bitmap
                ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
            }).catch(error => {
                console.error('Error capturando bitmap:', error);
                // Fallback: crear un gradiente simple
                this.createFallbackBitmap();
            });
        } else {
            // Fallback si html2canvas no está disponible
            this.createFallbackBitmap();
        }
    }
    
    createFallbackBitmap() {
        if (!this.noticiasBitmapElement) return;
        
        const ctx = this.noticiasBitmapElement.getContext('2d');
        
        // Crear un gradiente como fallback
        const gradient = ctx.createLinearGradient(0, 0, this.noticiasBitmapElement.width, this.noticiasBitmapElement.height);
        gradient.addColorStop(0, 'rgba(138, 167, 221, 0.8)');
        gradient.addColorStop(1, 'rgba(206, 139, 221, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.noticiasBitmapElement.width, this.noticiasBitmapElement.height);
        
        // Agregar texto de fallback
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '12px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Main Menu Preview', this.noticiasBitmapElement.width / 2, this.noticiasBitmapElement.height / 2);
    }
    
    async loadLatestNewsContent() {
        if (!this.noticiasContentElement) return;
        
        try {
            // Intentar cargar el archivo news.md (en un entorno real, aquí buscarías el más reciente)
            const response = await fetch('news/news.md');
            if (response.ok) {
                const content = await response.text();
                this.displayNewsContent(content);
            } else {
                this.displayFallbackNews();
            }
        } catch (error) {
            console.log('No se pudo cargar el contenido de noticias:', error);
            this.displayFallbackNews();
        }
    }
    
    displayNewsContent(content) {
        if (!this.noticiasContentElement) return;
        
        // Limpiar el contenido MD básico (remover # y otros caracteres de markdown)
        let cleanContent = content
            .replace(/^#+ /gm, '') // Remover headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remover bold
            .replace(/\*(.*?)\*/g, '$1') // Remover italic
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remover links, mantener texto
            .trim();
        
        // Si el contenido es muy corto, usar fallback
        if (cleanContent.length < 10) {
            this.displayFallbackNews();
            return;
        }
        
        // Truncar el texto si es muy largo para que quepa en el contenedor
        const maxLength = 280; // Aproximadamente lo que cabe en el contenedor
        if (cleanContent.length > maxLength) {
            cleanContent = cleanContent.substring(0, maxLength - 3) + '...';
        }
        
        this.noticiasContentElement.textContent = cleanContent;
    }
    
    displayFallbackNews() {
        if (!this.noticiasContentElement) return;
        
        const fallbackContent = 'Bienvenido a Pulse! Aquí encontrarás las últimas noticias y actualizaciones del juego. Mantente al día con nuevas funcionalidades, eventos especiales y mucho más...';
        this.noticiasContentElement.textContent = fallbackContent;
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
        
        // Recapturar el bitmap después de que todos los elementos estén visibles
        setTimeout(() => {
            this.captureBitmap();
        }, 1500);
    }
    
    // Métodos de utilidad para otros estados
    destroy() {
        // Limpiar listeners de botones
        this.removeButtonListeners();
        
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
