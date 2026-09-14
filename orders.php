<?php
include 'databaseConnection.php'; // Ensure this file is included

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch orders
    $sql = "SELECT o.order_id, u.username, o.order_date, o.total, o.status 
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.status != 'Complete'";
    $result = $conn->query($sql);

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode($orders);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['order_id']) && isset($_POST['status'])) {
        // Update order status
        $orderId = $_POST['order_id'];
        $status = $_POST['status'];

        $sql = "UPDATE orders SET status = ? WHERE order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $orderId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
        $stmt->close();
    } elseif (isset($_POST['delete_order_id'])) {
        // Delete order
        $orderId = $_POST['delete_order_id'];

        // First, delete from order_items to maintain referential integrity
        $sql = "DELETE FROM order_items WHERE order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $stmt->close();

        // Then, delete from orders
        $sql = "DELETE FROM orders WHERE order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
        $stmt->close();
    }
}

$conn->close();
?>
