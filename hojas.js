class Hoja {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.velY = random(1, 2);
    this.velX = random(-0.5, 0.5);
    this.rotacion = random(TWO_PI);
    this.velRotacion = random(-0.02, 0.02);
    this.escala = 1;
    this.opacidad = 255;
    this.umbral = AMP_MIN;
    this.moviendo = false;
    this.tiempoInicio = null;
  }

  actualizar(amp) {
    if (amp > this.umbral) {
      if (this.tiempoInicio === null) {
        this.tiempoInicio = millis();
      }
      if (millis() - this.tiempoInicio > 500) {
        this.moviendo = true;
      }
    } else {
      if (this.tiempoInicio !== null) {
        if (millis() - this.tiempoInicio < 500) {
          this.moviendo = false;
        }
        this.tiempoInicio = null;
      }
    }

    if (this.moviendo) {
      this.y += this.velY;
      this.x += this.velX;
      this.rotacion += this.velRotacion;

      if (this.y > height + 50) {
        this.y = -random(50);
        this.x = random(width);
      }
    }
  }

  dibujar() {
    push();
    translate(this.x, this.y);
    rotate(this.rotacion);
    scale(this.escala);
    imageMode(CENTER);
    tint(255, this.opacidad);
    image(this.img, 0, 0, 500, 500);
    pop();
  }
}
