<?php
include 'databaseConnection.php';

header('Content-Type: application/json');

if (isset($_GET['item_id'])) {
    $item_id = intval($_GET['item_id']);

    $sql = "SELECT * FROM items WHERE item_id = $item_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        echo json_encode(array("message" => "Item not found"));
    }
} else {
    echo json_encode(array("message" => "Invalid item_id"));
}

$conn->close();
?>
