
let cart = JSON.parse(localStorage.getItem("cart")) || [];


let container = document.getElementById("products");
if (container) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://dummyjson.com/products?limit=100");
  
  xhr.onload = function () {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      let products = data.products;

      let cards = "";
      products.forEach(product => {
        cards += `
          <div class="product">
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
           <button class="addtocart-btn" onclick="addToCart('${product.title}', ${product.price} , this)">Add to cart</button>
           
           </div>
        `;
      });

      container.innerHTML = cards;
    } else {
      console.error("Failed to load products:", xhr.status);
    }
  };

  xhr.send();
}


//add item to cart
function addToCart(title, price) {
    let item = cart.find(p => p.title === title);
    if (item) {
        item.qty += 1;
    } else {
        cart.push({ title, price, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showMessage("Added to cart");
}

//message
function showMessage(msg) {
    const message = document.getElementById("cartMessage");
    if (!message) 
        return;

    message.innerText = msg;
    message.style.opacity = 1;

    setTimeout(() => {
        message.style.opacity = 0;
    }, 2000);
}

//display
function displayCart() {
    let container = document.getElementById("cartItems");
    let totalEl = document.getElementById("total");

    if (!container) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        container.innerHTML += `
            <div class="cartItem">
                <span>${item.title} (x${item.qty})</span>
                <span>$${item.price * item.qty}</span>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalEl.innerText = "Total: $" + total;
}

//remove items
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

//clear cart
function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    displayCart();
}

//confirm order
function confirmOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
        const orderMsg = document.getElementById("orderMessage");
        orderMsg.innerText = "Cart is empty";
        orderMsg.style.opacity = 1;
        setTimeout(() => { orderMsg.style.opacity = 0; }, 2000);
        return;
    }

    //clear cart
    cart = [];
    localStorage.removeItem("cart");
    displayCart();

    //confirmation msg
    const orderMsg = document.getElementById("orderMessage");
    orderMsg.innerText = "Order confirmed! Thank you for your order.";
    orderMsg.style.opacity = 1;

    
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    displayCart();
});
