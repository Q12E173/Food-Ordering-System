<?php
session_start();
include('databaseConnection.php');

function insertAdminCredentials($conn){
    $adminCredentials = [
        [1211102206, password_hash("ap2206", PASSWORD_DEFAULT)], 
        [1211103510, password_hash("lq3510", PASSWORD_DEFAULT)],
        [1211102828, password_hash("kq2828", PASSWORD_DEFAULT)],
        [1211101249, password_hash("jh1249", PASSWORD_DEFAULT)]
    ];

    foreach ($adminCredentials as $admin) {
        $admin_id = $admin[0]; 
        $admin_password = $admin[1]; 

        // Check if admin_id already exists
        $checkSql = "SELECT * FROM admin WHERE admin_id = ?";
        $stmt = $conn->prepare($checkSql);
        $stmt->bind_param("i", $admin_id);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows == 0) {
            $sql = "INSERT INTO admin (admin_id, admin_password) VALUES (?, ?)";
            $insertStmt = $conn->prepare($sql);
            $insertStmt->bind_param("is", $admin_id, $admin_password);
            $insertStmt->execute();
            $insertStmt->close();
        }
        $stmt->close();
    }
}

insertAdminCredentials($conn); // Call function to insert the data into admin table

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $admin_id = $_POST['admin_id'];
    $admin_password = $_POST['admin_password'];

    // Prepare and bind
    $stmt = $conn->prepare("SELECT admin_password FROM admin WHERE admin_id = ?");
    $stmt->bind_param("i", $admin_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashedPass);
        $stmt->fetch();

        if (password_verify($admin_password, $hashedPass)) {
            // Password is correct, start a new session and redirect to adminhome.html
            $_SESSION['admin_id'] = $admin_id;
            echo "<script>
                    alert('Login successful!');
                    window.location.href = 'adminhome.html';
                    </script>";
        } else {
            echo "<script>alert('Invalid password.'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Invalid admin ID.'); window.history.back();</script>";
    }

    $stmt->close();
}

$conn->close();
?>
