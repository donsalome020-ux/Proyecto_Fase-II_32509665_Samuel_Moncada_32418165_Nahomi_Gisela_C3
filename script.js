
// --- 1. DATOS ---
const USERS = [
    { user: 'ClienteUCV', pass: 'Central_123', role: 'client', name: 'Estudiante UCV' },
    { user: 'caja_01', pass: 'Cajero#123', role: 'cashier', name: 'Caja Principal' },
    { user: 'adminRoot', pass: 'cafetinAdmin', role: 'admin', name: 'Administrador' }
];

let products = [
    { id: 1, name: 'Empanada de Queso', price: 1.50, img: 'imagenes/EmpanasDeQueso.png' },
    { id: 2, name: 'Empanada de Carne', price: 1.80, img: 'imagenes/EmpanadaDeCarne.jpeg' },
    { id: 3, name: 'Café Negro', price: 0.80, img: 'imagenes/Cafe.png' },
    { id: 4, name: 'Jugo Natural', price: 2.00, img: 'imagenes/Jugo.png' },
    { id: 5, name: 'Sandwich de Jamón', price: 3.50, img: 'imagenes/Sandwich.png' }
];

// Estado global
let currentUser = null;
let cart = [];
let purchaseHistory = [];
let posOrder = [];
let loyaltyPoints = 150;

// --- FUNCIÓN UTILITARIA PARA AGRUPAR ---
function agruparProductos(arreglo) {
    const agrupados = {};
    arreglo.forEach(item => {
        if (!agrupados[item.id]) {
            agrupados[item.id] = { ...item, quantity: 1 };
        } else {
            agrupados[item.id].quantity++;
        }
    });
    return Object.values(agrupados);
}

// --- 2. SESIÓN ---
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;
    const foundUser = USERS.find(u => u.user === userIn && u.pass === passIn);

    if (foundUser) {
        currentUser = foundUser;
        initSession();
    } else {
        loginError.classList.remove('hidden');
    }
});

function initSession() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Hola, ${currentUser.name}`;

    hideAllSections();

    if (currentUser.role === 'client') {
        document.getElementById('client-section').classList.remove('hidden');
        renderCatalog();
        renderHistory();
        updatePointsUI();
    } else if (currentUser.role === 'cashier') {
        document.getElementById('cashier-section').classList.remove('hidden');
        renderPos();
    } else if (currentUser.role === 'admin') {
        document.getElementById('admin-section').classList.remove('hidden');
        renderAdmin();
    }
}

function logout() {
    currentUser = null;
    cart = [];
    posOrder = [];
    hideAllSections();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

function hideAllSections() {
    document.getElementById('client-section').classList.add('hidden');
    document.getElementById('cashier-section').classList.add('hidden');
    document.getElementById('admin-section').classList.add('hidden');
}

// --- 3. CLIENTE ---
function imgError(image) {
    image.onerror = "";
    image.src = "https://via.placeholder.com/150?text=Sin+Imagen";
    return true;
}

function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = '';
    products.forEach(prod => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${prod.img}" alt="${prod.name}" class="product-img" onerror="imgError(this)">
                <h4>${prod.name}</h4>
                <span class="price-tag">$${prod.price.toFixed(2)}</span>
                <button class="btn-primary" onclick="addToCart(${prod.id})">Añadir</button>
            </div>
        `;
    });
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    updateCartUI();
    showToast(`¡${prod.name} agregado!`);
}

function removeFromCart(id) {
    // Encuentra el primer índice del producto con ese id y lo elimina
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartUI();
    }
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let total = 0;

    const cartAgrupado = agruparProductos(cart);

    cartAgrupado.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        list.innerHTML += `
            <li class="list-item">
                <span>${item.name} <strong>x${item.quantity}</strong></span>
                <div>
                    <span>$${itemTotal.toFixed(2)}</span>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">x</button>
                </div>
            </li>
        `;
    });
    document.getElementById('cart-total').innerText = `$${total.toFixed(2)}`;
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('hidden');
}

function checkoutClient() {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    const pointsEarned = Math.floor(totalAmount * 10);
    loyaltyPoints += pointsEarned;

    const cartAgrupado = agruparProductos(cart);
    const itemsString = cartAgrupado.map(i => `${i.name} (x${i.quantity})`).join(', ');

    const purchase = {
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        items: itemsString,
        total: totalAmount
    };

    purchaseHistory.push(purchase);

    alert(`Compra exitosa ($${totalAmount.toFixed(2)}).\n¡Ganaste ${pointsEarned} puntos nuevos!`);

    cart = [];
    updateCartUI();
    updatePointsUI();
    toggleCart();
    renderHistory();
}

function updatePointsUI() {
    const pointsSpan = document.getElementById('points-display');
    if (pointsSpan) {
        pointsSpan.innerText = loyaltyPoints;
    }
}

function renderHistory() {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (purchaseHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">Sin compras recientes</td></tr>';
        return;
    }

    purchaseHistory.slice().reverse().forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.date}</td>
                <td>${p.items}</td>
                <td>$${p.total.toFixed(2)}</td>
            </tr>
        `;
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// --- 4. CAJA ---
function renderPos() {
    const grid = document.getElementById('pos-grid');
    grid.innerHTML = '';
    products.forEach(prod => {
        grid.innerHTML += `
            <div class="pos-item" onclick="addToPos(${prod.id})">
                <strong>${prod.name}</strong><br>
                $${prod.price.toFixed(2)}
            </div>
        `;
    });
}

function addToPos(id) {
    const prod = products.find(p => p.id === id);
    posOrder.push(prod);
    updatePosUI();
}

function removeFromPos(id) {
    const index = posOrder.findIndex(item => item.id === id);
    if (index !== -1) {
        posOrder.splice(index, 1);
        updatePosUI();
    }
}

function updatePosUI() {
    const list = document.getElementById('pos-list');
    list.innerHTML = '';
    let total = 0;

    const posAgrupado = agruparProductos(posOrder);

    posAgrupado.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        list.innerHTML += `
            <li class="list-item">
                <span>${item.name} <strong>x${item.quantity}</strong></span>
                <div>
                    <span>$${itemTotal.toFixed(2)}</span>
                    <button class="btn-remove" onclick="removeFromPos(${item.id})">x</button>
                </div>
            </li>
        `;
    });
    document.getElementById('pos-total-amount').innerText = `$${total.toFixed(2)}`;
}

function clearPos() {
    posOrder = [];
    updatePosUI();
}

function printReceipt() {
    if (posOrder.length === 0) return alert("Nada para cobrar");
    alert("Recibo Emitido ,¡Gracias por su compra!");
    clearPos();
}

// --- 5. ADMIN ---
function renderAdmin() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';
    products.forEach((prod, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${prod.name}</td>
                <td>$${prod.price.toFixed(2)}</td>
                <td><button class="btn-danger" onclick="deleteProduct(${index})">Eliminar</button></td>
            </tr>
        `;
    });
}

document.getElementById('admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-name').value;
    const price = parseFloat(document.getElementById('new-price').value);

    const imgInput = document.getElementById('new-img').value;
    const img = imgInput ? imgInput : 'https://via.placeholder.com/150?text=Sin+Imagen';

    products.push({ id: Date.now(), name, price, img });
    alert("Producto guardado");
    renderAdmin();
    e.target.reset();
});

function deleteProduct(index) {
    if(confirm("¿Borrar producto?")) {
        products.splice(index, 1);
        renderAdmin();
    }
}