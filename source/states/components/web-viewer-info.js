/**
 * Web Viewer Info Component - Componente para mostrar contenido web en la modal de información
 */
class WebViewerInfo {
    constructor() {
        this.webFrame = null;
        this.isLoaded = false;
        this.loadingElement = null;
    }

    /**
     * Crea el iframe del web viewer
     * @param {string} url - URL a cargar en el iframe
     * @param {HTMLElement} container - Contenedor donde se agregará el iframe
     * @returns {HTMLElement} - El iframe creado
     */
    createWebFrame(url, container) {
        // Crear elemento de carga
        this.createLoadingElement(container);

        // Crear iframe
        this.webFrame = document.createElement('iframe');
        this.webFrame.className = 'web-viewer-frame';
        this.webFrame.src = url;
        this.webFrame.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 16px;
            background: transparent;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;

        // Event listeners para el iframe
        this.webFrame.onload = () => {
            this.isLoaded = true;
            this.hideLoading();
            this.webFrame.style.opacity = '1';
            console.log('Web viewer content loaded');
        };

        this.webFrame.onerror = () => {
            this.showError(container);
            console.error('Error loading web viewer content');
        };

        // Agregar iframe al contenedor
        container.appendChild(this.webFrame);

        return this.webFrame;
    }

    /**
     * Crea el elemento de carga
     * @param {HTMLElement} container - Contenedor donde se mostrará la carga
     */
    createLoadingElement(container) {
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'web-viewer-loading';
        this.loadingElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.8);
            font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            z-index: 10;
        `;
        this.loadingElement.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
            </div>
            <div>Cargando información...</div>
        `;

        // Agregar animación de spin
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        container.appendChild(this.loadingElement);
    }

    /**
     * Oculta el elemento de carga
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingElement && this.loadingElement.parentNode) {
                    this.loadingElement.parentNode.removeChild(this.loadingElement);
                }
                this.loadingElement = null;
            }, 300);
        }
    }

    /**
     * Muestra un mensaje de error
     * @param {HTMLElement} container - Contenedor donde se mostrará el error
     */
    showError(container) {
        this.hideLoading();
        
        const errorElement = document.createElement('div');
        errorElement.className = 'web-viewer-error';
        errorElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 100, 100, 0.9);
            font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            max-width: 80%;
        `;
        errorElement.innerHTML = `
            <div style="margin-bottom: 10px; font-size: 24px;">⚠️</div>
            <div>Error al cargar el contenido</div>
            <div style="font-size: 14px; margin-top: 8px; opacity: 0.7;">
                No se pudo conectar con la información solicitada
            </div>
        `;

        container.appendChild(errorElement);
    }

    /**
     * Actualiza la URL del iframe
     * @param {string} newUrl - Nueva URL a cargar
     */
    updateUrl(newUrl) {
        if (this.webFrame) {
            this.isLoaded = false;
            this.webFrame.style.opacity = '0';
            
            setTimeout(() => {
                this.webFrame.src = newUrl;
            }, 150);
        }
    }

    /**
     * Destruye el web viewer y limpia referencias
     */
    destroy() {
        if (this.webFrame && this.webFrame.parentNode) {
            this.webFrame.parentNode.removeChild(this.webFrame);
        }
        
        if (this.loadingElement && this.loadingElement.parentNode) {
            this.loadingElement.parentNode.removeChild(this.loadingElement);
        }

        this.webFrame = null;
        this.loadingElement = null;
        this.isLoaded = false;
    }

    /**
     * Verifica si el contenido está cargado
     * @returns {boolean}
     */
    isContentLoaded() {
        return this.isLoaded;
    }

    /**
     * Obtiene el iframe del web viewer
     * @returns {HTMLElement|null}
     */
    getWebFrame() {
        return this.webFrame;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.WebViewerInfo = WebViewerInfo;
}
