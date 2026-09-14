function fetchMenu() {
    var type = document.getElementById("dishType").value;
    if (type) {
        fetch('showMenu.php?type=' + type)
        .then(response => response.text())
        .then(data => {
            document.getElementById("menuTable").innerHTML = data;
        });
    }
}

function showModal(item_id) {
    fetch('fetchDish.php?item_id=' + item_id)
        .then(response => response.json())
        .then(data => {
            if (data.item_id) {
                document.getElementById("dishId").value = data.item_id;
                document.getElementById("name").value = data.name;
                document.getElementById("price").value = data.price;
                document.getElementById("description").value = data.description;
                document.getElementById("editDishModal").style.display = "block";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching dish data:', error);
            alert('An error occurred while fetching dish data.');
        });
}

function hideModal() {
    document.getElementById("editDishModal").style.display = "none";
}

function editDish(item_id) {
    showModal(item_id);
}

function deleteDish(item_id, dishName) {
    if (confirm(`Are you sure you want to delete the dish name: ${dishName}?`)) {
        fetch(`deleteDish.php?item_id=${item_id}`)
        .then(response => response.text())
        .then(data => {
            alert(`The dish name: ${dishName} successfully deleted.`);
            fetchMenu();
        })
        .catch(error => {
            console.error('Error deleting dish:', error);
            alert('An error occurred while deleting the dish.');
        });
    }
}

function validateForm() {
    var name = document.getElementById("name").value;
    var price = document.getElementById("price").value;
    var image = document.getElementById("image").files[0];
    var description = document.getElementById("description").value;

    if (name === "" || price === "" || description === "") {
        alert("All fields must be filled out");
        return false;
    }

    if (price < 1) {
        alert("Price must be greater than 1");
        return false;
    }

    if (image) {
        var allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(image.type)) {
            alert("Only JPG, JPEG, PNG, and GIF files are allowed");
            return false;
        }
    }

    return true;
}

function submitForm(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    var formData = new FormData(document.getElementById("editDishForm"));

    fetch('editDish.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        hideModal();
        location.reload(); // Reload the page after closing the modal
    })
    .catch(error => {
        console.error('Error updating dish:', error);
        alert('An error occurred while updating the dish.');
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchMenu();
    document.getElementById("editDishForm").addEventListener("submit", submitForm);
});
