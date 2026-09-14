<?php
session_start();
include('databaseConnection.php'); 

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_SESSION['order_id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID or Order ID not set in session.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$order_id = $_SESSION['order_id'];

$response = ['success' => false];

try {
    $sql = "SELECT items.name, order_items.quantity, order_items.price 
            FROM order_items 
            JOIN items ON order_items.item_id = items.item_id 
            WHERE order_items.order_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception($conn->error);
    }
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    $stmt->close();


    $user_info_sql = "SELECT username, email FROM users WHERE user_id = ?";
    $stmt_user = $conn->prepare($user_info_sql);
    if (!$stmt_user) {
        throw new Exception($conn->error);
    }
    $stmt_user->bind_param("i", $user_id);
    $stmt_user->execute();
    $user_info = $stmt_user->get_result()->fetch_assoc();
    $stmt_user->close();

    
    $order_date_sql = "SELECT order_date FROM orders WHERE order_id = ?";
    $stmt_order_date = $conn->prepare($order_date_sql);
    if (!$stmt_order_date) {
        throw new Exception($conn->error);
    }
    $stmt_order_date->bind_param("i", $order_id);
    $stmt_order_date->execute();
    $order_date = $stmt_order_date->get_result()->fetch_assoc()['order_date'];
    $stmt_order_date->close();

    $response = [
        'success' => true,
        'username' => $user_info['username'],
        'order_date' => $order_date,
        'order_id' => $order_id,
        'items' => $items
    ];

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>
