let cart = [];
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    let count = 0;
    let total = 0;
    let items = "";

    cart.forEach((item, index) => {
        count += item.quantity;
        total += item.price * item.quantity;

        items += `
            <div class="cart-item">
                <p>${item.name} - ₹${item.price}</p>

                <button onclick="changeQuantity(${index}, -1)">−</button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${index}, 1)">+</button>

                <button onclick="removeFromCart(${index})">
                    Remove
                </button>
            </div>
        `;
    });

    document.getElementById("cart-count").innerText = count;
    document.getElementById("cart-items").innerHTML =
    items || "<p>Your cart is waiting for something delicious! 💗</p>";
    document.getElementById("cart-total").innerText = total;
}

async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let name = document.getElementById("customer-name").value;
    let phone = document.getElementById("customer-phone").value;
    let address = document.getElementById("customer-address").value;

    if (name === "" || phone === "" || address === "") {
        alert("Please enter all your details!");
        return;
    }

    let total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );
try {
    const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            address: address,
            items: cart,
            total: total
        })
    });

    const result = await response.json();

    if (result.success) {
        alert(result.message);
        cart = [];
        updateCart();
    } else {
        alert("Order could not be placed.");
    }
} catch (error) {
    alert("Server connection failed. Please try again.");
}
}