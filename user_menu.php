<?php
include('databaseConnection.php');

// Fetch items from the database
$query = "SELECT * FROM items";
$result = $conn->query($query);

$items = [
    'Sushi' => '',
    'Sashimi' => '',
    'Donburi' => '',
    'Bento' => '',
    'Ramen/Udon' => '',
    'Tempura' => '',
    'Beverage' => '',
    'Dessert' => ''
];

while ($row = $result->fetch_assoc()) {
    $items[$row['type']] .= '
    <div class="item-card">
        <div class="image-container" style="background-image: url(\'' . $row['image'] . '\');"></div>
        <div class="item-details">
            <h3>' . $row['name'] . '</h3>
            <div class="description">' . $row['description'] . '</div>
            <p class="price">RM ' . number_format($row['price'], 2) . '</p>
            <div class="quantity-controls">
                <button class="decrease-quantity" data-id="' . $row['item_id'] . '">-</button>
                <span class="quantity">1</span>
                <button class="increase-quantity" data-id="' . $row['item_id'] . '">+</button>
            </div>
            <button class="add-to-cart" data-id="' . $row['item_id'] . '">Add to Cart</button>
        </div>
    </div>';
}

$conn->close();

echo json_encode($items);
?>