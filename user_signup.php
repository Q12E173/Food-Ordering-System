<?php
include('databaseConnection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm-password'];

    // Check if email already exists
    $sql_check = "SELECT * FROM users WHERE email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        $error = "Email already exists.";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match.";
    } elseif (!preg_match("/^01[0-9]-[0-9]{7,8}$/", $phone)) {
        $error = "Invalid phone number format.";
    } else {
        // Insert new user into database
        $sql = "INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $username, $email, $phone, $password);
        if ($stmt->execute()) {
            echo "<script>
                alert('Sign up successful. You can now log in.');
                window.location.href = 'user_login.html';
            </script>";
            exit();
        } else {
            $error = "Error inserting user record: " . $stmt->error;
        }
        $stmt->close(); // Close $stmt only when it's defined
    }

    $stmt_check->close();
    $conn->close();

    // Redirect back to the signup page with the error message and the entered data
    header("Location: user_signup.html?error=" . urlencode($error) . "&username=" . urlencode($username) . "&email=" . urlencode($email) . "&phone=" . urlencode($phone));
    exit();
}
?>
