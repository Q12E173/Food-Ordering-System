<?php
session_start();
include('databaseConnection.php'); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Query the database
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Statement preparation failed: " . $conn->error);
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        if ($password === $user['password']) {
            $_SESSION['user_id'] = $user['user_id'];
            header("Location: user_menu.html");
            exit();
        } else {
            $error = "Invalid Email or Password";
        }
    } else {
        $error = "Email not found";
    }

    header("Location: user_login.html?error=" . urlencode($error) . "&email=" . urlencode($email));
    exit();
}
?>
