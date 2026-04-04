// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_control/main.js
//
// Punto de entrada de control.html.
// Solo localiza los elementos raíz y delega todo a events_temas.js.
// Si necesitas inicializar algo más (auth, config, etc.), hazlo aquí.
// ─────────────────────────────────────────────────────────────

import { main } from './events_temas.js';
import { request_temas } from './api_backend.js';

document.addEventListener('DOMContentLoaded', async () => {
    const theme_container = document.querySelector('.theme_container');
    const topic_content   = document.querySelector('.topic_content');

    // 1. Pedimos los temas al servidor y poblamos el menú
    const temas = await request_temas();
    temas.forEach(({ titulo_tema, ID }) => {
        const item = document.createElement('div');
        item.className        = 'item';
        item.dataset.id       = ID;
        item.dataset.titulo   = titulo_tema;
        item.textContent      = titulo_tema;
        theme_container.appendChild(item);
    });

    // 2. Recién ahora activamos los listeners — el DOM ya está listo
    main(theme_container, topic_content);

});

