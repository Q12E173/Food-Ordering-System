document.addEventListener('DOMContentLoaded', function () {
    const backToMenuButton = document.querySelector('.back-to-menu');
    const confirmOrderButton = document.querySelector('.confirm-order');
    const totalPriceCartElement = document.getElementById('total-price-cart');

    function displayCart() {
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ''; 
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="item-quantity-price">
                    <p>RM ${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        totalPriceCartElement.textContent = `Total Price: RM${total.toFixed(2)}`;
    }

    displayCart();

    backToMenuButton.addEventListener('click', function () {
        sessionStorage.setItem('fromCart', 'true');
        window.location.href = 'user_menu.html'; 
    });

    confirmOrderButton.addEventListener('click', function () {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to your cart before confirming the order.');
            return;
        }
        if (confirm('Are you sure you want to confirm this order?')) {
            saveOrder();
        }
    });

    function saveOrder() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

        fetch('user_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                total: total,
                items: cart
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem('cart');
                window.location.href = 'order_paper.html';
            } else {
                alert(data.message || 'Please login to order. Please try again.');
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('increase-quantity')) {
            const itemId = event.target.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            }
        } else if (event.target.classList.contains('decrease-quantity')) {
            const itemId = event.target.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = cart.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity === 0) {
                    cart.splice(itemIndex, 1);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            }
        }
    });
});
