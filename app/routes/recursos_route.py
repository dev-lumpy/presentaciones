from flask import Blueprint, render_template, jsonify

recursos = Blueprint('recursos', __name__)

@recursos.route("/recursos")
def main():
    return render_template("recursos.html")

@recursos.route('/api/recursos/upload', methods=['POST'])
def upload_recurso():
    # TODO: recibir request.files['archivo'] y request.form['titulo']
    # guardar el archivo en el servidor y registrar en BD
    # archivo = request.files.get('archivo')
    # titulo  = request.form.get('titulo')
    # archivo.save(f'app/static/uploads/{archivo.filename}')
    return jsonify({ 'ok': True, 'ID': '9999' })


@recursos.route('/api/recursos/orden', methods=['POST'])
def update_orden():
    # TODO: recibir lista [{ ID, orden }] y actualizar en BD
    # data = request.get_json()
    # for item in data['orden']:
    #     Animacion.query.get(item['ID']).orden = item['orden']
    # db.session.commit()
    return jsonify({ 'ok': True })

