<?php
include 'databaseConnection.php';

$type = isset($_GET['type']) ? $_GET['type'] : 'Sushi';

$sql = "SELECT * FROM items WHERE type='$type'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo '<tr>';
        echo '<td><img src="' . $row['image'] . '" alt="' . $row['name'] . '"></td>';
        echo '<td class="name">' . $row['name'] . '</td>';
        echo '<td>' . $row['price'] . '</td>';
        echo '<td class="description">' . $row['description'] . '</td>';
        echo '<td class="action-icons">';
        echo '<img src="images/edit.png" onclick="editDish(' . $row['item_id'] . ')" alt="Edit">';
        echo '<img src="images/delete.png" onclick="deleteDish(' . $row['item_id'] . ', \'' . $row['name'] . '\')" alt="Delete">';
        echo '</td>';
        echo '</tr>';
    }
} else {
    echo "<tr><td colspan='5' style='text-align:center;'>No dishes available</td></tr>";
}

$conn->close();
?>
