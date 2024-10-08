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

        // Evento al mover el dedo (simular linterna)
        body.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;

            // Crear el efecto linterna alrededor del dedo
            body.style.backgroundImage = `
                radial-gradient(circle at ${touchX}px ${touchY}px, transparent 150px, rgba(0, 0, 0, 0.25) 220px, rgba(0, 0, 0, 0.85) 300px),
                url('images/fondo.jpg')
            `;

            // Cambiar el logo a la versión invertida
            logo.src = 'images/logo-invertido.png';

            // Restablecer el logo y el fondo a blanco después de un tiempo
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                body.style.backgroundImage = 'none';  // Fondo blanco
                body.style.backgroundColor = '#ffffff';  // Asegurarse de que sea blanco
                logo.src = 'images/logo-normal.png';  // Volver al logo normal
            }, 3000);  // Esperar 3 segundos de inactividad
        }, { passive: false });
    } else {
        // Configuraciones para escritorio (efecto linterna con el mouse)
        body.classList.add('desktop-view');

        // Evento que se activa cuando se mueve el mouse (en escritorio)
        window.addEventListener('mousemove', function (e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Crear el efecto linterna alrededor del puntero
            body.style.backgroundImage = `
                radial-gradient(circle at ${mouseX}px ${mouseY}px, transparent 150px, rgba(0, 0, 0, 0.25) 220px, rgba(0, 0, 0, 0.85) 300px),
                url('images/fondo.jpg')
            `;

            logo.src = 'images/logo-invertido.png';  // Cambiar a logo invertido

            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                body.style.backgroundImage = 'none';  // Eliminar el fondo linterna después de la inactividad
                body.style.backgroundColor = '#ffffff';  // Fondo blanco
                logo.src = 'images/logo-normal.png';  // Volver al logo normal
            }, 2000);  // 2 segundos de inactividad
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
            if (isMobile) {
                // Mostrar solo una imagen a la vez en móviles
                currentGroupIndex = (currentGroupIndex + 1) % adImages.length;

                adImages.forEach((img, index) => {
                    img.style.opacity = index === currentGroupIndex ? 1 : 0; // Mostrar solo la imagen actual
                });
            } else {
                // Comportamiento de 3 imágenes para escritorio
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
