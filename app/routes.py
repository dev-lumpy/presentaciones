from flask import Blueprint, render_template, jsonify

main = Blueprint('main', __name__)


@main.route('/control')
def index():
    return render_template('control.html')


@main.route('/api/temas')
def get_temas():
    # TODO: reemplazar con consulta a BD
    # temas = Tema.query.all()
    # return jsonify([{ 'titulo_tema': t.titulo, 'ID': t.id } for t in temas])
    return jsonify([
        { 'titulo_tema': 'Display 7 Segmentos', 'ID': 'tema-01' },
        { 'titulo_tema': 'N555',                'ID': 'tema-02' },
        { 'titulo_tema': 'Flip Flop',           'ID': 'tema-03' },
    ])


@main.route('/api/recursos/<string:id_tema>')
def get_recursos(id_tema):
    # TODO: reemplazar con consulta a BD filtrando por id_tema
    # animaciones = Animacion.query.filter_by(tema_id=id_tema).all()
    # return jsonify([{ 'nombre': a.nombre, 'ID': a.id } for a in animaciones])
    return jsonify([
        { 'nombre': 'Carga del Condensador',  'ID': '4322' },
        { 'nombre': 'Disparo del Comparador', 'ID': '4323' },
        { 'nombre': 'Descarga',               'ID': '4324' },
    ])


@main.route('/api/novedades/<string:id_tema>')
def get_novedades(id_tema):
    # TODO: consultar BD si hay animaciones nuevas desde la última vez
    # que el cliente cargó este tema (requiere timestamp o versión)
    return jsonify({ 'hay_novedades': True })


@main.route('/api/monitor/<string:id_animacion>', methods=['POST'])
def post_monitor(id_animacion):
    # TODO: comunicarse con el monitor externo pasándole el id_animacion
    # monitor.mostrar(id_animacion)
    return jsonify({ 'ok': True, 'id': id_animacion })


@main.route('/api/anterior/<string:id_tema>', methods=['POST'])
def post_anterior(id_tema):
    # TODO: buscar en BD el tema con id_tema
    # luego retroceder al recurso/imagen anterior dentro de ese tema
    # requiere guardar el índice actual (sesión, BD, o estado en cliente)
    return jsonify({ 'ok': True, 'id_tema': id_tema })


@main.route('/api/siguiente/<string:id_tema>', methods=['POST'])
def post_siguiente(id_tema):
    # TODO: buscar en BD el tema con id_tema
    # luego avanzar al recurso/imagen siguiente dentro de ese tema
    # requiere guardar el índice actual (sesión, BD, o estado en cliente)
    return jsonify({ 'ok': True, 'id_tema': id_tema })
