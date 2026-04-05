# app/routes/control_routes.py

from flask import Blueprint, jsonify, render_template, session
from app.db.main import GestorGaleria
from app.routes.monitor_routes import enviar_imagen

control = Blueprint('control', __name__)

@control.route('/control')
def index():
    return render_template('control.html')


@control.route('/api/temas')
def get_temas():
    with GestorGaleria("galeria.db") as db:
        temas = db.leer_temas()
        return jsonify([
            { 'titulo_tema': nombre, 'ID': id }
            for id, nombre in temas
        ])


@control.route('/api/recursos/<int:id_tema>')
def get_recursos(id_tema):
    with GestorGaleria("galeria.db") as db:
        imagenes = db.leer_imagenes(tema_id=id_tema)
        return jsonify([
            { 'nombre': nombre, 'ID': id, 'ruta': ruta, 'orden': orden }
            for id, nombre, ruta, orden, _ in imagenes
        ])


@control.route('/api/monitor/<int:id_imagen>', methods=['POST'])
def post_monitor(id_imagen):
    with GestorGaleria("galeria.db") as db:
        imagenes = db.leer_imagenes()
        for img_id, nombre, ruta, orden, tema_id in imagenes:
            if img_id == id_imagen:
                enviar_imagen(ruta)
                # Guardar el progreso en sesión
                imagenes_tema = db.leer_imagenes(tema_id=tema_id)
                for idx, (i_id, _, _, _, _) in enumerate(imagenes_tema):
                    if i_id == id_imagen:
                        session[f'idx_tema_{tema_id}'] = idx
                        break
                return jsonify({ 'ok': True, 'id': id_imagen })
        return jsonify({ 'error': 'Imagen no encontrada' }), 404


@control.route('/api/anterior/<int:id_tema>', methods=['POST'])
def post_anterior(id_tema):

    with GestorGaleria("galeria.db") as db:
        imagenes = db.leer_imagenes(tema_id=id_tema)
        if not imagenes:
            return jsonify({ 'ok': True, 'id_tema': id_tema })
        
        # Obtener índice actual o empezar desde 0
        idx = session.get(f'idx_tema_{id_tema}', 0)
        
        # Calcular anterior (cíclico)
        idx = (idx - 1) % len(imagenes)
        session[f'idx_tema_{id_tema}'] = idx
        
        # Enviar la imagen al monitor
        imagen_id, nombre, ruta, orden, _ = imagenes[idx]
        enviar_imagen(ruta)
        
        return jsonify({ 'ok': True, 'id_tema': id_tema })


@control.route('/api/siguiente/<int:id_tema>', methods=['POST'])
def post_siguiente(id_tema):
    with GestorGaleria("galeria.db") as db:
        imagenes = db.leer_imagenes(tema_id=id_tema)
        if not imagenes:
            return jsonify({ 'ok': True, 'id_tema': id_tema })
        
        # Obtener índice actual o empezar desde -1 para que el primero sea 0
        idx = session.get(f'idx_tema_{id_tema}', -1)
        
        # Calcular siguiente (cíclico)
        idx = (idx + 1) % len(imagenes)
        session[f'idx_tema_{id_tema}'] = idx
        
        # Enviar la imagen al monitor
        imagen_id, nombre, ruta, orden, _ = imagenes[idx]
        enviar_imagen(ruta)
        
        return jsonify({ 'ok': True, 'id_tema': id_tema })

