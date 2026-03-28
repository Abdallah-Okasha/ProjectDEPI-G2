let xhr = new XMLHttpRequest();


xhr.open("GET", "https://dummyjson.com/products?limit=100");

xhr.onload = function () {
  if (xhr.status === 200) {

    let data = JSON.parse(xhr.responseText);
    let products = data.products;

    let container = document.getElementById("products");
    let cards = "";

    products.forEach(product => {
      cards += `
        <div class="product">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <h3>${product.title}</h3>
          <p>$${product.price}</p>
          
        </div>
      `;
    });

    container.innerHTML = cards;
  } }

xhr.send();