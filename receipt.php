<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'databaseConnection.php';

date_default_timezone_set('Asia/Kuala_Lumpur'); // Set your preferred timezone

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['order_id'])) {
        $orderId = $_GET['order_id'];
        $sql = "SELECT orders.order_id, users.username, orders.order_date, orders.total, users.email, users.phone, orders.status 
                FROM orders 
                JOIN users ON orders.user_id = users.user_id 
                WHERE orders.order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = $result->fetch_assoc();
        
        $sql_items = "SELECT items.name, order_items.quantity, order_items.price 
                      FROM order_items 
                      JOIN items ON order_items.item_id = items.item_id 
                      WHERE order_items.order_id = ?";
        $stmt_items = $conn->prepare($sql_items);
        $stmt_items->bind_param('i', $orderId);
        $stmt_items->execute();
        $result_items = $stmt_items->get_result();
        $items = [];
        while ($row = $result_items->fetch_assoc()) {
            $items[] = $row;
        }
        $order['items'] = $items;
        echo json_encode($order);
    } else {
        $today = date('Y-m-d');
        $sql = "SELECT orders.order_id, users.username, orders.order_date, orders.total, orders.status 
                FROM orders 
                JOIN users ON orders.user_id = users.user_id 
                WHERE DATE(orders.order_date) = ? AND orders.status = 'Complete'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $today);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        echo json_encode($orders);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
}

$conn->close();
?>
