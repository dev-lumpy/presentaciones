// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_control/api_backend.js
//
// Capa de comunicación con el servidor.
// Todas las funciones hacen fetch a un endpoint de routes.py.
// Ninguna lógica de UI vive en este archivo.
// ─────────────────────────────────────────────────────────────

import { new_animation } from './utils.js';


/**
 * Solicita al servidor la lista de temas disponibles.
 *
 * @returns {Promise<Array<{titulo_tema: string, ID: string}>>}
 */
export async function request_temas() {
    const res = await fetch('/api/temas');
    console.log("Se solicito los temas")
    return res.json();
}


/**
 * Solicita al servidor la lista de animaciones de un tema.
 *
 * @param   {string} id_tema - ID del tema a consultar
 * @returns {Promise<Array<{nombre: string, ID: string}>>}
 */
export async function request_resources(id_tema) {
    const res = await fetch(`/api/recursos/${id_tema}`);
    console.log("Se solicito los temas")
    return res.json();
}


/**
 * Consulta si hay animaciones nuevas para un tema y las agrega al panel.
 *
 * @param {string}  id_tema      - ID del tema a consultar
 * @param {Element} listaBotones - Contenedor donde se insertarán los botones nuevos
 */
export async function add_animation(id_tema, listaBotones) {
    const { hay_novedades } = await fetch(`/api/novedades/${id_tema}`)
        .then(r => r.json());

    if (!hay_novedades) return;

    const animaciones = await request_resources(id_tema);
    new_animation(animaciones, listaBotones);
}


/**
 * Ordena al servidor que muestre una animación en el monitor externo.
 *
 * @param {string} id - ID único de la animación a reproducir
 */
export async function display_on_monitor(id) {
    console.log("Se ordeno que muestre una animacion")
    await fetch(`/api/monitor/${id}`, { method: 'POST' });
}


/**
 * Solicita al servidor que navegue al tema anterior.
 */
export async function previous(id_tema) {
    console.log("Se ordeno que sea un anterior imagen")
    await fetch(`/api/anterior/${id_tema}`, { method: 'POST' });
}


/**
 * Solicita al servidor que navegue al tema siguiente.
 */
export async function next(id_tema) {
    console.log("Se ordeno que sea un imagen siguiente")
    await fetch(`/api/siguiente/${id_tema}`, { method: 'POST' });
}
