const API = "https://dummyjson.com/products?limit=194"

let cart = JSON.parse(localStorage.getItem("cart")) || []

// تحميل المنتجات
if(document.getElementById("products")){

fetch(API)
.then(res => res.json())
.then(data => {

let container = document.getElementById("products")

data.products.forEach(p => {

container.innerHTML += `
<div class="product">

<img src="${p.thumbnail}">

<h3>${p.title}</h3>

<p>$${p.price}</p>

<div class="buttons">

<a href="product.html?id=${p.id}">
<button class="detailsBtn">View Details</button>
</a>

<button onclick="addToCart('${p.title}',${p.price})">
Add To Cart
</button>

</div>

</div>
`

})

})

}

// إضافة للكارت
function addToCart(name,price){

cart.push({name,price})

localStorage.setItem("cart",JSON.stringify(cart))

alert("Product added")

}

// عرض الكارت
if(document.getElementById("cartItems")){

let container=document.getElementById("cartItems")

let total=0

cart.forEach((item,index)=>{

container.innerHTML+=`

<div class="cartItem">

${item.name} - $${item.price}

<button onclick="removeItem(${index})">
Delete
</button>

</div>

`

total+=item.price

})

document.getElementById("total").innerText="Total: $"+total

}

// حذف منتج
function removeItem(i){

cart.splice(i,1)

localStorage.setItem("cart",JSON.stringify(cart))

location.reload()

}

// صفحة تفاصيل المنتج
if(document.getElementById("productDetails")){

let id = new URLSearchParams(window.location.search).get("id")

fetch("https://dummyjson.com/products/" + id)
.then(res => res.json())
.then(p => {

let container = document.getElementById("productDetails")

container.innerHTML = `

<img src="${p.thumbnail}">

<h2>${p.title}</h2>

<p>${p.description}</p>

<h3>$${p.price}</h3>

<button onclick="addToCart('${p.title}',${p.price})">
Add To Cart
</button>

`

})

}