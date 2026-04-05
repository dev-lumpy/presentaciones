// ─────────────────────────────────────────────────────────────
// app/static/js/scripts_recursos/main.js
//
// Punto de entrada de recursos.html
// Solo localiza los elementos raiz y delega todo a 
// events_add_tema.js.
// ─────────────────────────────────────────────────────────────

import { main_add_tema    } from './events_add_tema.js'    ;
import { main_add_recurso } from './events_add_recurso.js' ;
import { refresh_temas    } from './utils.js'              ;

document.addEventListener('DOMContentLoaded', async () => {
    // Activa FORM: crear tema; Desactiva FORM: agregar recursos
    // y Vicebersa
    document.getElementById('tema').addEventListener('change', function() {
      if (this.checked) {
        console.log('Checkbox seleccionado');
        // Aquí pones el código que quieres ejecutar cuando se selecciona
        
        document.getElementById('formRecurso').style.display = "none"; 
        document.getElementById('formCreate').style.display = "grid"; 
      } else {
        console.log('Checkbox deseleccionado');
        // Código cuando se deselecciona

        document.getElementById('formCreate').style.display = "none"; 
        document.getElementById('formRecurso').style.display = "grid"; 
      }
    });
    
    main_add_tema(document.getElementById('formCreate'))
    main_add_recurso(document.getElementById('formRecurso'))
    refresh_temas(document.getElementById('temaSelect'))
});
   

