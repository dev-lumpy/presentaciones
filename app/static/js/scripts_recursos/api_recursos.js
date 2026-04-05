// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_recursos/api_recursos.js
//
// Comunicación con el servidor para el módulo de recursos.
// ─────────────────────────────────────────────────────────────


/**
 * Solicita al servidor los recursos existentes de un tema.
 *
 * @param   {string} id_tema
 * @returns {Promise<Array<{nombre: string, ID: string}>>}
 */
export async function fetch_recursos(id_tema) {
    // TODO: GET /api/recursos/${id_tema}
    // return await fetch(`/api/recursos/${id_tema}`).then(r => r.json());
    return [
        { nombre: 'Carga del Condensador',  ID: '4322' },
        { nombre: 'Disparo del Comparador', ID: '4323' },
        { nombre: 'Descarga',               ID: '4324' },
    ];
}


/**
 * Sube un recurso nuevo al servidor.
 *
 * @param {string} titulo  - Nombre del recurso
 * @param {File}   archivo - Archivo .png o .json seleccionado
 * @returns {Promise<{ok: boolean, ID: string}>}
 */
export async function upload_recurso(titulo, archivo) {
    // TODO: POST /api/recursos/upload
    // const form = new FormData();
    // form.append('titulo', titulo);
    // form.append('archivo', archivo);
    // return await fetch('/api/recursos/upload', { method: 'POST', body: form }).then(r => r.json());
    console.log(`Simulando subida: "${titulo}" — ${archivo.name}`);
    return { ok: true, ID: String(Date.now()) };
}


/**
 * Notifica al servidor el nuevo orden de los recursos.
 *
 * @param {Array<{ID: string, orden: number}>} orden
 */
export async function update_orden(orden) {
    // TODO: POST /api/recursos/orden
    // await fetch('/api/recursos/orden', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ orden })
    // });
    console.log('Nuevo orden enviado al servidor:', orden);
}
