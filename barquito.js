class Barquito {
  constructor(x, y, imagen) {
    this.x = x;
    this.y = y;
    this.img = imagen;
    this.velocidad = random(0.8, 2.5);
    this.moviendo = false;
    this.tiempoInicio = null;
    this.umbral = 0.03;
    this.escala = 0.1;
    this.opacidad = 255;
  }

  actualizar(amplitud) {
    if (amplitud > this.umbral) {
      if (this.tiempoInicio === null) {
        this.tiempoInicio = millis();
      }
      const duracion = millis() - this.tiempoInicio;
      if (duracion > 500) {
        this.moviendo = true;
      }
    } else {
      if (this.tiempoInicio !== null) {
        const duracion = millis() - this.tiempoInicio;
        if (duracion < 500) {
          this.moviendo = false;
        }
        this.tiempoInicio = null;
      }
    }

    if (this.moviendo) {
      this.x += this.velocidad;
      if (this.x > width) {
        this.x = -40; // reinicia fuera de pantalla a la izquierda
      }
    }
  }

  dibujar() {
    push();
    translate(this.x, this.y);
    scale(this.escala);
    tint(255, this.opacidad);
    image(this.img, 0, 0, 290, 150);
    noTint();
    pop();
  }
}


