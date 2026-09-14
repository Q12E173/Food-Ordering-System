<?php
include 'databaseConnection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $type = $_POST['type'];
    $name = $_POST['name'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $image = $_FILES['image']['name'];
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($image);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Move the uploaded file to the target directory
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        $sql = "INSERT INTO items (name, type, price, description, image)
                VALUES ('$name', '$type', '$price', '$description', '$target_file')";

        if ($conn->query($sql) === TRUE) {
            echo "<script>
                    alert('New dish added successfully');
                    window.location.href='addDish.html';
                  </script>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "<script>alert('Sorry, there was an error uploading your file.');</script>";
    }
}

$conn->close();
?>
