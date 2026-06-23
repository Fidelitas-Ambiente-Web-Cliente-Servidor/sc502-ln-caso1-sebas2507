const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',   precio: 4500,  categoria: 'Entrada'       },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'       },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',      precio: 15500, categoria: 'Plato Fuerte'  },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte'  },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte'  },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',         precio: 5200,  categoria: 'Postre'        },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'        },
];

const reservas = [];
let categoriaActual = 'Todos';

const formatoColones = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

function obtenerCamposFormulario() {
  return {
    nombre: document.getElementById('nombre'),
    correo: document.getElementById('correo'),
    fecha: document.getElementById('fecha'),
    hora: document.getElementById('hora'),
    personas: document.getElementById('personas'),
    comentarios: document.getElementById('comentarios'),
  };
}

function mostrarError(campo, mensaje) {
  const contenedorError = document.getElementById(`error-${campo}`);
  contenedorError.textContent = mensaje;
}

function limpiarMensajes() {
  document.getElementById('mensaje-reserva').textContent = '';
}

function limpiarErrores() {
  mostrarError('nombre', '');
  mostrarError('correo', '');
  mostrarError('fecha', '');
  mostrarError('personas', '');
}

function obtenerFechaActualISO() {
  const hoy = new Date();
  const zonaLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return zonaLocal.toISOString().split('T')[0];
}

function crearCelda(texto) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  return celda;
}

function actualizarBotonesFiltro(categoria) {
  document.querySelectorAll('.btn-filtro').forEach((boton) => {
    boton.classList.toggle('activo', boton.dataset.categoria === categoria);
  });
}

function renderMenu() {
  const contenedorMenu = document.getElementById('contenedor-menu');
  contenedorMenu.innerHTML = '';

  const platillosFiltrados = categoriaActual === 'Todos'
    ? menu
    : menu.filter((plato) => plato.categoria === categoriaActual);

  // Recorre los datos del array obligatorio y construye cada card desde JavaScript.
  platillosFiltrados.forEach((plato) => {
    const columna = document.createElement('div');
    columna.className = 'col-md-6 col-xl-4';

    const card = document.createElement('article');
    card.className = 'card-plato';

    const categoria = document.createElement('span');
    categoria.className = 'categoria-plato';
    categoria.textContent = plato.categoria;

    const nombre = document.createElement('h3');
    nombre.textContent = plato.nombre;

    const descripcion = document.createElement('p');
    descripcion.textContent = plato.descripcion;

    const precio = document.createElement('div');
    precio.className = 'precio-plato';
    precio.textContent = formatoColones.format(plato.precio);

    card.append(categoria, nombre, descripcion, precio);
    columna.appendChild(card);
    contenedorMenu.appendChild(columna);
  });
}

function filtrarCategoria(categoria) {
  // Guarda la categoría seleccionada, actualiza el botón activo y vuelve a pintar el menú.
  categoriaActual = categoria;
  actualizarBotonesFiltro(categoria);
  renderMenu();
}

function validarFormulario() {
  return validarFormularioInterno(true);
}

function validarFormularioInterno(mostrarMensajes) {
  const campos = obtenerCamposFormulario();
  const nombre = campos.nombre.value.trim();
  const correo = campos.correo.value.trim();
  const fecha = campos.fecha.value;
  const personas = Number(campos.personas.value);
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let formularioValido = true;

  // Valida nombre: obligatorio, mínimo de caracteres y únicamente letras/espacios.
  if (nombre.length < 5) {
    if (mostrarMensajes) {
      mostrarError('nombre', 'El nombre debe tener al menos 5 caracteres.');
    }
    formularioValido = false;
  } else if (!regexNombre.test(nombre)) {
    if (mostrarMensajes) {
      mostrarError('nombre', 'El nombre solo puede contener letras y espacios.');
    }
    formularioValido = false;
  } else {
    mostrarError('nombre', '');
  }

  // Valida correo con una expresión regular sencilla y suficiente para el formulario.
  if (!regexCorreo.test(correo)) {
    if (mostrarMensajes) {
      mostrarError('correo', 'Ingrese un correo electrónico válido.');
    }
    formularioValido = false;
  } else {
    mostrarError('correo', '');
  }

  // Valida que exista fecha y que no sea anterior al día actual.
  if (!fecha) {
    if (mostrarMensajes) {
      mostrarError('fecha', 'Seleccione una fecha de reserva.');
    }
    formularioValido = false;
  } else if (fecha < obtenerFechaActualISO()) {
    if (mostrarMensajes) {
      mostrarError('fecha', 'La fecha no puede estar en el pasado.');
    }
    formularioValido = false;
  } else {
    mostrarError('fecha', '');
  }

  // Valida el rango permitido de personas indicado en el enunciado.
  if (!campos.personas.value || !Number.isInteger(personas) || personas < 1 || personas > 20) {
    if (mostrarMensajes) {
      mostrarError('personas', 'El número de personas debe estar entre 1 y 20.');
    }
    formularioValido = false;
  } else {
    mostrarError('personas', '');
  }

  document.getElementById('btn-enviar').disabled = !formularioValido;
  return formularioValido;
}

function agregarReserva() {
  if (!validarFormulario()) {
    return;
  }

  const campos = obtenerCamposFormulario();
  const nuevaReserva = {
    nombre: campos.nombre.value.trim(),
    correo: campos.correo.value.trim(),
    fecha: campos.fecha.value,
    hora: campos.hora.value,
    personas: Number(campos.personas.value),
    comentarios: campos.comentarios.value.trim(),
  };

  reservas.push(nuevaReserva);

  // Crea una fila nueva para la tabla y resalta visualmente grupos de 6 o más personas.
  const fila = document.createElement('tr');
  fila.className = 'fila-reserva';

  if (nuevaReserva.personas >= 6) {
    fila.classList.add('grupo-grande');
  }

  fila.append(
    crearCelda(nuevaReserva.nombre),
    crearCelda(nuevaReserva.correo),
    crearCelda(nuevaReserva.fecha),
    crearCelda(nuevaReserva.hora),
    crearCelda(nuevaReserva.personas)
  );

  document.getElementById('tabla-reservas').appendChild(fila);
  document.getElementById('mensaje-reserva').textContent = 'Reserva registrada correctamente.';

  campos.nombre.value = '';
  campos.correo.value = '';
  campos.fecha.value = '';
  campos.hora.value = '12:00';
  campos.personas.value = '';
  campos.comentarios.value = '';

  actualizarResumen();
  limpiarErrores();
  document.getElementById('btn-enviar').disabled = true;
}

function actualizarResumen() {
  const resumen = document.getElementById('resumen-reservas');
  const totalReservas = reservas.length;
  const totalPersonas = reservas.reduce((total, reserva) => total + reserva.personas, 0);
  const mayorReserva = reservas.reduce((mayor, reserva) => {
    if (!mayor || reserva.personas > mayor.personas) {
      return reserva;
    }

    return mayor;
  }, null);

  // Recalcula el resumen completo desde el array de reservas para mantenerlo sincronizado.
  resumen.innerHTML = `
    <p>Total de reservas registradas: <strong>${totalReservas}</strong></p>
    <p>Total de personas esperadas: <strong>${totalPersonas}</strong></p>
    <p>Reserva con mayor número de personas: <strong>${mayorReserva ? `${mayorReserva.nombre} (${mayorReserva.personas})` : 'Sin reservas'}</strong></p>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const campos = obtenerCamposFormulario();

  document.getElementById('fecha').min = obtenerFechaActualISO();
  renderMenu();
  actualizarResumen();
  validarFormularioInterno(false);

  document.querySelectorAll('.btn-filtro').forEach((boton) => {
    boton.addEventListener('click', function () {
      filtrarCategoria(this.dataset.categoria);
    });
  });

  ['input', 'change'].forEach((evento) => {
    campos.nombre.addEventListener(evento, limpiarMensajes);
    campos.correo.addEventListener(evento, limpiarMensajes);
    campos.fecha.addEventListener(evento, limpiarMensajes);
    campos.personas.addEventListener(evento, limpiarMensajes);

    campos.nombre.addEventListener(evento, validarFormulario);
    campos.correo.addEventListener(evento, validarFormulario);
    campos.fecha.addEventListener(evento, validarFormulario);
    campos.personas.addEventListener(evento, validarFormulario);
  });

  document.getElementById('form-reserva').addEventListener('submit', function (e) {
    e.preventDefault();
    agregarReserva();
  });
});
