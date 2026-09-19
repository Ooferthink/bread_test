// Load saved cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Sync cart counter badge on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountBadge();

    const searchQuery = new URLSearchParams(window.location.search).get('search');
    if (searchQuery) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = searchQuery;
        filterProducts(searchQuery);
    }
});

// Save cart to browser storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountBadge();
}

function updateCartCountBadge() {
    const countBadge = document.getElementById('cart-count');
    if (countBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Add item quantity
function addToCart(productName, price) {
    const existingIndex = cart.findIndex(item => item.name === productName);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    
    saveCart();
    
    // Notification
    showToast(productName + " added to cart!");
    
    updateCartUI();
}

// Increase or decrease item quantity from inside cart
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// Side navigation logic
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    let mainEl = document.getElementById("main") || document.querySelector("main");
    if (mainEl) mainEl.style.marginLeft = "0";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    let mainEl = document.getElementById("main") || document.querySelector("main");
    if (mainEl) mainEl.style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}

// Shopping Cart logic
function openCart() {
    document.getElementById("cartModal").style.display = "block";
    updateCartUI();
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");
    
    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = ""; 
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align: center; color: #666; padding: 20px 0;'>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            const itemSubtotal = item.price * item.quantity;
            total += itemSubtotal;
            
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <div>₱${item.price.toFixed(2)} x ${item.quantity} = <strong>₱${itemSubtotal.toFixed(2)}</strong></div>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                    </div>
                </div>
            `;
        });
    }
    cartTotalElement.innerText = "₱" + total.toFixed(2);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
    } else {
        showToast("Thank you for your purchase! Processing your order...");
        cart = []; 
        saveCart();
        updateCartUI();
        closeCart();
    }
}

// Live product search filter
function filterProducts(query) {
    const filter = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');
    let matchingProducts = 0;
    
    cards.forEach(card => {
        const titleElement = card.querySelector('.product-title');
        if (titleElement) {
            const titleText = titleElement.innerText.toLowerCase();
            if (titleText.includes(filter)) {
                card.style.display = "";
                matchingProducts += 1;
            } else {
                card.style.display = "none";
            }
        }
    });

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = matchingProducts === 0 ? "block" : "none";
}

// Displays notification
function showToast(message) {
    const toast = document.getElementById("toast-notification");
    if (!toast) return;
    
    toast.innerText = message;
    toast.classList.add("show");
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Search Modal logic
function submitSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    window.location.href = `menu.html?search=${encodeURIComponent(query)}`;
}

function openSearch() {
    document.getElementById("searchModal").style.display = "block";
}

function closeSearch() {
    document.getElementById("searchModal").style.display = "none";
}

// Product Details Modal logic
function openProductDetails(productName, price) {
    const productModal = document.getElementById("productModal");
    const productDetails = document.getElementById("productDetails");
    const productAddButton = document.getElementById("productAddButton");

    if (productModal && productDetails) {
        productDetails.innerHTML = `
            <h3>${productName}</h3>
            <p>Price: ₱${price.toFixed(2)}</p>
        `;
        if (productAddButton) {
            productAddButton.onclick = () => {
                addToCart(productName, price);
                closeProduct();
            };
        }
        productModal.style.display = "block";
    }
}

function closeProduct() {
    document.getElementById("productModal").style.display = "none";
}