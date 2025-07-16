let AMP_MIN = 0.05;
let APLAUSO_MINIMO = 0.18;
let CAMBIO_FONDO_MINIMO = 0.15;
let AGRANDAR_MINIMO = 0.14;
let ACHICAR_MINIMO = 0.05;
let TIEMPO_SIN_SONIDO = 10000;

let mic;
let amp;
let imagenes = [];
let barquitos = [];

let fondos = [];
let fondoActual;

let gotas = [];
let imagenesGotas = [];

let hojas = [];
let imagenesHojas = [];

let aplausoActivo = false;
let cambioFondoActivo = false;
let ultimoSonido = 0;

function preload() {
  for (let i = 1; i <= 16; i++) {
    imagenes.push(loadImage("imagenes/barquito" + i + ".png"));
  }

  for (let i = 1; i <= 3; i++) {
    fondos.push(loadImage("imagenes/fondo" + i + ".jpg"));
  }

  for (let i = 1; i <= 7; i++) {
    imagenesGotas.push(loadImage("imagenes/gota" + i + ".png"));
  }

  for (let i = 1; i <= 4; i++) {
    imagenesHojas.push(loadImage("imagenes/hoja" + i + ".png"));
  }
}

function setup() {
  createCanvas(644, 799);
  mic = new p5.AudioIn();
  mic.start();

  let columnas = 7;
  let filas = 8;
  let espacioX = width / columnas;
  let espacioY = height / filas;

  for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < filas; j++) {
      let posicionX = i * espacioX + random(-espacioX / 2, espacioX / 3);
      let posicionY = j * espacioY + random(-espacioY / 3, espacioY / 3);
      let imagen = random(imagenes);
      barquitos.push(new Barquito(posicionX, posicionY, imagen));
    }
  }

  fondoActual = new FondoDinamico(fondos);

  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let img = random(imagenesHojas);
    hojas.push(new Hoja(x, y, img));
  }
}

function draw() {
  amp = mic.getLevel();

  if (amp > AMP_MIN) {
    ultimoSonido = millis();
  }

  let tiempoSinSonido = millis() - ultimoSonido;

  // Calculamos una sola vez la opacidad reducida según el tiempo sin sonido
  let opacidadReducida;
  if (tiempoSinSonido > TIEMPO_SIN_SONIDO) {
    let extra = tiempoSinSonido - TIEMPO_SIN_SONIDO;
    opacidadReducida = map(extra, 0, 10000, 255, 0, true);
  } else {
    opacidadReducida = 255;
  }

  if (amp > CAMBIO_FONDO_MINIMO) {
    if (cambioFondoActivo === false) {
      fondoActual.avanzarFondo();
      cambioFondoActivo = true;
    }
  } else if (amp < CAMBIO_FONDO_MINIMO * 0.8) {
    cambioFondoActivo = false;
  }

  fondoActual.mostrar();

  //push();
  //textSize(16);
  //fill(0);
  //text("Amplitud: " + nf(amp, 2, 3), 20, 30);
  //pop();

  //nos sirve para chequear si el microfono de cada uno sirve

  if (amp > APLAUSO_MINIMO) {
    if (aplausoActivo === false) {
      for (let i = 0; i < 5; i++) {
        let x = random(width);
        let y = random(height);
        let img = random(imagenesGotas);
        gotas.push(new Gota(x, y, img));
      }
      aplausoActivo = true;
    }
  } else if (amp < APLAUSO_MINIMO * 0.8) {
    aplausoActivo = false;
  }

  // Barquitos
  for (let i = 0; i < barquitos.length; i++) {
    let barco = barquitos[i];
    barco.actualizar(amp);

    if (amp > ACHICAR_MINIMO) {
      barco.escala = map(amp, ACHICAR_MINIMO, 0.3, 0.9, 1.5, true);
    } else if (amp < AGRANDAR_MINIMO) {
      barco.escala = map(amp, 0, AGRANDAR_MINIMO, 0.5, 0.9, true);
    } else {
      barco.escala = 0.1;
    }

    barco.opacidad = opacidadReducida;
    barco.dibujar();
  }

  // Hojas
  for (let i = 0; i < hojas.length; i++) {
    let hoja = hojas[i];
    hoja.actualizar(amp);

    if (amp > AGRANDAR_MINIMO) {
      hoja.escala = map(amp, AGRANDAR_MINIMO, 0.3, 0.9, 1.5, true);
    } else if (amp < ACHICAR_MINIMO) {
      hoja.escala = map(amp, 0, ACHICAR_MINIMO, 0.5, 0.9, true);
    } else {
      hoja.escala = 1;
    }

    hoja.opacidad = opacidadReducida;
    hoja.dibujar();
  }

  // Gotas
  for (let i = 0; i < gotas.length; i++) {
    let gota = gotas[i];
    gota.opacidad = opacidadReducida;
    gota.dibujar();
  }

  if (opacidadReducida <= 0) {
    gotas = [];
  }
}


//ej: gotas.length: length "cantidad" o "numero total de elementos" en un arreglo.
//APLAUSO_MINIMO es el nivel mínimo de sonido (amplitud) que tiene que detectar el micrófono para que el programa considere que hay un aplauso activo y así pueda hacer las gotas, o activar alguna acción relacionada al aplauso.
//fondoActual es un objeto que controla varios fondos.
//Repeticion de 1000 milisegundos, crear const TIEMPO_SIN_SONIDO = 10000; y reemplazar todo.