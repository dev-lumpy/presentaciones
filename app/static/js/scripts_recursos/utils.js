// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_recursos/utils.js
// ─────────────────────────────────────────────────────────────


/**
 * Solicita los temas al servidor y rellena el <select> con sus opciones.
 * Siempre limpia las opciones anteriores antes de insertar las nuevas.
 *
 * @param {HTMLSelectElement} temaSelect - document.getElementById('temaSelect')
 *
 * @example
 *   await refresh_temas(document.getElementById('temaSelect'));
 */
export async function refresh_temas(temaSelect) {
    const temas = await fetch('/api/temas').then(r => r.json());

    // Limpiar opciones anteriores
    temaSelect.innerHTML = '';

    // Opción neutral inicial — mientras no elija nada el select queda vacío
    const placeholder = document.createElement('option');
    placeholder.value    = '';
    placeholder.textContent = 'Selecciona un tema';
    placeholder.disabled = true;
    placeholder.selected = true;
    temaSelect.appendChild(placeholder);

    // Una <option> por cada tema que devuelva el servidor
    temas.forEach(({ titulo_tema, ID }) => {
        const option = document.createElement('option');
        option.value       = ID;
        option.textContent = titulo_tema;
        temaSelect.appendChild(option);
    });
}

