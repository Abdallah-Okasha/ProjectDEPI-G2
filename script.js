let total = 0;

function addToCart(bookName , price)
{

let cartList = document.getElementById("cartList");

let li = document.createElement("li");

li.innerText = bookName + " - $" + price;

cartList.appendChild(li);

total += price;

document.getElementById("total").innerText = total;

}