// DOM Content Loaded Listener
document.addEventListener("DOMContentLoaded", function() {
    populateDropdowns();
    setupFormSubmission();
});

// Vendor Menu Items
const vendors = {
    "Alek's Hot Chicken": ["Spicy Chicken Sandwich (Solo): $10", "Spicy Chicken Sandwich (Meal): $15", "Chicken Tenders (Solo): $8", "Chicken Tenders (Meal): $14", "Buffalo Wings (Solo): $9", "Buffalo Wings (Meal): $14"],
    "Margarita's Tamales": ["Pork Tamales (Meal): $15", "Chicken Tamales (Meal): $12"],
    "The Italian Spot": ["Chicken Alfredo: $16", "Arancini: $12", "Grilled Chicken with Penne alla Vodka sauce: $18", "Lasagne: $14", "Spaghetti: $12"],
    "Christopher's Burger Joint": ["Cheeseburger (Meal): $14", "Bacon Cheeseburger (Meal): $18", "The Ultimate Burger (Meal): $25"],
    "Anita Max Wynn Pizzeria": ["Pepperoni Pizza (3 slices): $6.99", "Pepperoni Pizza (Full): $12.99", "Pepperoni Pizza with Jalapenos (3 slices): $8.99", "Pepperoni Pizza with Jalapenos (Full): $14.99", "Supreme Pepperoni Pizza (3 slices): $10.99", "Supreme Pepperoni Pizza (Full): $15.99"]
};

function populateDropdowns() {
    Object.keys(vendors).forEach((vendor, index) => {
        populateDropdown(`foodChoice${index + 1}`, vendors[vendor]);
    });
}

function populateDropdown(dropdownId, items) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "Select an item";
    defaultOption.value = "";
    dropdown.appendChild(defaultOption);

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}

function validateQuantities() {
    let isValid = true;
    for (let i = 1; i <= 5; i++) {
        const dropdown = document.getElementById(`foodChoice${i}`);
        const quantityInput = document.getElementById(`quantity${i}`);
        if (dropdown.value !== "" && quantityInput.value < 1) {
            alert('Please enter a valid quantity greater than zero for selected items.');
            isValid = false;
            break;
        }
    }
    return isValid;
}

function getSelectedItemsAndTotal() {
    const selectedItems = [];
    let totalPrice = 0;
    for (let i = 1; i <= 5; i++) {
        const dropdown = document.getElementById(`foodChoice${i}`);
        const quantityInput = document.getElementById(`quantity${i}`);
        if (dropdown.value !== "" && quantityInput.value > 0) {
            const itemText = `${dropdown.value} x ${quantityInput.value}`;
            selectedItems.push(itemText);

            const pricePattern = /\$\d+\.?\d*/;
            const priceMatch = dropdown.value.match(pricePattern);
            if (priceMatch) {
                const itemPrice = parseFloat(priceMatch[0].substring(1));
                const quantity = parseInt(quantityInput.value, 10);
                totalPrice += itemPrice * quantity;
            }
        }
    }
    return { selectedItems, totalPrice };
}

function calculatePickupTime() {
    const currentTime = new Date();
    const minutesToAdd = 45 + Math.floor(Math.random() * 15); // adds 45 to 59 minutes
    const pickupTime = new Date(currentTime.getTime() + minutesToAdd * 60000);
    return pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

function setupFormSubmission() {
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const userNameInput = document.getElementById('userName');
        const userName = userNameInput.value.trim();
        if (!userName) {
            alert("Please enter your name.");
            return;
        }

        const { selectedItems, totalPrice } = getSelectedItemsAndTotal();
        const quantitiesValid = validateQuantities();

        if (selectedItems.length === 0) {
            alert("Please select at least one item and enter a valid quantity.");
            return;
        } else if (!quantitiesValid) {
            return;
        }

        const itemListFormatted = selectedItems.join('\n');
        // Constructing the confirmation message with the user's name
        const confirmationMessage = `Here is the order for ${userName}:\n${itemListFormatted}\nTotal: $${totalPrice.toFixed(2)}\n\nClick 'OK' to confirm your order.`;
        if (confirm(confirmationMessage)) {
            console.log('Selected Items:', selectedItems);
            alert(`Order submitted, thank you.`);
            const pickupTime = calculatePickupTime();
            alert(`${userName}, your food will be ready for pickup at ${pickupTime}. Please arrive on time.`);
        }
    });
}
