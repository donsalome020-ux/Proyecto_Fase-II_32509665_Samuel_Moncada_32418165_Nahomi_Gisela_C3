// --- 1. DATOS ---
const USUARIOS = [
    { usuario: 'ClienteUCV', clave: 'Central_123', rol: 'cliente', nombre: 'Estudiante UCV' },
    { usuario: 'caja_01', clave: 'Cajero#123', rol: 'cajero', nombre: 'Caja Principal' },
    { usuario: 'adminRoot', clave: 'cafetinAdmin', rol: 'admin', nombre: 'Administrador' }
];

let productos = [
    { id: 1, nombre: 'Empanada de Queso', precio: 1.50, img: 'Imagenes/EmpanasDeQueso.png' },
    { id: 2, nombre: 'Empanada de Carne', precio: 1.80, img: 'Imagenes/EmpanadaDeCarne.jpeg' },
    { id: 3, nombre: 'Café Negro', precio: 0.80, img: 'Imagenes/Cafe.png' },
    { id: 4, nombre: 'Jugo Natural', precio: 2.00, img: 'Imagenes/Jugo.png' },
    { id: 5, nombre: 'Sandwich de Jamón', precio: 3.50, img: 'Imagenes/Sandwich.png' }
];

// Estado global
let usuarioActual = null;
let carrito = [];
let historialCompras = [];
let ordenCaja = [];
let puntosLealtad = 150;
let resenas = [
    { id: 101, usuario: 'Estudiante UCV', texto: '¡Excelentes empanadas!', fecha: '12/3/2026' }
];

// --- FUNCIÓN UTILITARIA PARA AGRUPAR ---
function agruparProductos(arreglo) {
    const agrupados = {};
    arreglo.forEach(item => {
        if (!agrupados[item.id]) {
            agrupados[item.id] = { ...item, cantidad: 1 };
        } else {
            agrupados[item.id].cantidad++;
        }
    });
    return Object.values(agrupados);
}

// --- 2. SESIÓN ---
const formularioLogin = document.getElementById('formulario-login');
const errorLogin = document.getElementById('error-login');

formularioLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const entradaUsuario = document.getElementById('nombre-usuario').value;
    const entradaClave = document.getElementById('clave-acceso').value;
    const usuarioEncontrado = USUARIOS.find(u => u.usuario === entradaUsuario && u.clave === entradaClave);

    if (usuarioEncontrado) {
        usuarioActual = usuarioEncontrado;
        iniciarSesion();
    } else {
        errorLogin.classList.remove('oculto');
    }
});

function iniciarSesion() {
    document.getElementById('seccion-login').classList.add('oculto');
    document.getElementById('info-usuario').classList.remove('oculto');
    document.getElementById('mensaje-bienvenida').innerText = `Hola, ${usuarioActual.nombre}`;

    ocultarTodasLasSecciones();

    if (usuarioActual.rol === 'cliente') {
        document.getElementById('seccion-cliente').classList.remove('oculto');
        renderizarCatalogo();
        renderizarHistorial();
        actualizarInterfazPuntos();
        renderizarResenasCliente(); // NUEVO
    } else if (usuarioActual.rol === 'cajero') {
        document.getElementById('seccion-caja').classList.remove('oculto');
        renderizarCaja();
    } else if (usuarioActual.rol === 'admin') {
        document.getElementById('seccion-admin').classList.remove('oculto');
        renderizarAdmin();
        renderizarResenasAdmin(); // NUEVO
    }
}

function cerrarSesion() {
    usuarioActual = null;
    carrito = [];
    ordenCaja = [];
    ocultarTodasLasSecciones();
    document.getElementById('nombre-usuario').value = '';
    document.getElementById('clave-acceso').value = '';
    document.getElementById('info-usuario').classList.add('oculto');
    document.getElementById('seccion-login').classList.remove('oculto');
}

function ocultarTodasLasSecciones() {
    document.getElementById('seccion-cliente').classList.add('oculto');
    document.getElementById('seccion-caja').classList.add('oculto');
    document.getElementById('seccion-admin').classList.add('oculto');
}

// --- 3. CLIENTE ---
function manejarErrorImagen(imagen) {
    imagen.onerror = "";
    imagen.src = "https://via.placeholder.com/150?text=Sin+Imagen";
    return true;
}

function renderizarCatalogo() {
    const cuadricula = document.getElementById('cuadricula-catalogo');
    cuadricula.innerHTML = '';
    productos.forEach(prod => {
        cuadricula.innerHTML += `
            <div class="tarjeta-producto">
                <img src="${prod.img}" alt="${prod.nombre}" class="img-producto" onerror="manejarErrorImagen(this)">
                <h4>${prod.nombre}</h4>
                <span class="etiqueta-precio">$${prod.precio.toFixed(2)}</span>
                <button class="btn-primario" onclick="agregarAlCarrito(${prod.id})">Añadir</button>
            </div>
        `;
    });
}

function agregarAlCarrito(id) {
    const prod = productos.find(p => p.id === id);
    carrito.push(prod);
    actualizarInterfazCarrito();
    mostrarNotificacion(`¡${prod.nombre} agregado!`);
}

function quitarDelCarrito(id) {
    const indice = carrito.findIndex(item => item.id === id);
    if (indice !== -1) {
        carrito.splice(indice, 1);
        actualizarInterfazCarrito();
    }
}

function actualizarInterfazCarrito() {
    document.getElementById('contador-carrito').innerText = carrito.length;
    const lista = document.getElementById('lista-items-carrito');
    lista.innerHTML = '';
    let total = 0;

    const carritoAgrupado = agruparProductos(carrito);

    carritoAgrupado.forEach(item => {
        const totalItem = item.precio * item.cantidad;
        total += totalItem;
        lista.innerHTML += `
            <li class="item-lista">
                <span>${item.nombre} <strong>x${item.cantidad}</strong></span>
                <div>
                    <span>$${totalItem.toFixed(2)}</span>
                    <button class="btn-eliminar" onclick="quitarDelCarrito(${item.id})">x</button>
                </div>
            </li>
        `;
    });
    document.getElementById('total-carrito').innerText = `$${total.toFixed(2)}`;
}

function alternarCarrito() {
    document.getElementById('modal-carrito').classList.toggle('oculto');
}

function procesarPagoCliente() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const montoTotal = carrito.reduce((suma, item) => suma + item.precio, 0);
    const puntosGanados = Math.floor(montoTotal * 10);
    puntosLealtad += puntosGanados;

    const carritoAgrupado = agruparProductos(carrito);
    const textoArticulos = carritoAgrupado.map(i => `${i.nombre} (x${i.cantidad})`).join(', ');

    const compra = {
        fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        articulos: textoArticulos,
        total: montoTotal
    };

    historialCompras.push(compra);

    alert(`Compra exitosa ($${montoTotal.toFixed(2)}).\n¡Ganaste ${puntosGanados} puntos nuevos!`);

    carrito = [];
    actualizarInterfazCarrito();
    actualizarInterfazPuntos();
    alternarCarrito();
    renderizarHistorial();
}

function actualizarInterfazPuntos() {
    const spanPuntos = document.getElementById('mostrar-puntos');
    if (spanPuntos) {
        spanPuntos.innerText = puntosLealtad;
    }
}

function renderizarHistorial() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-historial');
    if (!cuerpoTabla) return;
    cuerpoTabla.innerHTML = '';

    if (historialCompras.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="3" style="text-align:center">Sin compras recientes</td></tr>';
        return;
    }

    historialCompras.slice().reverse().forEach(c => {
        cuerpoTabla.innerHTML += `
            <tr>
                <td>${c.fecha}</td>
                <td>${c.articulos}</td>
                <td>$${c.total.toFixed(2)}</td>
            </tr>
        `;
    });
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');
    notificacion.innerText = mensaje;
    notificacion.classList.remove('oculto');
    setTimeout(() => {
        notificacion.classList.add('oculto');
    }, 3000);
}

// --- 4. CAJA ---
function renderizarCaja() {
    const cuadricula = document.getElementById('cuadricula-caja');
    cuadricula.innerHTML = '';
    productos.forEach(prod => {
        cuadricula.innerHTML += `
            <div class="item-caja" onclick="agregarACaja(${prod.id})">
                <strong>${prod.nombre}</strong><br>
                $${prod.precio.toFixed(2)}
            </div>
        `;
    });
}

function agregarACaja(id) {
    const prod = productos.find(p => p.id === id);
    ordenCaja.push(prod);
    actualizarInterfazCaja();
}

function quitarDeCaja(id) {
    const indice = ordenCaja.findIndex(item => item.id === id);
    if (indice !== -1) {
        ordenCaja.splice(indice, 1);
        actualizarInterfazCaja();
    }
}

function actualizarInterfazCaja() {
    const lista = document.getElementById('lista-caja');
    lista.innerHTML = '';
    let total = 0;

    const cajaAgrupada = agruparProductos(ordenCaja);

    cajaAgrupada.forEach(item => {
        const totalItem = item.precio * item.cantidad;
        total += totalItem;
        lista.innerHTML += `
            <li class="item-lista">
                <span>${item.nombre} <strong>x${item.cantidad}</strong></span>
                <div>
                    <span>$${totalItem.toFixed(2)}</span>
                    <button class="btn-eliminar" onclick="quitarDeCaja(${item.id})">x</button>
                </div>
            </li>
        `;
    });
    document.getElementById('monto-total-caja').innerText = `$${total.toFixed(2)}`;
}

function limpiarCaja() {
    ordenCaja = [];
    actualizarInterfazCaja();
}

function imprimirRecibo() {
    if (ordenCaja.length === 0) return alert("Nada para cobrar");
    alert("Recibo Emitido ,¡Gracias por su compra!");
    limpiarCaja();
}

// --- 5. ADMIN ---
function renderizarAdmin() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-admin');
    cuerpoTabla.innerHTML = '';
    productos.forEach((prod, indice) => {
        cuerpoTabla.innerHTML += `
            <tr>
                <td>${prod.nombre}</td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td><button class="btn-peligro" onclick="eliminarProducto(${indice})">Eliminar</button></td>
            </tr>
        `;
    });
}

document.getElementById('formulario-admin').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nuevo-nombre').value;
    const precio = parseFloat(document.getElementById('nuevo-precio').value);

    const entradaImg = document.getElementById('nueva-img').value;
    const img = entradaImg ? entradaImg : 'https://via.placeholder.com/150?text=Sin+Imagen';

    productos.push({ id: Date.now(), nombre, precio, img });
    alert("Producto guardado");
    renderizarAdmin();
    e.target.reset();
});

function eliminarProducto(indice) {
    if(confirm("¿Borrar producto?")) {
        productos.splice(indice, 1);
        renderizarAdmin();
    }
}
// --- 6. SISTEMA DE RESEÑAS ---

// Evento para agregar una reseña desde el cliente
document.getElementById('formulario-resena')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = document.getElementById('texto-resena').value;

    const nuevaResena = {
        id: Date.now(),
        usuario: usuarioActual.nombre,
        texto: texto,
        fecha: new Date().toLocaleDateString()
    };

    resenas.push(nuevaResena);
    document.getElementById('formulario-resena').reset();
    renderizarResenasCliente();
    mostrarNotificacion("¡Reseña publicada con éxito!");
});

// Renderizar historial de reseñas para el cliente
function renderizarResenasCliente() {
    const contenedor = document.getElementById('lista-resenas-cliente');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    // Filtramos para mostrar solo las reseñas del usuario actual
    const misResenas = resenas.filter(r => r.usuario === usuarioActual.nombre);

    if (misResenas.length === 0) {
        contenedor.innerHTML = '<p style="color: #666; margin-top: 10px;">Aún no has escrito ninguna reseña.</p>';
        return;
    }

    // Mostramos las reseñas invertidas (la más reciente primero)
    misResenas.slice().reverse().forEach(r => {
        contenedor.innerHTML += `
            <div class="tarjeta-resena">
                <p><strong>Tú</strong> <span class="fecha-resena">- ${r.fecha}</span></p>
                <p>"${r.texto}"</p>
            </div>
        `;
    });
}

// Renderizar todas las reseñas para el administrador
function renderizarResenasAdmin() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-resenas');
    if (!cuerpoTabla) return;
    cuerpoTabla.innerHTML = '';

    if (resenas.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="4" style="text-align:center">No hay reseñas registradas</td></tr>';
        return;
    }

    resenas.forEach(r => {
        cuerpoTabla.innerHTML += `
            <tr>
                <td>${r.usuario}</td>
                <td>"${r.texto}"</td>
                <td>${r.fecha}</td>
                <td><button class="btn-peligro" onclick="eliminarResena(${r.id})">Eliminar</button></td>
            </tr>
        `;
    });
}

// Función del admin para eliminar reseñas
function eliminarResena(id) {
    if(confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
        // Filtramos para quitar la reseña con el id proporcionado
        resenas = resenas.filter(r => r.id !== id);
        renderizarResenasAdmin(); // Actualizamos la tabla del admin
    }
}