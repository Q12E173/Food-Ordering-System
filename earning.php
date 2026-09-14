<?php
include 'databaseConnection.php';

header('Content-Type: application/json');

$type = isset($_GET['type']) ? $_GET['type'] : 'daily';
$response = ['totalOrders' => 0, 'totalEarnings' => 0.00, 'orders' => []];

try {
    if ($type == 'daily') {
        $response = getDailyEarnings($conn);
    } else if ($type == 'yearly') {
        $response = getYearlyEarnings($conn);
    }

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

function getDailyEarnings($conn) {
    $sql = "SELECT order_id, user_id, order_date, total FROM orders WHERE DATE(order_date) = CURDATE() AND status = 'complete'";
    $result = $conn->query($sql);

    $orders = [];
    $totalEarnings = 0;

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $orders[] = $row;
            $totalEarnings += $row['total'];
        }
    }

    return [
        'totalOrders' => count($orders),
        'totalEarnings' => $totalEarnings,
        'orders' => $orders
    ];
}

function getYearlyEarnings($conn) {
    $sql = "SELECT order_id, user_id, order_date, total, YEAR(order_date) as year FROM orders WHERE status = 'complete'";
    $result = $conn->query($sql);

    $orders = [];
    $totalEarnings = 0;

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $year = $row['year'];
            if (!isset($orders[$year])) {
                $orders[$year] = [];
            }
            $orders[$year][] = $row;
            $totalEarnings += $row['total'];
        }
    }

    return [
        'totalOrders' => array_reduce($orders, function($carry, $yearOrders) {
            return $carry + count($yearOrders);
        }, 0),
        'totalEarnings' => $totalEarnings,
        'orders' => $orders
    ];
}
?>
