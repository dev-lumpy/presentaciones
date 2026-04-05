// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_control/api_backend.js
//
// Capa de comunicación con el servidor.
// Todas las funciones hacen fetch a un endpoint de control_routes.py.
// Ninguna lógica de UI vive en este archivo.
// ─────────────────────────────────────────────────────────────


/**
 * Solicita al servidor la lista de temas disponibles.
 *
 * @returns {Promise<Array<{titulo_tema: string, ID: number}>>}
 */
export async function request_temas() {
    console.log('Solicitando temas al servidor');
    const res = await fetch('/api/temas');
    return res.json();
}


/**
 * Solicita al servidor las imágenes de un tema ordenadas por su campo orden.
 *
 * @param   {number} id_tema - ID entero del tema a consultar
 * @returns {Promise<Array<{nombre: string, ID: number, ruta: string, orden: number}>>}
 */
export async function request_resources(id_tema) {
    console.log(`Solicitando recursos del tema ID: ${id_tema}`);
    const res = await fetch(`/api/recursos/${id_tema}`);
    return res.json();
}


/**
 * Ordena al servidor que muestre una imagen en el monitor externo.
 *
 * @param {number} id - ID único de la imagen a mostrar
 */
export async function display_on_monitor(id) {
    console.log(`Mostrando imagen ID: ${id} en el monitor`);
    await fetch(`/api/monitor/${id}`, { method: 'POST' });
}


/**
 * Solicita al servidor que navegue a la imagen anterior del tema.
 *
 * @param {number} id_tema - ID del tema activo
 */
export async function previous(id_tema) {
    console.log(`Imagen anterior — tema ID: ${id_tema}`);
    await fetch(`/api/anterior/${id_tema}`, { method: 'POST' });
}


/**
 * Solicita al servidor que navegue a la imagen siguiente del tema.
 *
 * @param {number} id_tema - ID del tema activo
 */
export async function next(id_tema) {
    console.log(`Imagen siguiente — tema ID: ${id_tema}`);
    await fetch(`/api/siguiente/${id_tema}`, { method: 'POST' });
}

