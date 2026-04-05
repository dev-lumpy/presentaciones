const socket = io();

socket.on('nueva_imagen', (data) => {
    console.log("Nueva imagen:", data.url);

    // Crear y mostrar la imagen automáticamente
    const container = document.createElement('div');
    container.className = 'visor-fullscreen';

    const img = document.createElement('img');
    img.src = data.url; // o imagenUrl
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    `;

    container.appendChild(img);
    document.body.appendChild(container);

    // Asegurar que no haya scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
});

