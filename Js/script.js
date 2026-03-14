const API = "https://dummyjson.com/products?limit=194"

let cart = JSON.parse(localStorage.getItem("cart")) || []
let allProducts= []

// تحميل المنتجات
if(document.getElementById("products")){

fetch(API)
.then(res => res.json())
.then(data => {

allProducts= data.products
displayProducts(allProducts)
})
}

function displayProducts(list){
    let container= document.getElementById("products")
    container.innerHTML= ""
    list.forEach(p =>{
        container.innerHTML +=`
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

}
function filterCategory(cat){
    if(cat === "all"){
        displayProducts(allProducts)
        return
        
    }

let filtered = allProducts.filter(p => p.category === cat)

displayProducts(filtered)

}

// إضافة للكارت
function addToCart(name,price){

cart.push({name,price})

localStorage.setItem("cart",JSON.stringify(cart))

alert("Product added")

}

if(document.getElementById("cartItems")){

let container = document.getElementById("cartItems")
let total = 0

cart.forEach((item,index)=>{

container.innerHTML += `
<div class="cartItem">

<span>${item.name} - $${item.price}</span>

<button onclick="removeItem(${index})">
Delete
</button>

</div>
`

total += item.price

})

document.getElementById("total").innerText = "Total: $" + total

}

// حذف منتج من الكارت
function removeItem(index){

cart.splice(index,1)

localStorage.setItem("cart",JSON.stringify(cart))

location.reload()

}

// مسح الكارت كله
function clearCart(){

localStorage.removeItem("cart")

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

function placeOrder(e){
    e.preventDefault()

    let name= document.getElementById("name").value
    let address= document.getElementById("address").value
    let phone= document.getElementById("phone").value

    if(cart.length ===0){
        alert("Your Cart Is Empty")
        return
    }

    alert("Order placed succefully")
    localStorage.removeItem("cart")
    window.location.href = "index.html"

}

function confirmOrder(e){

e.preventDefault()

alert("Order is confirmed!")

localStorage.removeItem("cart")

window.location.href = "index.html"

}

}