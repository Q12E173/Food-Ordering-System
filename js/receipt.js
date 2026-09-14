document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded for receipts');
    fetchReceipts();

    document.querySelector('#receiptTable').addEventListener('click', function(event) {
        if (event.target.classList.contains('print')) {
            const orderId = event.target.dataset.id;
            console.log(`Print clicked for order ${orderId}`);
            showReceiptModal(orderId);
        }
    });

    document.querySelector('.close').addEventListener('click', function() {
        document.querySelector('#receiptModal').style.display = 'none';
    });

    document.querySelector('#receiptModal .print-modal').addEventListener('click', function() {
        captureReceiptAsImage();
    });
});

function fetchReceipts() {
    fetch('receipt.php')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched receipts:', data);
            const tableBody = document.querySelector('#receiptTable tbody');
            tableBody.innerHTML = '';
            
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); 
            const yyyy = today.getFullYear();

            const todayStr = yyyy + '-' + mm + '-' + dd; // Get today's date in 'YYYY-MM-DD' format
            console.log(`Today's Date: ${todayStr}`);

            let printedOrders = [];

            data.forEach(order => {
                const orderDate = order.order_date.slice(0, 10); // Extract the date part from the order date
                console.log(`Order Date: ${orderDate}, Comparison: ${orderDate === todayStr}`);

                if (orderDate === todayStr) { // Check if the order date matches today's date
                    const row = document.createElement('tr');
                    row.dataset.orderId = order.order_id;
                    row.innerHTML = `
                        <td>${order.order_id}</td>
                        <td>${order.username}</td>
                        <td>${order.order_date}</td>
                        <td>${order.total}</td>
                        <td>
                            <button class="print" data-id="${order.order_id}">Print</button>
                        </td>
                    `;
                    if (order.status === 'Complete') {
                        printedOrders.push(row);
                    } else {
                        tableBody.appendChild(row);
                    }
                }
            });

            printedOrders.forEach(row => tableBody.appendChild(row));
        })
        .catch(error => console.error('Error fetching receipts:', error));
}








function showReceiptModal(orderId) {
    fetch(`receipt.php?order_id=${orderId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched receipt details:', data);
            document.getElementById('order-id').textContent = data.order_id;
            document.getElementById('order-date').textContent = data.order_date;
            document.getElementById('username').textContent = data.username;
            document.getElementById('total').textContent = `RM${data.total}`;
            
            const orderItems = document.getElementById('order-items');
            orderItems.innerHTML = '';
            data.items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.quantity}</td>
                    <td>${item.name}</td>
                    <td>RM${item.price}</td>
                `;
                orderItems.appendChild(row);
            });

            document.querySelector('#receiptModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching receipt details:', error));
}

function captureReceiptAsImage() {
    const receiptElement = document.querySelector('#receiptDetails .receipt');
    html2canvas(receiptElement, {
        backgroundColor: 'white'
    }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'receipt.png';
        link.click();
    }).catch(function(error) {
        console.error('Error capturing the receipt as an image:', error);
    });
}
