from flask import Flask
from flask_socketio import SocketIO
import os

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.urandom(24)

    socketio.init_app(app)

    from app.routes.control_routes import control
    from app.routes.recursos_route import recursos
    from app.routes.monitor_routes import monitor

    app.register_blueprint(control)
    app.register_blueprint(recursos)
    app.register_blueprint(monitor)
    
    return app

