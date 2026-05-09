# Presentaciones

Aplicación web para controlar y mostrar presentaciones con imágenes de forma dinámica.

Actualmente el proyecto tiene 3 vistas principales:

- **/control**: panel para seleccionar tema, abrir recursos y navegar (anterior/siguiente).
- **/monitor**: pantalla de proyección que recibe imágenes por **WebSocket**.
- **/recursos**: interfaz base para crear temas/agregar recursos (todavía en desarrollo parcial).

---

## Stack actual

- Python 3
- Flask
- Flask-SocketIO
- SQLite (archivo `galeria.db`)
- HTML + CSS + JavaScript (sin framework frontend)

---

## Estructura del proyecto

```text
presentaciones/
├── app/
│   ├── db/main.py              # Gestor de base de datos (tema + imágenes)
│   ├── routes/                 # Blueprints (control, monitor, recursos)
│   ├── static/                 # CSS, JS e imágenes
│   └── templates/              # control.html, monitor.html, recursos.html
├── importar_images.py          # Script para importar imágenes por tema
├── run.py                      # Punto de entrada del servidor
├── galeria.db                  # Base de datos SQLite
└── requirements.txt
```

---

## Instalación

1. Crear entorno virtual (recomendado):

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

---

## Ejecutar proyecto

```bash
python run.py
```

Configuración actual en el código (pensada para desarrollo):

- Host: `0.0.0.0`
- Puerto: `5000`
- Debug: `True`

> ⚠️ Seguridad: no uses esta configuración en producción.  
> Para uso local, puedes cambiar `host` a `127.0.0.1`.  
> Para producción, configura `debug=False` y restringe exposición de red.

Abrir en navegador:

- `http://localhost:5000/control`
- `http://localhost:5000/monitor`
- `http://localhost:5000/recursos`

---

## Flujo de uso actual

1. Cargar datos en la base de datos (`galeria.db`) usando `importar_images.py` o directamente desde SQLite.
2. Abrir **/monitor** en la pantalla de proyección.
3. Abrir **/control** en el dispositivo de control.
4. Elegir tema y recurso; al seleccionar, se emite evento `nueva_imagen` al monitor.

---

## Importar imágenes automáticamente

El script `importar_images.py` crea un tema e importa imágenes numeradas de una carpeta.

Formato esperado de archivos en carpeta origen:

- `1.png`, `2.jpg`, `3.webp`, etc. (nombres numéricos)

Ejemplo:

```bash
python importar_images.py "CircuitoN555" ./imagenes
```

Qué hace:

- Crear el tema en la tabla `Tema`
- Copiar imágenes a `app/static/images`
- Registrar cada imagen en la tabla de imágenes (`Imagenes`) con su `orden`

---

## API actual (resumen)

Desde `control_routes.py`:

- `GET /api/temas` → lista temas
- `GET /api/recursos/<id_tema>` → lista imágenes de un tema
- `POST /api/monitor/<id_imagen>` → envía imagen al monitor
- `POST /api/anterior/<id_tema>` → imagen anterior del tema
- `POST /api/siguiente/<id_tema>` → imagen siguiente del tema

Desde `recursos_route.py`:

- `POST /api/recursos/upload` (stub)
- `POST /api/recursos/orden` (stub)

---

## Estado actual / pendientes

- El panel **control + monitor** está funcional para mostrar imágenes.
- La sección **/recursos** tiene endpoints y UI base, pero faltan implementaciones reales de subida y orden persistente desde frontend.

## Resolución rápida de problemas

Si aparece `ModuleNotFoundError: No module named 'flask_socketio'`, instala:

```bash
pip install flask-socketio
```
