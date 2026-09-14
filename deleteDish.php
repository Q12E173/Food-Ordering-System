<?php
include 'databaseConnection.php';

if (isset($_GET['item_id'])) {
    $item_id = intval($_GET['item_id']);

    $sql = "DELETE FROM items WHERE item_id=$item_id";

    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error deleting record: " . $conn->error;
    }
}

$conn->close();
?>
