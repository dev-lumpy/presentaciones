# app/routes/monitor_routes.py

from flask import Blueprint, render_template, url_for
from app import socketio

monitor = Blueprint('monitor', __name__)

@monitor.route('/monitor')
def index():
    return render_template('monitor.html')


# 👇 Evento WebSocket aquí mismo
@socketio.on('connect')
def handle_connect():
    print("Cliente conectado al monitor")


# Función para enviar imagen
def enviar_imagen(url_image):
    print("Se esta enviando la imagen: ", url_image)
    url = url_for('static', filename=url_image)
    socketio.emit('nueva_imagen', {'url': url})

