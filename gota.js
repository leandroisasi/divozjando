class Gota {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.tamano = 20;
    this.opacidad = 255;
  }

  dibujar() {
    push();
    tint(255, this.opacidad);
    image(this.img, this.x, this.y, this.tamano, this.tamano);
    pop();
  }
}
