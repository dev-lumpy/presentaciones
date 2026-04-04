// app/static/js/scripts_control/events_temas.js
// ─────────────────────────────────────────────────────────────
// Orquesta los eventos del menú de temas.
// Solo importa de UN lugar cada función — si está en utils.js,
// no la importes también de api_backend.js.
// ─────────────────────────────────────────────────────────────

import { 
    request_resources, display_on_monitor, 
    previous, next, add_animation
} from './api_backend.js';

import { toggleVista } from './utils.js';

export function main(theme_container, topic_content) {
    theme_container.addEventListener('click', async (e) => {
        const item = e.target.closest('.item');
        if (!item) return;

        const { titulo, id } = item.dataset;
        const id_tema = id;

        // ── 1. Cambiar vista ──────────────────────────────────
        toggleVista(theme_container, topic_content, false);

        // ── 2. Pedir recursos ANTES de construir el DOM ───────
        // Separarlo aquí deja claro que es async y que puede fallar.
        const pasosAnimacion = await request_resources(titulo); 

        // ── 2.1 Crear la caja de 'lista-animaciones' ──────────
        // Para poder controlarlo desde el exterior
        const listaBotones = document.createElement('div');
        listaBotones.className = 'lista-animaciones';

        // ── 3. Construir el DOM ───────────────────────────────
        topic_content.innerHTML = '';
        topic_content.appendChild(
            buildPanel(titulo, pasosAnimacion, listaBotones)
        );

        // ── 4. Conectar botones del panel ─────────────────────
        // Siempre DESPUÉS de insertar en el DOM, nunca antes.
        bindPanelButtons(
            theme_container, topic_content,
            id_tema, listaBotones);
    });
}

// ─────────────────────────────────────────────────────────────
// buildPanel()
// Construye y retorna el fragmento del panel.
// No sabe nada de eventos ni de navegación.
// ─────────────────────────────────────────────────────────────
function buildPanel(titulo, pasosAnimacion, listaBotones) {
    const fragmento = document.createDocumentFragment();

    // Encabezado
    const header = document.createElement('div');
    header.innerHTML = `
        <h1>${titulo}</h1>
        <button id="btn-menu">MENU</button>
        <button id="btn-refresh">Refresh</button>
        <button id="btn-prev">Anterior</button>
        <button id="btn-next">Siguiente</button>
        <hr>
    `;
    header.className = `header`;
    fragmento.appendChild(header);

    // Poniendo funcionalidad a todos los botones que hay de
    // 'list-animaciones'
    pasosAnimacion.forEach((paso) => {
        const btn = document.createElement('button');
        btn.textContent   = paso.nombre;
        btn.dataset.id    = paso.ID;    // solo guardamos el ID en el DOM
        listaBotones.appendChild(btn);
    });

    fragmento.appendChild(listaBotones);
    return fragmento;
}

// ─────────────────────────────────────────────────────────────
// bindPanelButtons()
// Conecta los botones del panel que acaba de renderizarse.
// Usa delegación en .lista-animaciones para no poner un
// listener por cada botón.
// ─────────────────────────────────────────────────────────────
function bindPanelButtons(
    theme_container, topic_content, id_tema, listaBotones
    ) {

    document.getElementById('btn-menu')
        ?.addEventListener('click', () => toggleVista(theme_container, topic_content, true));

    document.getElementById('btn-prev')
        ?.addEventListener('click', () => previous(id_tema));

    document.getElementById('btn-next')
        ?.addEventListener('click', () => next(id_tema));

    document.getElementById('btn-refresh')
        ?.addEventListener('click', () => add_animation(id_tema, listaBotones));

    // Delegación: un solo listener para todos los botones de animación
    topic_content.querySelector('.lista-animaciones')
        ?.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-id]');
            if (!btn) return;
            console.log(`▶ Lanzando animación ID: ${btn.dataset.id}`);
            display_on_monitor(btn.dataset.id);
        });
}
