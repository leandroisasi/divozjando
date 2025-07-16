class FondoDinamico {
  constructor(imagenes) {
    this.imagenes = imagenes;
    this.actual = 0;
    this.cantidadDeImagenes = this.imagenes.length; // guardo la cantidad total de imágenes
  }

  avanzarFondo() {
    this.actual = this.actual + 1;
    if (this.actual >= this.cantidadDeImagenes) {
      this.actual = 0;
    }
  }

  mostrar() {
let fondo = this.imagenes[this.actual];
    image(fondo, 0, 0, width, height);
  }
}
