#!/usr/bin/env python3
import os
import sys
import shutil
from pathlib import Path
from app.db.main import GestorGaleria

class ImportadorImagenes:
    def __init__(self, db_name="galeria.db"):
        self.gestor = GestorGaleria(db_name)
        self.carpeta_destino = Path("app/static/images")
        
        # Crear carpeta de destino si no existe
        self.carpeta_destino.mkdir(parents=True, exist_ok=True)
    
    def obtener_imagenes_de_carpeta(self, carpeta_origen):
        """Busca imágenes numeradas (1.png, 2.jpg, 3.webp, etc.)"""
        imagenes = []
        extensiones = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'}
        
        for archivo in os.listdir(carpeta_origen):
            archivo_path = Path(archivo)
            extension = archivo_path.suffix.lower()
            
            if extension in extensiones:
                # Intentar extraer el número del nombre
                nombre_sin_extension = archivo_path.stem
                try:
                    # Si el nombre es solo un número
                    numero = int(nombre_sin_extension)
                    imagenes.append({
                        'numero': numero,
                        'nombre_original': archivo,
                        'ruta_completa': os.path.join(carpeta_origen, archivo),
                        'extension': extension
                    })
                except ValueError:
                    # Si no es solo número, ignorar o podrías agregar lógica diferente
                    print(f"⚠️ Ignorando: {archivo} (no es un número)")
        
        # Ordenar por número
        imagenes.sort(key=lambda x: x['numero'])
        return imagenes
    
    def importar_imagenes(self, nombre_tema, carpeta_origen):
        """Importa todas las imágenes de una carpeta a un tema"""
        
        # 1. Verificar que la carpeta origen existe
        if not os.path.exists(carpeta_origen):
            print(f"❌ Error: La carpeta '{carpeta_origen}' no existe")
            return False
        
        # 2. Obtener imágenes de la carpeta
        print(f"\n📂 Buscando imágenes en: {carpeta_origen}")
        imagenes = self.obtener_imagenes_de_carpeta(carpeta_origen)
        
        if not imagenes:
            print(f"❌ No se encontraron imágenes numeradas (1.png, 2.jpg, etc.) en {carpeta_origen}")
            return False
        
        print(f"✅ Encontradas {len(imagenes)} imágenes:")
        for img in imagenes:
            print(f"   - {img['nombre_original']} (Número: {img['numero']})")
        
        # 3. Crear o obtener el tema
        tema_id = self.gestor.crear_tema(nombre_tema)
        print(f"\n📁 Tema '{nombre_tema}' (ID: {tema_id})")
        
        # 4. Importar cada imagen
        print("\n📸 Importando imágenes...")
        for img in imagenes:
            # Generar nombre de destino
            nombre_destino = f"{nombre_tema}_{img['numero']}{img['extension']}"
            ruta_destino = self.carpeta_destino / nombre_destino
            
            # Copiar imagen a la carpeta app/images
            shutil.copy2(img['ruta_completa'], ruta_destino)
            
            # Guardar en base de datos con ruta relativa
            ruta_relativa = f"app/images/{nombre_destino}"
            self.gestor.crear_imagen(
                nombre=f"{nombre_tema}_img_{img['numero']}",
                ruta=ruta_relativa,
                tema_id=tema_id,
                orden=img['numero']
            )
            print(f"   ✅ {img['nombre_original']} → {nombre_destino} (Orden: {img['numero']})")
        
        print(f"\n🎉 ¡Importación completada! {len(imagenes)} imágenes agregadas al tema '{nombre_tema}'")
        return True
    
    def mostrar_tablas(self):
        """Muestra ambas tablas de forma bonita"""
        print("\n" + "=" * 70)
        print("📊 BASE DE DATOS - ESTADO ACTUAL")
        print("=" * 70)
        
        # Mostrar temas
        temas = self.gestor.leer_temas()
        print("\n📁 TABLA TEMAS:")
        print("-" * 70)
        if temas:
            print(f"{'ID':<6} {'NOMBRE':<40}")
            print("-" * 70)
            for tema in temas:
                print(f"{tema[0]:<6} {tema[1]:<40}")
        else:
            print("   No hay temas registrados")
        
        # Mostrar imágenes
        imagenes = self.gestor.leer_imagenes()
        print("\n🖼️ TABLA IMAGENES:")
        print("-" * 70)
        if imagenes:
            print(f"{'ID':<6} {'NOMBRE':<25} {'ORDEN':<8} {'TEMA_ID':<10} {'RUTA':<30}")
            print("-" * 70)
            for img in imagenes:
                if len(img) == 5:  # Todas las imágenes
                    print(f"{img[0]:<6} {img[1]:<25} {img[3]:<8} {img[4]:<10} {img[2][:30]:<30}")
                else:  # Imágenes de un tema específico
                    print(f"{img[0]:<6} {img[1]:<25} {img[3]:<8} {'N/A':<10} {img[2][:30]:<30}")
        else:
            print("   No hay imágenes registradas")
        
        print("\n" + "=" * 70)
    
    def cerrar(self):
        self.gestor.cerrar()


def main():
    print("=" * 70)
    print("🎯 IMPORTADOR AUTOMÁTICO DE IMÁGENES")
    print("=" * 70)
    
    # Verificar argumentos
    if len(sys.argv) < 3:
        print("\n❌ Uso correcto:")
        print(f"   python {sys.argv[0]} <nombre_tema> <carpeta_origen>")
        print("\n📌 Ejemplo:")
        print(f"   python {sys.argv[0]} CircuitoN555 ./imagenes")
        print("   (Esto importará 1.png, 2.jpg, 3.png, etc. de la carpeta 'imagenes')")
        sys.exit(1)
    
    nombre_tema = sys.argv[1]
    carpeta_origen = sys.argv[2]
    
    # Crear importador
    importador = ImportadorImagenes("galeria.db")
    
    try:
        # Importar imágenes
        if importador.importar_imagenes(nombre_tema, carpeta_origen):
            # Mostrar ambas tablas
            importador.mostrar_tablas()
        else:
            print("\n❌ Importación fallida")
    
    except Exception as e:
        print(f"\n❌ Error: {e}")
    
    finally:
        importador.cerrar()


if __name__ == "__main__":
    main()
