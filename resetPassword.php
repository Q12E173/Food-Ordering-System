<?php
include 'databaseConnection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $adminId = $_POST['admin_id'];
    $newPassword = password_hash($_POST['newPassword'], PASSWORD_BCRYPT); // hash the password

    $sql = "UPDATE admin SET admin_password=? WHERE admin_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $newPassword, $adminId);

    if ($stmt->execute() === TRUE) {
        echo "<script>
                    alert('Password updated successfully');
                    window.location.href='resetPassword.html';
                  </script>";
    } else {
        echo "Error updating password: " . $stmt->error;
    }
    $stmt->close();
}

$conn->close();
?>
