let AMP_MIN = 0.05;
let APLAUSO_MINIMO = 0.13;
let CAMBIO_FONDO_MINIMO = 0.10;
let AGRANDAR_MINIMO = 0.05;
let ACHICAR_MINIMO = 0.09;

let mic;
let amp;
let imagenes = [];
let barquitos = [];
let numBarcos = 16;

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
  // Barquitos
  for (let i = 1; i <= numBarcos; i++) {
    imagenes.push(loadImage("imagenes/barquito" + i + ".png"));
  }

  // Fondos
  for (let i = 1; i <= 3; i++) {
    fondos.push(loadImage("imagenes/fondo" + i + ".jpg"));
  }

  // Gotas
  for (let i = 1; i <= 6; i++) {
    imagenesGotas.push(loadImage("imagenes/gota" + i + ".png"));
  }

  // Hojas
  for (let i = 1; i <= 4 ; i++) {
    imagenesHojas.push(loadImage("imagenes/hoja" + i + ".png"));
  }
}

function setup() {
  createCanvas(644, 799);
  mic = new p5.AudioIn();
  mic.start();

  let columnas = 5;
  let filas = 6;
  let espacioX = width / columnas;
  let espacioY = height / filas;

  // Crear barquitos
  for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < filas; j++) {
      let posicionX = i * espacioX + random(-espacioX / 2, espacioX / 3);
      let posicionY = j * espacioY + random(-espacioY / 3, espacioY / 3);
      let imagen = random(imagenes);
      barquitos.push(new Barquito(posicionX, posicionY, imagen));
    }
  }

  // Crear fondo dinámico
  fondoActual = new FondoDinamico(fondos);

  // Crear hojas
  for (let i = 0; i < 10 ; i++) {
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

  // Cambio de fondo
  if (amp > CAMBIO_FONDO_MINIMO) {
    if (cambioFondoActivo == false) {
      fondoActual.avanzarFondo();
      cambioFondoActivo = true;
    }
  } else if (amp < CAMBIO_FONDO_MINIMO * 0.8) {
    cambioFondoActivo = false;
  }

  fondoActual.mostrar();

  // Mostrar amplitud
  push();
  textSize(16);
  fill(0);
  text("Amplitud: " + nf(amp, 2, 3), 20, 30);
  pop();

  // Aplauso: crear gotas
  if (amp > APLAUSO_MINIMO) {
    if (aplausoActivo == false) {
      for (let i = 0; i < 3; i++) {
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

    if (amp > AGRANDAR_MINIMO) {
      let escala = map(amp, AGRANDAR_MINIMO, 0.3, 0.9, 1.5, true);
      barco.escala = escala;
    } else if (amp < ACHICAR_MINIMO) {
      let escala = map(amp, 0, ACHICAR_MINIMO, 0.5, 0.9, true);
      barco.escala = escala;
    } else {
      barco.escala = 0.1;
    }

    if (tiempoSinSonido > 10000) {
      let extra = tiempoSinSonido - 10000;
      barco.opacidad = map(extra, 0, 10000, 255, 0, true);
    } else {
      barco.opacidad = 255;
    }

    barco.dibujar();
  }
// Hojas:
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

  if (tiempoSinSonido > 10000) {
    let extra = tiempoSinSonido - 10000;
    hoja.opacidad = map(extra, 0, 10000, 255, 0, true);
  } else {
    hoja.opacidad = 255;
  }

  hoja.dibujar();
}
  // Gotas
  if (tiempoSinSonido > 10000) {
    let extra = tiempoSinSonido - 10000;
    let opacidadGotas = map(extra, 0, 10000, 255, 0, true);

    for (let i = 0; i < gotas.length; i++) {
      let gota = gotas[i];
      gota.opacidad = opacidadGotas;
      gota.dibujar();
    }

    if (opacidadGotas <= 0) {
      gotas = [];
    }
  } else {
    for (let i = 0; i < gotas.length; i++) {
      let gota = gotas[i];
      gota.opacidad = 255;
      gota.dibujar();
    }
  }
}


//length "cantidad" o "número total de elementos" en un arreglo.
//APLAUSO_MINIMO es el nivel mínimo de sonido (amplitud) que tiene que detectar el micrófono para que el programa considere que hay un aplauso activo y así pueda generar las gotas, o activar alguna acción relacionada al aplauso.
//fondoActual en realidad es un objeto que controla varios fondos.
//Repeticion de 1000 milisegundos, crear const TIEMPO_SIN_SONIDO = 10000; y reemplazar todo.