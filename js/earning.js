document.addEventListener('DOMContentLoaded', () => {
    const earningType = document.getElementById('earningType');
    const board = document.querySelector('.board');
    const totalOrders = document.getElementById('totalOrders');
    const totalEarnings = document.getElementById('totalEarnings');

    earningType.addEventListener('change', () => {
        const type = earningType.value;
        fetchEarnings(type);
    });

    const fetchEarnings = (type) => {
        fetch(`earning.php?type=${type}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched Data:", data);
                if (data.error) {
                    console.error('Error:', data.error);
                    return;
                }
                if (type === 'daily') {
                    populateDailyTable(data.orders);
                } else if (type === 'yearly') {
                    populateYearlyTables(data.orders);
                }
                totalOrders.textContent = data.totalOrders;
                totalEarnings.textContent = data.totalEarnings.toFixed(2);
            })
            .catch(error => console.error('Error fetching earnings:', error));
    };

    const populateDailyTable = (orders) => {
        board.innerHTML = ''; // Clear existing tables
        const dailyTable = document.createElement('table');
        dailyTable.innerHTML = `
            <thead>
                <tr>
                    <td>Order ID</td>
                    <td>User ID</td>
                    <td>Order Date</td>
                    <td>Total (RM)</td>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = dailyTable.querySelector('tbody');
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.user_id}</td>
                <td>${order.order_date}</td>
                <td>${order.total}</td>
            `;
            tbody.appendChild(row);
        });
        board.appendChild(dailyTable);
    };

    const populateYearlyTables = (orders) => {
        board.innerHTML = ''; // Clear existing tables

        for (const year in orders) {
            const yearTable = document.createElement('table');
            yearTable.classList.add('yearly-table');
            yearTable.innerHTML = `
                <thead>
                    <tr>
                        <td colspan="4" style="font-weight: bold; text-align: center;">${year}</td>
                    </tr>
                    <tr>
                        <td>Order ID</td>
                        <td>User ID</td>
                        <td>Order Date</td>
                        <td>Total (RM)</td>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = yearTable.querySelector('tbody');
            
            orders[year].forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.user_id}</td>
                    <td>${order.order_date}</td>
                    <td>${order.total}</td>
                `;
                tbody.appendChild(row);
            });
            
            board.appendChild(yearTable);
        }
    };

    // Fetch daily earnings by default
    fetchEarnings('daily');
});
