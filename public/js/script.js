document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar el cuerpo y el logo
    const body = document.body;
    const logo = document.getElementById('logo');
    let timeoutId;

    // Detectar si es un dispositivo móvil usando el user-agent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // Aplicar configuraciones específicas para móviles
        body.classList.add('mobile-view');
        
        // Variables para el desplazamiento del fondo
        let startX = 0, startY = 0, backgroundX = 50, backgroundY = 50;

        // Evento al comenzar el toque (cuando el usuario toca la pantalla)
        body.addEventListener('touchstart', function(e) {
            // Obtener la posición inicial del dedo en X e Y
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });

        // Evento al mover el dedo (arrastrar), listener no pasivo
        body.addEventListener('touchmove', function(e) {
            e.preventDefault();  // Evitar la acción predeterminada de desplazamiento de la página

            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            // Actualizar las posiciones de fondo en porcentaje
            backgroundX += deltaX * 0.1;  // Ajustar la sensibilidad del arrastre
            backgroundY += deltaY * 0.1;

            // Limitar los valores para que la imagen no se salga del contenedor
            backgroundX = Math.max(0, Math.min(100, backgroundX));
            backgroundY = Math.max(0, Math.min(100, backgroundY));

            // Aplicar la nueva posición de fondo
            body.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;

            // Actualizar las posiciones de inicio para el siguiente movimiento
            startX = touch.clientX;
            startY = touch.clientY;

            // Cambiar el logo a su versión invertida
            logo.src = 'images/logo-invertido.png';

            // Evitar cancelar la solicitud de la imagen. Esperar un poco más.
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                logo.src = 'images/logo-normal.png'; // Volver al logo normal después de un tiempo
            }, 3000);  // Aumentar el tiempo de espera en móviles
        }, { passive: false });

    } else {
        // Aplicar configuraciones para escritorio
        body.classList.add('desktop-view');

        // Evento que se activa cuando se mueve el mouse (en escritorio)
        window.addEventListener('mousemove', function (e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            body.style.backgroundImage = `
                radial-gradient(circle at ${mouseX}px ${mouseY}px, transparent 150px, rgba(0, 0, 0, 0.25) 220px, rgba(0, 0, 0, 0.85) 300px),
                url('images/fondo.jpg')
            `;

            logo.src = 'images/logo-invertido.png';  // Cambiar a logo invertido

            body.classList.add('reveal-bg');
            body.classList.remove('reset-bg');

            clearTimeout(timeoutId);

            timeoutId = setTimeout(function () {
                body.classList.add('reset-bg');
                body.classList.remove('reveal-bg');
                body.style.backgroundImage = 'none';
                logo.src = 'images/logo-normal.png'; // Volver al logo normal
            }, 2000);  // Cambia a logo normal después de 2 segundos
        });
    }

    // Grupos de imágenes para el carrusel
    let currentGroupIndex = 0;
    const imageGroups = [
        ['images/1.jpg', 'images/2.jpg', 'images/3.jpg'],
        ['images/4.jpg', 'images/5.jpg', 'images/6.jpg'],
        ['images/7.jpg', 'images/8.jpg', 'images/9.jpg']
    ];

    // Contenedor del carrusel
    const adImagesContainer = document.querySelector('.ad-images');
    const adImages = adImagesContainer.querySelectorAll('img');

    // Función para cambiar imágenes en el carrusel
    function changeImageGroup() {
        adImagesContainer.classList.remove('visible'); // Ocultar imágenes antes del cambio
        setTimeout(() => {
            // Cambiar el comportamiento según el dispositivo
            if (isMobile) {
                // Mostrar solo una imagen a la vez en móviles
                currentGroupIndex = (currentGroupIndex + 1) % adImages.length;

                adImages.forEach((img, index) => {
                    if (index === currentGroupIndex) {
                        img.style.opacity = 1; // Mostrar solo la imagen actual
                    } else {
                        img.style.opacity = 0; // Ocultar las demás
                    }
                });
            } else {
                // Comportamiento normal de 3 imágenes distribuidas en horizontal para escritorio
                currentGroupIndex = (currentGroupIndex + 1) % imageGroups.length;
                const newImages = imageGroups[currentGroupIndex];

                adImages.forEach((img, index) => {
                    if (index < newImages.length) {
                        img.src = newImages[index];
                    } else {
                        console.error('El índice supera el número de imágenes disponibles.');
                    }
                });
            }

            adImagesContainer.classList.add('visible'); // Volver a hacer visibles las imágenes
        }, 1000); // Espera 1 segundo antes de mostrar el siguiente grupo
    }

    // Cambiar las imágenes cada 5 segundos
    setInterval(changeImageGroup, 5000);

    // Función para mostrar la pantalla correspondiente
    function showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        const adFrame = document.getElementById('ad-frame');
        if (adFrame) {
            adFrame.style.display = 'none';
        }
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
            mainScreen.style.display = 'none';
        }
        const selectedScreen = document.getElementById(screenId);
        if (selectedScreen) {
            selectedScreen.classList.add('active');
        }
    }

    // Función para volver a la pantalla principal
    function goBack() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        const adFrame = document.getElementById('ad-frame');
        if (adFrame) {
            adFrame.style.display = 'flex';
        }
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
            mainScreen.style.display = 'flex';
        }
    }

    // Exponer las funciones a nivel global
    window.showScreen = showScreen;
    window.goBack = goBack;
});
