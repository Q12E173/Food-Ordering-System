<?php
include 'databaseConnection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $item_id = intval($_POST['item_id']);
    $name = $conn->real_escape_string($_POST['name']);
    $price = floatval($_POST['price']);
    $description = $conn->real_escape_string($_POST['description']);

    // Handle file upload
    $image = "";
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (in_array($_FILES['image']['type'], $allowedTypes)) {
            $image = 'uploads/' . basename($_FILES['image']['name']);
            move_uploaded_file($_FILES['image']['tmp_name'], $image);
        } else {
            echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            exit;
        }
    }

    
    if ($image) {
        $sql = "UPDATE items SET name='$name', price=$price, description='$description', image='$image' WHERE item_id=$item_id";
    } else {
        $sql = "UPDATE items SET name='$name', price=$price, description='$description' WHERE item_id=$item_id";
    }

    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    } else {
        echo "Error updating record: " . $conn->error;
    }
}

$conn->close();
?>
