<?php
include 'databaseConnection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $admin_id = $_POST['admin_id'];
    $admin_password = $_POST['admin_password'];

    $stmt = $conn->prepare("SELECT admin_password FROM admin WHERE admin_id = ?");
    $stmt->bind_param("i", $admin_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashedPass);
        $stmt->fetch();

        if (password_verify($admin_password, $hashedPass)) {
            echo "success";
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "Invalid admin ID.";
    }

    $stmt->close();
}

$conn->close();
?>
