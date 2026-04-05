// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_recursos/events_add_recurso.js
//
// Lógica del formulario para agregar y reordenar recursos.
// No sabe nada del servidor — delega en api_recursos.js.
// ─────────────────────────────────────────────────────────────

import { fetch_recursos, upload_recurso, update_orden } from './api_recursos.js';

let recursos     = [];
let selectedFile = null;
let dragSrc      = null;


/**
 * Punto de entrada del módulo.
 * Lee el select de tema dentro del form y reacciona a sus cambios.
 *
 * @param {HTMLFormElement} formRecurso - document.getElementById('formRecurso')
 */
export async function main_add_recurso(formRecurso) {
    const temaSelect = formRecurso.querySelector('#temaSelect');
    const container  = formRecurso.querySelector('.container_recursos_of_tema');

    // Renderizar estado vacío hasta que el usuario elija un tema
    renderEmpty(container);
    renderUploadItem(container, null);

    // Cada vez que cambia el tema, recargar recursos
    temaSelect.addEventListener('change', async () => {
        const id_tema = temaSelect.value;

        if (!id_tema) {
            renderEmpty(container);
            return;
        }

        recursos = await fetch_recursos(id_tema);
        renderGrid(container);
    });
}


// ─────────────────────────────────────────────────────────────
// renderEmpty()
// Estado inicial: ningún tema seleccionado.
// ─────────────────────────────────────────────────────────────
function renderEmpty(container) {
    container.querySelectorAll('.recurso-item').forEach(el => el.remove());

    // Si ya existe el placeholder no lo duplicamos
    if (container.querySelector('.recursos-empty')) return;

    const placeholder = document.createElement('div');
    placeholder.className = 'recursos-empty';
    placeholder.textContent = 'Selecciona un tema para ver sus recursos';
    placeholder.style.cssText = `
        padding: 24px;
        text-align: center;
        color: var(--color-text-tertiary);
        font-size: 14px;
        border: 0.5px dashed var(--color-border-tertiary);
        border-radius: var(--border-radius-md);
    `;

    const uploadItem = container.querySelector('.upload-item');
    container.insertBefore(placeholder, uploadItem ?? null);
}


// ─────────────────────────────────────────────────────────────
// renderGrid()
// Dibuja los items arrastrables. Limpia el placeholder si existe.
// ─────────────────────────────────────────────────────────────
function renderGrid(container) {
    container.querySelectorAll('.recurso-item, .recursos-empty')
        .forEach(el => el.remove());

    const uploadItem = container.querySelector('.upload-item');

    recursos.forEach((recurso, index) => {
        const item = document.createElement('div');
        item.className     = 'recurso-item';
        item.draggable     = true;
        item.dataset.index = index;

        const thumb = document.createElement('div');
        thumb.className = 'recurso-thumb';
        // TODO: cuando el servidor mande img_url descomentar:
        // thumb.style.backgroundImage = `url(${recurso.img_url})`;

        const nombre = document.createElement('span');
        nombre.className   = 'recurso-nombre';
        nombre.textContent = recurso.nombre;

        item.appendChild(thumb);
        item.appendChild(nombre);
        bindDragEvents(item, container);
        container.insertBefore(item, uploadItem);
    });
}


// ─────────────────────────────────────────────────────────────
// renderUploadItem()
// Caja de subida — siempre al final, se crea una sola vez.
// ─────────────────────────────────────────────────────────────
function renderUploadItem(container, id_tema) {
    const uploadItem = document.createElement('div');
    uploadItem.className = 'upload-item';

    const inputTitulo = document.createElement('input');
    inputTitulo.type        = 'text';
    inputTitulo.placeholder = 'Título del recurso';
    inputTitulo.addEventListener('input', () => checkSubmit(btnSubmit, inputTitulo));

    const inputFile = document.createElement('input');
    inputFile.type    = 'file';
    inputFile.accept  = '.png,.json';
    inputFile.style.display = 'none';
    inputFile.addEventListener('change', () => {
        selectedFile = inputFile.files[0] || null;
        checkSubmit(btnSubmit, inputTitulo);
    });

    const labelFile = document.createElement('label');
    labelFile.textContent = 'Seleccionar archivo';
    labelFile.appendChild(inputFile);

    const btnSubmit = document.createElement('button');
    btnSubmit.type        = 'button';
    btnSubmit.textContent = 'SUBMIT THE RESOURCE';
    btnSubmit.disabled    = true;
    btnSubmit.addEventListener('click', async () => {
        // Leer el tema activo en el momento del click, no al montar
        const id_tema_actual = container.closest('form')
            ?.querySelector('#temaSelect')?.value;

        const titulo = inputTitulo.value.trim();
        const result = await upload_recurso(titulo, selectedFile, id_tema_actual);
        if (!result.ok) return;

        recursos.push({ nombre: titulo, ID: result.ID });
        renderGrid(container);

        inputTitulo.value = '';
        inputFile.value   = '';
        selectedFile      = null;
        checkSubmit(btnSubmit, inputTitulo);
    });

    uploadItem.appendChild(inputTitulo);
    uploadItem.appendChild(labelFile);
    uploadItem.appendChild(btnSubmit);
    container.appendChild(uploadItem);
}


function checkSubmit(btn, inputTitulo) {
    btn.disabled = !(inputTitulo.value.trim().length > 0 && selectedFile !== null);
}


function bindDragEvents(item, container) {
    item.addEventListener('dragstart', () => { dragSrc = item; });

    item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (item !== dragSrc) item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));

    item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('drag-over');
        if (item === dragSrc) return;

        const from = +dragSrc.dataset.index;
        const to   = +item.dataset.index;
        recursos.splice(to, 0, recursos.splice(from, 1)[0]);
        renderGrid(container);

        update_orden(recursos.map((r, i) => ({ ID: r.ID, orden: i })));
    });

    item.addEventListener('dragend', () => {
        container.querySelectorAll('.recurso-item')
            .forEach(el => el.classList.remove('drag-over'));
    });
}
