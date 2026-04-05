// app/static/js/scripts_control/events_temas.js
// ─────────────────────────────────────────────────────────────
// Orquesta los eventos del menú de temas.
// Solo importa de UN lugar cada función — si está en utils.js,
// no la importes también de api_backend.js.
// ─────────────────────────────────────────────────────────────

import { 
    request_resources, display_on_monitor, 
    previous, next
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
        const pasosAnimacion = await request_resources(id_tema); 

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

    // ============ ESTILOS PARA EL HEADER Y SUS BOTONES ============
    // Estilos para el header
    header.style.display = 'grid';
    header.style.gridTemplateColumns = 'repeat(2, 1fr)';
    header.style.gap = '10px';
    header.style.padding = '20px 15px';
    header.style.backgroundColor = 'white';
    header.style.borderBottom = '2px solid #ddd';
    
    // Estilos para el título h1
    const h1 = header.querySelector('h1');
    h1.style.gridColumn = 'span 2';
    h1.style.margin = '0 0 10px 0';
    h1.style.fontSize = '70px';
    h1.style.textAlign = 'center';
    h1.style.color = '#333';
    
    // Estilos para TODOS los botones del header
    const botonesHeader = header.querySelectorAll('button');
    botonesHeader.forEach(btn => {
        btn.style.padding = '15px 10px';
        btn.style.fontSize = '70px';
        btn.style.fontWeight = 'bold';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s ease';
    });
    
    // Estilos para el hr
    const hr = header.querySelector('hr');
    hr.style.gridColumn = 'span 2';
    hr.style.margin = '10px 0 0 0';
    hr.style.border = 'none';
    hr.style.borderTop = '2px solid #ddd';
    
    fragmento.appendChild(header);

    // ============ CREAR BOTONES GRANDES ============
    pasosAnimacion.forEach((paso) => {
        const btn = document.createElement('button');
        btn.textContent = paso.nombre;
        btn.dataset.id = paso.ID;
        
        // 🔥 APLICAR ESTILOS DIRECTAMENTE (fuerza tamaños grandes)
        btn.style.width = '100%';
        btn.style.padding = '25px 15px';
        btn.style.fontSize = '50px';
        btn.style.fontWeight = 'bold';
        btn.style.textAlign = 'center';
        btn.style.backgroundColor = 'white';
        btn.style.color = '#007bff';
        btn.style.border = '3px solid #007bff';
        btn.style.borderRadius = '15px';
        btn.style.cursor = 'pointer';
        btn.style.margin = '5px 0';
        btn.style.transition = 'all 0.3s ease';
        
        // Efecto al tocar (para celular)
        btn.addEventListener('touchstart', function() {
            this.style.backgroundColor = '#007bff';
            this.style.color = 'white';
        });
        btn.addEventListener('touchend', function() {
            this.style.backgroundColor = 'white';
            this.style.color = '#007bff';
        });
        
        listaBotones.appendChild(btn);
    });

    // Estilo para el contenedor (1 columna)
    listaBotones.style.display = 'flex';
    listaBotones.style.flexDirection = 'column';
    listaBotones.style.gap = '15px';
    listaBotones.style.padding = '15px';
    listaBotones.style.width = '100%';

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
