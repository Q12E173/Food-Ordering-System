document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded');
    fetchOrders();

    document.querySelector('#orderTable').addEventListener('change', function(event) {
        if (event.target.classList.contains('status-dropdown')) {
            const orderId = event.target.dataset.id;
            const newStatus = event.target.value;
            console.log(`Status changed for order ${orderId} to ${newStatus}`);
            updateOrderStatus(orderId, newStatus);
        }
    });

    document.querySelector('#orderTable').addEventListener('submit', function(event) {
        if (event.target.classList.contains('delete-form')) {
            event.preventDefault();
            confirmDeletion(event, event.target);
        }
    });
});

function fetchOrders() {
    fetch('orders.php')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched orders:', data); 
            const tableBody = document.querySelector('#orderTable tbody');
            tableBody.innerHTML = '';
            data.forEach(order => {
                if (order.status !== 'Complete') { // Only show orders that are not complete
                    const row = document.createElement('tr');
                    row.dataset.orderId = order.order_id;
                    row.innerHTML = `
                        <td>${order.order_id}</td>
                        <td>${order.username}</td>
                        <td>${order.order_date}</td>
                        <td>${order.total}</td>
                        <td>
                            <select class="status-dropdown" data-id="${order.order_id}">
                                <option value="In Progress" ${order.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Complete" ${order.status === 'Complete' ? 'selected' : ''}>Complete</option>
                            </select>
                        </td>
                        <td>
                            <form method="POST" action="orders.php" class="delete-form">
                                <input type="hidden" name="delete_order_id" value="${order.order_id}">
                                <button type="submit" class="delete" data-id="${order.order_id}">Delete</button>
                            </form>
                        </td>
                    `;
                    tableBody.appendChild(row);
                }
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function updateOrderStatus(orderId, status) {
    console.log(`Updating order ${orderId} to status ${status}`); 
    fetch('orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `order_id=${orderId}&status=${status}`
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data); 
        if (data.status === 'success') {
            alert('Order status updated successfully!');
            // Remove the order from the list if it is marked as "Complete"
            if (status === 'Complete') {
                const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
                console.log('Removing row:', row); 
                if (row) {
                    row.remove();
                }
            } else {
                fetchOrders(); // Refresh the list for other status updates
            }
        }
    })
    .catch(error => console.error('Error updating order status:', error));
}

function confirmDeletion(event, form) {
    if (confirm('Are you sure you want to delete this order?')) {
        const formData = new FormData(form);
        fetch('orders.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Order deleted successfully!');
                fetchOrders();
            } else {
                alert('Error deleting order!');
            }
        })
        .catch(error => console.error('Error deleting order:', error));
    }
}
