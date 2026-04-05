import sqlite3

class GestorGaleria:
    def __init__(self, db_name="galeria.db"):
        # Crear conexión
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()
        self.crear_tablas()
    
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cerrar()

    def crear_tablas(self):
        """Crear tablas solo si no existen"""
        # Tabla Tema
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS Tema (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL
            )
        ''')
        
        # Tabla Imagenes (con ruta y orden)
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS Imagenes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                ruta TEXT NOT NULL,
                orden INTEGER DEFAULT 0,
                Tema_id INTEGER NOT NULL,
                FOREIGN KEY (Tema_id) REFERENCES Tema(id) ON DELETE CASCADE
            )
        ''')
        
        self.conn.commit()
    
    # ============ CRUD para TEMA ============
    def crear_tema(self, nombre):
        """Crear un nuevo tema"""
        self.cursor.execute("INSERT INTO Tema (nombre) VALUES (?)", (nombre,))
        self.conn.commit()
        print(f"✅ Tema '{nombre}' creado con ID: {self.cursor.lastrowid}")
        return self.cursor.lastrowid
    
    def leer_temas(self):
        """Ver todos los temas"""
        self.cursor.execute("SELECT id, nombre FROM Tema ORDER BY id")
        temas = self.cursor.fetchall()
        print("\n📁 LISTA DE TEMAS:")
        for tema in temas:
            print(f"   ID: {tema[0]} - {tema[1]}")
        return temas
    
    def actualizar_tema(self, tema_id, nuevo_nombre):
        """Actualizar nombre de un tema"""
        self.cursor.execute("UPDATE Tema SET nombre = ? WHERE id = ?", (nuevo_nombre, tema_id))
        self.conn.commit()
        print(f"✅ Tema ID {tema_id} actualizado a: {nuevo_nombre}")
    
    def eliminar_tema(self, tema_id):
        """Eliminar tema (BORRA TODAS SUS IMÁGENES automáticamente por ON DELETE CASCADE)"""
        self.cursor.execute("DELETE FROM Tema WHERE id = ?", (tema_id,))
        self.conn.commit()
        print(f"🗑️ Tema ID {tema_id} y todas sus imágenes han sido eliminados")
    
    # ============ CRUD para IMAGENES ============
    def crear_imagen(self, nombre, ruta, tema_id, orden=None):
        """Agregar una imagen a un tema con orden automático o manual"""
        # Verificar que el tema existe
        self.cursor.execute("SELECT id FROM Tema WHERE id = ?", (tema_id,))
        if not self.cursor.fetchone():
            print(f"❌ Error: El tema ID {tema_id} no existe")
            return None
        
        # Si no se especifica orden, asignar el siguiente número
        if orden is None:
            self.cursor.execute(
                "SELECT COALESCE(MAX(orden), 0) + 1 FROM Imagenes WHERE Tema_id = ?",
                (tema_id,)
            )
            orden = self.cursor.fetchone()[0]
        
        self.cursor.execute(
            "INSERT INTO Imagenes (nombre, ruta, orden, Tema_id) VALUES (?, ?, ?, ?)",
            (nombre, ruta, orden, tema_id)
        )
        self.conn.commit()
        print(f"✅ Imagen '{nombre}' (orden: {orden}) agregada al tema ID {tema_id}")
        return self.cursor.lastrowid
    
    def leer_imagenes(self, tema_id=None):
        """Ver imágenes ordenadas (de un tema específico o todas)"""
        if tema_id:
            self.cursor.execute(
                "SELECT id, nombre, ruta, orden, Tema_id FROM Imagenes WHERE Tema_id = ? ORDER BY orden",
                (tema_id,)
            )
        else:
            self.cursor.execute("SELECT id, nombre, ruta, orden, Tema_id FROM Imagenes ORDER BY Tema_id, orden")
        
        imagenes = self.cursor.fetchall()
        
        if not imagenes:
            print("📸 No hay imágenes registradas")
            return []
        
        print("\n🖼️ LISTA DE IMÁGENES:")
        for img in imagenes:
            print(f"   ID: {img[0]} | Orden: {img[3]} | Nombre: {img[1]} | Ruta: {img[2]} | Tema ID: {img[4]}")
        return imagenes
    
    def actualizar_imagen(self, imagen_id, nombre=None, ruta=None, orden=None):
        """Actualizar nombre, ruta y/o orden de una imagen"""
        if nombre:
            self.cursor.execute("UPDATE Imagenes SET nombre = ? WHERE id = ?", (nombre, imagen_id))
        if ruta:
            self.cursor.execute("UPDATE Imagenes SET ruta = ? WHERE id = ?", (ruta, imagen_id))
        if orden is not None:
            self.cursor.execute("UPDATE Imagenes SET orden = ? WHERE id = ?", (orden, imagen_id))
        
        self.conn.commit()
        print(f"✅ Imagen ID {imagen_id} actualizada")
    
    def reordenar_imagen(self, imagen_id, nueva_posicion):
        """Cambiar el orden de una imagen específica"""
        # Obtener información actual
        self.cursor.execute("SELECT Tema_id, orden FROM Imagenes WHERE id = ?", (imagen_id,))
        tema_id, orden_actual = self.cursor.fetchone()
        
        # Obtener el máximo orden
        self.cursor.execute("SELECT COUNT(*) FROM Imagenes WHERE Tema_id = ?", (tema_id,))
        max_orden = self.cursor.fetchone()[0]
        
        # Validar nueva posición
        if nueva_posicion < 1:
            nueva_posicion = 1
        if nueva_posicion > max_orden:
            nueva_posicion = max_orden
        
        if nueva_posicion == orden_actual:
            print(f"⚠️ La imagen ya está en la posición {nueva_posicion}")
            return
        
        # Reordenar
        if nueva_posicion < orden_actual:
            # Mover hacia arriba
            self.cursor.execute('''
                UPDATE Imagenes 
                SET orden = orden + 1 
                WHERE Tema_id = ? AND orden >= ? AND orden < ?
            ''', (tema_id, nueva_posicion, orden_actual))
        else:
            # Mover hacia abajo
            self.cursor.execute('''
                UPDATE Imagenes 
                SET orden = orden - 1 
                WHERE Tema_id = ? AND orden > ? AND orden <= ?
            ''', (tema_id, orden_actual, nueva_posicion))
        
        # Actualizar la imagen movida
        self.cursor.execute("UPDATE Imagenes SET orden = ? WHERE id = ?", (nueva_posicion, imagen_id))
        self.conn.commit()
        
        print(f"🔄 Imagen movida de orden {orden_actual} a {nueva_posicion}")
    
    def eliminar_imagen(self, imagen_id):
        """Eliminar una imagen específica y reordenar las restantes"""
        # Obtener información antes de eliminar
        self.cursor.execute("SELECT Tema_id, orden FROM Imagenes WHERE id = ?", (imagen_id,))
        tema_id, orden_eliminado = self.cursor.fetchone()
        
        # Eliminar la imagen
        self.cursor.execute("DELETE FROM Imagenes WHERE id = ?", (imagen_id,))
        
        # Reordenar las que quedan
        self.cursor.execute('''
            UPDATE Imagenes 
            SET orden = orden - 1 
            WHERE Tema_id = ? AND orden > ?
        ''', (tema_id, orden_eliminado))
        
        self.conn.commit()
        print(f"🗑️ Imagen ID {imagen_id} eliminada (orden {orden_eliminado})")
    
    # ============ EXTRA: Mostrar imágenes de un tema con orden ============
    def mostrar_imagenes_de_tema(self, tema_id):
        """Mostrar todas las imágenes de un tema con su orden"""
        self.cursor.execute('''
            SELECT Imagenes.id, Imagenes.nombre, Imagenes.ruta, Imagenes.orden
            FROM Imagenes 
            JOIN Tema ON Imagenes.Tema_id = Tema.id
            WHERE Tema.id = ?
            ORDER BY Imagenes.orden
        ''', (tema_id,))
        
        imagenes = self.cursor.fetchall()
        
        if imagenes:
            print(f"\n📸 IMÁGENES DEL TEMA (ID: {tema_id}):")
            for img in imagenes:
                print(f"   Orden {img[3]}: {img[1]} (ID: {img[0]}) -> Ruta: {img[2]}")
        else:
            print(f"📸 El tema ID {tema_id} no tiene imágenes")
        
        return imagenes
    
    def cerrar(self):
        """Cerrar conexión"""
        self.conn.close()

# ============ EJEMPLO DE USO ============
if __name__ == "__main__":
    # Crear instancia (crea la base de datos si no existe)
    galeria = GestorGaleria("mi_galeria.db")
    
    print("=" * 50)
    print("🎯 SISTEMA DE GALERÍA CON ORDEN Y RUTAS")
    print("=" * 50)
    
    # 1. Crear temas
    print("\n--- CREANDO TEMAS ---")
    tema1 = galeria.crear_tema("Circuito N555")
    tema2 = galeria.crear_tema("Arduino Uno")
    
    # 2. Ver temas
    galeria.leer_temas()
    
    # 3. Agregar imágenes (orden automático)
    print("\n--- AGREGANDO IMÁGENES (ORDEN AUTOMÁTICO) ---")
    galeria.crear_imagen("Reloj", "imagenes/reloj.jpg", tema1)
    galeria.crear_imagen("Placa", "imagenes/placa.png", tema1)
    galeria.crear_imagen("Chip", "fotos/chip.webp", tema1)
    galeria.crear_imagen("LED", "imagenes/led.jpg", tema2)
    galeria.crear_imagen("Resistencia", "fotos/resistencia.png", tema2)
    
    # 4. Ver todas las imágenes
    print("\n--- TODAS LAS IMÁGENES ---")
    galeria.leer_imagenes()
    
    # 5. Ver imágenes de un tema específico
    print("\n--- IMÁGENES DEL TEMA 1 ---")
    galeria.mostrar_imagenes_de_tema(tema1)
    
    # 6. Reordenar imágenes
    print("\n--- REORDENANDO IMÁGENES ---")
    print("Moviendo 'Chip' (ID 3) a la posición 1...")
    galeria.reordenar_imagen(3, 1)
    galeria.mostrar_imagenes_de_tema(tema1)
    
    print("\nMoviendo 'Reloj' (ID 1) a la posición 3...")
    galeria.reordenar_imagen(1, 3)
    galeria.mostrar_imagenes_de_tema(tema1)
    
    # 7. Modificar una imagen (cambiar nombre, ruta y orden manual)
    print("\n--- MODIFICANDO IMAGEN ---")
    galeria.actualizar_imagen(imagen_id=1, nombre="Reloj Digital", ruta="imagenes/reloj_digital.jpg", orden=2)
    galeria.mostrar_imagenes_de_tema(tema1)
    
    # 8. Eliminar una imagen (automáticamente reordena)
    print("\n--- ELIMINANDO IMAGEN ---")
    galeria.eliminar_imagen(2)  # Eliminar Placa
    galeria.mostrar_imagenes_de_tema(tema1)
    
    # 9. Agregar imagen en posición específica
    print("\n--- AGREGANDO IMAGEN EN POSICIÓN 2 ---")
    galeria.crear_imagen("Transistor", "fotos/transistor.jpg", tema1, orden=2)
    galeria.mostrar_imagenes_de_tema(tema1)
    
    # 10. ELIMINAR UN TEMA (BORRA TODAS SUS IMÁGENES AUTOMÁTICAMENTE)
    print("\n--- ELIMINANDO TEMA 2 (Arduino Uno) ---")
    galeria.eliminar_tema(tema2)
    
    # 11. Verificar que las imágenes del tema 2 también se borraron
    print("\n--- VERIFICANDO QUE TODO SE BORRÓ ---")
    galeria.leer_imagenes()
    galeria.leer_temas()
    
    # Cerrar conexión
    galeria.cerrar()
    print("\n✨ Base de datos guardada en: mi_galeria.db")

