document.addEventListener('DOMContentLoaded', function () {
    fetch('adminhome.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data);
            document.getElementById('userCount').textContent = data.userCount;
            document.getElementById('orderCount').textContent = data.orderCount;
            if (typeof data.totalEarnings === 'number') {
                document.getElementById('totalEarnings').textContent = `RM ${data.totalEarnings.toFixed(2)}`;
            } else {
                document.getElementById('totalEarnings').textContent = `RM 0.00`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

});
