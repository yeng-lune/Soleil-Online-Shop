let cart = JSON.parse(localStorage.getItem("cart")) || [];
const TAX_RATE = 0.12; 
// Add item to cart
function addToCart(name, price, quantity) {
    quantity = parseInt(quantity); 
    const totalPrice = price * quantity; 
    const existingItemIndex = cart.findIndex(item => item.name === name);
    if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].totalPrice = cart[existingItemIndex].price * cart[existingItemIndex].quantity;
    } else {
                cart.push({ name, price, quantity, totalPrice });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showNotification(`${name} added to cart!`);
}


function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    notificationMessage.textContent = message;
    notification.classList.remove("hidden");

    
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 30000);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); 
}

function calculateTax(subtotal) {
    return subtotal * TAX_RATE;
}

function loadCart() {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const cartSummary = document.getElementById("cart-summary");
    let subtotal = 0;

    cartSummary.innerHTML = `<table>
        <tr>
        </tr>`;
    
    cartData.forEach(item => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartSummary.innerHTML += `<tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₱${itemTotal.toFixed(2)}</td>
            <td><button class="remove-button" onclick="removeFromCart('${item.name}')">Remove</button></td><br><br>
        </tr>`;
    });

    let tax = calculateTax(subtotal);
    
    cartSummary.innerHTML += `</table>
        <h4>total: ₱${subtotal.toFixed(2)}</h4>
        <h4>Tax (12%): ₱${tax.toFixed(2)}</h4>
        <h3>SubTotal: ₱${subtotal.toFixed(2)}</h3>`;
}
function proceedToCheckout() {
    document.getElementById("receipt").classList.remove("hidden");

    let receiptDetails = document.getElementById("receipt-details");
    let now = new Date();
    let formattedDate = now.toLocaleDateString();
    let formattedTime = now.toLocaleTimeString();

    let receiptContent = `
        <p>Date: ${formattedDate} <br> Time: ${formattedTime}</p><br>
        <p>Items:</p><br>
        <ul>`;
    
    let subtotal = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        receiptContent += `<li>${item.name} - Quantity: ${item.quantity} - Price: ${item.price} - total: ₱${itemTotal.toFixed(2)}</li>`; 
    });

    receiptContent += `</ul>
        <br><p><strong>Tax (12%): ₱${calculateTax(subtotal).toFixed(2)}</strong></p>
        <p><strong>SubTotal: ₱${subtotal.toFixed(2)}</strong></p><br>
        <p>Thank you for your purchase!</p>`;
    
    receiptDetails.innerHTML = receiptContent;
}
function closeReceipt() {
    document.getElementById("receipt").classList.add("hidden");
    localStorage.removeItem("cart"); 
    window.location.href = "index.html"; 
}

document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});

const products = [
    { id: "MLP000001", name: "Pearl MilkTea", price: 100, stock: 50 },
    { id: "MLP001002", name: "Panda MilkTea", price: 110, stock: 50 },
    { id: "MLP002003", name: "Grass Jelly MilkTea", price: 110, stock: 50 },
    { id: "MLP003004", name: "2 Ladies MilkTea", price: 120, stock: 50 },
    { id: "MLP001005", name: "3 Buddies MilkTea", price: 120, stock: 50 },
    { id: "MLP002006", name: "Taro MilkTea", price: 100, stock: 50 },
    { id: "MLP003007", name: "Chocolate Pearl", price: 110, stock: 50 },
    { id: "MLP001008", name: "Taro Slush", price: 100, stock: 50 },
    { id: "MLP002009", name: "Taro Latte", price: 120, stock: 50 },
    { id: "MLP003010", name: "Chocolate Pudding", price: 110, stock: 50 },
    { id: "MLP0010011", name: "White Pearl MilkTea", price: 100, stock: 50 },
    { id: "MLP0020012", name: "Passion Fruit Tea", price: 115, stock: 50 },
];

let currentProduct = null;

const productList = document.getElementById("productList");

document.getElementById("searchInput").addEventListener("input", function() {
    const query = this.value.toUpperCase();
    productList.innerHTML = "";

    if (query.length > 0) { 
        products
            .filter(product => product.id.includes(query) || product.name.toUpperCase().includes(query))
            .forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `<strong>${product.id}</strong><br>${product.name}`;
                productCard.onclick = () => showProductDetail(product);
                productList.appendChild(productCard);
            });
    }
});

// Show product details
function showProductDetail(product) {
    currentProduct = product;
    document.getElementById("productID").textContent = product.id;
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productPrice").textContent = product.price;
    document.getElementById("productStock").textContent = product.stock;
    document.getElementById("productDetail").style.display = "block";
}

// Update stock
function updateStock() {
    const stockChange = parseInt(document.getElementById("stockChange").value);
    if (!isNaN(stockChange)) {
        currentProduct.stock += stockChange;
        document.getElementById("productStock").textContent = currentProduct.stock;
        document.getElementById("stockChange").value = "";
        alert("Stock updated successfully!");
    } else {
        alert("Please enter a valid number.");
    }
}

const searchInput = document.getElementById("searchInput");
const clearSearchButton = document.getElementById("clearSearch");
const productDetail = document.getElementById("productDetail");

searchInput.addEventListener("input", function() {
    const query = this.value.toUpperCase();
    productList.innerHTML = ""; 

    if (query.length > 0) {
      
        clearSearchButton.style.display = "block";

        products
            .filter(product => product.id.includes(query) || product.name.toUpperCase().includes(query))
            .forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `<strong>${product.id}</strong><br>${product.name}`;
                productCard.onclick = () => showProductDetail(product);
                productList.appendChild(productCard);
            });

        localStorage.setItem("searchQuery", query);
    } else {
        clearSearchButton.style.display = "none"; 
    }
});

clearSearchButton.addEventListener("click", function() {
    searchInput.value = ""; 
    productList.innerHTML = ""; 
    clearSearchButton.style.display = "none"; 
    productDetail.style.display = "none"; 

    localStorage.removeItem("searchQuery");
});

function showProductDetail(product) {
    currentProduct = product;
    document.getElementById("productID").textContent = product.id;
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productPrice").textContent = product.price;
    document.getElementById("productStock").textContent = product.stock;
    productDetail.style.display = "block";
}

function toggleCart() {
    document.getElementById("sidebar-cart").classList.toggle("hidden");
}

function closeCart() {
    document.getElementById("sidebar-cart").classList.add("hidden");
}

function goToCheckout() {
    window.location.href = "cart.html";
}

// Update the cart content inside the sidebar
function updateSidebarCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    cartItemsContainer.innerHTML = ""; // Clear current items
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.totalPrice;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name} - ₱${item.price} x ${item.quantity}</p>
                <div>
                    <button onclick="changeQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
                <p>Subtotal: ₱${(item.totalPrice).toFixed(2)}</p>
                <button onclick="removeFromCart('${item.name}')">Remove</button>
            </div>`;
    });

    cartTotalElement.textContent = subtotal.toFixed(2); // Update total display
}
