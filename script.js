/* PROYECTO CAFETÍN CENTRAL - FASE III
   Versión: Multiplicadores (x3) y Eliminar Productos
*/

// --- 1. DATOS ---
const USERS = [
    { user: 'ClienteUCV', pass: 'Central_123', role: 'client', name: 'Estudiante UCV' },
    { user: 'caja_01', pass: 'Cajero#123', role: 'cashier', name: 'Caja Principal' },
    { user: 'adminRoot', pass: 'cafetinAdmin', role: 'admin', name: 'Administrador' }
];

let products = [
    { id: 1, name: 'Empanada de Queso', price: 1.50, img: 'data:image/jpeg;base64,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' },
    { id: 2, name: 'Empanada de Carne', price: 1.80, img: 'data:image/jpeg;base64,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' },
    { id: 3, name: 'Café Negro', price: 0.80, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_YKcDAlVWFtIfyO7XVkeTUlOZLm1t7G43OQ&s' },
    { id: 4, name: 'Jugo Natural', price: 2.00, img: 'data:image/jpeg;base64,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' },
    { id: 5, name: 'Sandwich de Jamón', price: 3.50, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_FVkVSbJWbsxIbpEpNaDhoQpa1vObir3ww&s' }
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
    alert("¡Recibo impreso exitosamente!");
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