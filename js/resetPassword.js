function verifyAdmin() {
    var adminId = document.getElementById("admin_id").value;
    var password = document.getElementById("admin_password").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "verifyAdmin.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText.trim() === "success") {
                document.getElementById("step1").style.display = "none";
                document.getElementById("step2").style.display = "block";
                document.getElementById("hiddenAdminId").value = adminId;
            } else {
                showAlert("Invalid Admin ID or Password.");
            }
        }
    };
    xhr.send("admin_id=" + adminId + "&admin_password=" + password);
    return false; // Prevent the form from submitting the traditional way
}

function validateNewPassword() {
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        showAlert("Passwords do not match. Please try again.");
        return false;
    }
    return true;
}

function showAlert(message) {
    alert(message);
}
