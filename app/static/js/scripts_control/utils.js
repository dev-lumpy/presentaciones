// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_control/utils.js
//
// Funciones de utilidad compartidas entre módulos.
// ─────────────────────────────────────────────────────────────


/**
 * Alterna la visibilidad entre el menú principal y el panel de contenido.
 *
 * @param {Element} theme_container - El contenedor del menú (.theme_container)
 * @param {Element} topic_content   - El panel de contenido  (.topic_content)
 * @param {boolean} activarContainer
 *   - true  → muestra el menú,  oculta el panel  (volver al menú)
 *   - false → oculta el menú,   muestra el panel (entrar a un tema)
 *
 * @example
 *   toggleVista(menu, panel, true);   // volver al menú
 *   toggleVista(menu, panel, false);  // mostrar panel de tema
 */
export function toggleVista(theme_container, topic_content, activarContainer) {
    if (activarContainer) {
        theme_container.style.display = 'grid';
        topic_content.style.display   = 'none';
        topic_content.innerHTML       = '';
    } else {
        theme_container.style.display = 'none';
        topic_content.style.display   = 'block';
    }
}

/**
 * Para anadir una nueva animacion al contenido explicito de un menu
 * que aparece como una pila de botones de animacion
 *
 * @param {List} lista_animaciones - La lista son puros (nombre, ID), osea
 * @param {Element} listaBotones   - La lista de varios botones en el que 
 *      anadiremos el nuevo boton (si es que hay un nuevo boton)
 * @example
 *   new_animation([
 *       { nombre: 'Carga del Condensador',  ID: '4322' },
 *       { nombre: 'Disparo del Comparador', ID: '4323' },
 *       { nombre: 'Descarga',               ID: '4324' },
 *   ], listaBotones) // mandar una lista de esos
 */
export function new_animation(lista_animaciones, listaBotones) {
    if (!lista_animaciones || lista_animaciones.length === 0) return; // nada que hacer

    lista_animaciones.forEach(paso => {
        // Verificar si ya existe un botón con ese data-id
        const existe = Array.from(listaBotones.children).some(
            btn => btn.dataset.id === paso.ID
        );

        if (!existe) {
            const btn = document.createElement('button');
            btn.textContent = paso.nombre;
            btn.dataset.id = paso.ID;
            listaBotones.appendChild(btn);
        }
    });
}
