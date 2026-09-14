<?php
include 'databaseConnection.php';

// Fetch user count
$query = "SELECT COUNT(*) as userCount FROM users";
$userResult = mysqli_query($conn, $query);
$userCount = mysqli_fetch_assoc($userResult)['userCount'];

// Fetch order count
$query = "SELECT COUNT(*) as orderCount FROM orders";
$orderResult = mysqli_query($conn, $query);
$orderCount = mysqli_fetch_assoc($orderResult)['orderCount'];

// Fetch total earnings
$query = "SELECT COALESCE(SUM(total), 0) as totalEarnings FROM orders WHERE status = 'Complete'";
$earningsResult = mysqli_query($conn, $query);
$totalEarnings = mysqli_fetch_assoc($earningsResult)['totalEarnings'];

error_log("User Count: " . $userCount);
error_log("Order Count: " . $orderCount);
error_log("Total Earnings: " . $totalEarnings);

$data = array(
    'userCount' => $userCount,
    'orderCount' => $orderCount,
    'totalEarnings' => (float)$totalEarnings 
);

error_log("JSON Data: " . json_encode($data));

echo json_encode($data);
?>
