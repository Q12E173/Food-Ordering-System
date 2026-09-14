<?php
session_start();
include('databaseConnection.php'); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'You must be logged in to confirm an order.']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $total = $data['total'];
    $items = $data['items'];
    $user_id = $_SESSION['user_id']; 

    $sql = "INSERT INTO orders (user_id, total) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("id", $user_id, $total);
    if ($stmt->execute()) {
        $order_id = $stmt->insert_id;
        $_SESSION['order_id'] = $order_id; 

        $sql_item = "INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt_item = $conn->prepare($sql_item);

        foreach ($items as $item) {
            $stmt_item->bind_param("iiid", $order_id, $item['id'], $item['quantity'], $item['price']);
            $stmt_item->execute();
        }

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }

    $stmt->close();
    $stmt_item->close();
    $conn->close();
}
?>
