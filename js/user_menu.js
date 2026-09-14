document.addEventListener('DOMContentLoaded', function() {
    const headerHeight = document.querySelector('header').offsetHeight;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!sessionStorage.getItem('fromCart')) {
        localStorage.removeItem('cart');
        cart = [];
    } else {
        sessionStorage.removeItem('fromCart');
    }

    document.querySelectorAll('.sidebar a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    });

    const sections = document.querySelectorAll('.content section');
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    window.addEventListener('scroll', function() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 10;
            if (window.pageYOffset >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const itemId = event.target.getAttribute('data-id');
            const itemName = event.target.parentNode.querySelector('h3').textContent;
            const itemPrice = parseFloat(event.target.parentNode.querySelector('.price').textContent.replace('RM ', ''));
            const itemQuantity = parseInt(event.target.parentNode.querySelector('.quantity').textContent);
            const itemDescription = event.target.parentNode.querySelector('.description').textContent;
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity += itemQuantity;
            } else {
                cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: itemQuantity, description: itemDescription });
            }
            updateCartSummary();
            localStorage.setItem('cart', JSON.stringify(cart)); 
        } else if (event.target.classList.contains('decrease-quantity')) {
            const quantityElement = event.target.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        } else if (event.target.classList.contains('increase-quantity')) {
            const quantityElement = event.target.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
        }
    });

    function updateCartSummary() {
        const cartSummary = document.getElementById('cart-summary');
        const totalPriceElement = document.getElementById('total-price');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
        cartSummary.textContent = `${totalItems} Item(s)`;
        totalPriceElement.textContent = `Total Price: RM${totalPrice}`;
        localStorage.setItem('cart', JSON.stringify(cart)); 
    }

    updateCartSummary(); 
});
