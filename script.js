const books = [
  {
    id: 1,
    title: "أرض زيكولا",
    author: "عمرو عبد الحميد",
    price: 180,
    category: "روايات",
    condition: "جديد",
    color: "#8b5e3c",
    description: "رواية خيالية مشوقة تدور في عالم مختلف تُقاس فيه قيمة الإنسان بذكائه.",
    badge: "الأكثر طلبًا"
  },
  {
    id: 2,
    title: "في قلبي أنثى عبرية",
    author: "خولة حمدي",
    price: 165,
    category: "روايات",
    condition: "مستعمل بحالة ممتازة",
    color: "#b17849",
    description: "رواية إنسانية مؤثرة تمزج بين الحب والصراع الفكري في حبكة جذابة.",
    badge: "مميز"
  },
  {
    id: 3,
    title: "نظرية الفستق",
    author: "فهد عامر الأحمدي",
    price: 140,
    category: "تطوير ذات",
    condition: "جديد",
    color: "#6e7f86",
    description: "كتاب عملي في تطوير الذات وبناء العادات وتحسين طريقة التفكير.",
    badge: "الأكثر قراءة"
  },
  {
    id: 4,
    title: "العادات الذرية",
    author: "جيمس كلير",
    price: 220,
    category: "تطوير ذات",
    condition: "جديد",
    color: "#7c845e",
    description: "دليل واضح لبناء عادات صغيرة تؤدي إلى نتائج كبيرة.",
    badge: "جديد"
  },
  {
    id: 5,
    title: "الأب الغني والأب الفقير",
    author: "روبرت كيوساكي",
    price: 200,
    category: "بيزنس",
    condition: "مستعمل بحالة جيدة",
    color: "#4c6972",
    description: "كتاب شهير حول الثقافة المالية والاستثمار وطريقة التفكير في المال.",
    badge: "مبيعًا"
  },
  {
    id: 6,
    title: "فن اللامبالاة",
    author: "مارك مانسون",
    price: 175,
    category: "تطوير ذات",
    condition: "جديد",
    color: "#9e4d4d",
    description: "طرح مختلف للتعامل مع الضغوط والتوقعات والتركيز على ما يستحق الاهتمام.",
    badge: "مفضل"
  }
];

let cart = JSON.parse(localStorage.getItem("bookCart")) || [];
let swaps = JSON.parse(localStorage.getItem("swapRequests")) || [];

function saveState() {
  localStorage.setItem("bookCart", JSON.stringify(cart));
  localStorage.setItem("swapRequests", JSON.stringify(swaps));
}

function getBook(id) {
  return books.find(function (book) {
    return book.id === Number(id);
  });
}

function createCover(book) {
  return `
    <div class="cover" style="background:linear-gradient(135deg, ${book.color}, #c08552)">
      <small>${book.badge}</small>
      <div>
        <div class="cover-title">${book.title}</div>
        <small>${book.author}</small>
      </div>
    </div>
  `;
}

function addToCart(id) {
  const book = getBook(id);
  if (!book) return;
  cart.push(book);
  saveState();
  alert('تمت إضافة "' + book.title + '" إلى السلة');
}

function renderProducts(filter, search) {
  const container = document.getElementById("products");
  if (!container) return;

  const currentFilter = filter || "الكل";
  const currentSearch = (search || "").trim().toLowerCase();

  const result = books.filter(function (book) {
    const categoryMatch = currentFilter === "الكل" || book.category === currentFilter;
    const text = (book.title + " " + book.author + " " + book.category).toLowerCase();
    const searchMatch = currentSearch === "" || text.includes(currentSearch);
    return categoryMatch && searchMatch;
  });

  if (result.length === 0) {
    container.innerHTML = `
      <div class="empty-box">
        <h3>لا توجد كتب مطابقة</h3>
        <p>جرّب تغيير التصنيف أو البحث بكلمات مختلفة.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = result.map(function (book) {
    return `
      <article class="product">
        ${createCover(book)}
        <div class="product-body">
          <div class="product-top">
            <div>
              <h3>${book.title}</h3>
              <div class="meta">${book.author}</div>
            </div>
            <div class="price">${book.price} جنيه</div>
          </div>
          <div class="meta">${book.category} • ${book.condition}</div>
          <div class="muted">${book.description}</div>
          <div class="buttons">
            <a class="outline-btn" href="./product.html?id=${book.id}">عرض التفاصيل</a>
            <button class="btn" onclick="addToCart(${book.id})">شراء</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function selectCategory(category) {
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput ? searchInput.value : "";
  renderProducts(category, searchValue);
}

function setupProductsPage() {
  const categoriesBox = document.getElementById("categories");
  const searchInput = document.getElementById("searchInput");

  if (categoriesBox) {
    const categories = ["الكل"];
    books.forEach(function (book) {
      if (!categories.includes(book.category)) {
        categories.push(book.category);
      }
    });

    categoriesBox.innerHTML = categories.map(function (cat) {
      return `<button class="category-btn" onclick="selectCategory('${cat}')">${cat}</button>`;
    }).join("");
  }

  renderProducts("الكل", "");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const activeCategory = "الكل";
      renderProducts(activeCategory, searchInput.value);
    });
  }
}

function renderProductDetails() {
  const details = document.getElementById("productDetails");
  if (!details) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const book = getBook(id);

  if (!book) {
    details.innerHTML = `
      <div class="empty-box">
        <h3>الكتاب غير موجود</h3>
        <p>الكتاب المطلوب غير متاح حاليًا.</p>
      </div>
    `;
    return;
  }

  details.innerHTML = `
    <div class="product-layout">
      <div class="detail-card">
        ${createCover(book)}
      </div>

      <div class="detail-card">
        <h1>${book.title}</h1>
        <div class="meta">${book.author}</div>

        <div class="detail-meta">
          <span class="tag">${book.category}</span>
          <span class="tag">${book.condition}</span>
          <span class="tag">${book.price} جنيه</span>
        </div>

        <p class="description">${book.description}</p>

        <div class="buttons">
          <button class="btn" onclick="addToCart(${book.id})">شراء الكتاب</button>
          <a class="outline-btn" href="#swapSection">استبداله بكتاب آخر</a>
        </div>
      </div>
    </div>

    <form class="swap-form" id="swapSection" onsubmit="submitSwap(event, ${book.id})">
      <h3>طلب استبدال</h3>
      <p class="muted">اكتب بيانات كتابك وسنضيف الطلب في السلة.</p>

      <input type="text" id="userBookTitle" placeholder="اسم الكتاب الذي تريد عرضه" required>
      <input type="text" id="userBookAuthor" placeholder="اسم مؤلف كتابك" required>
      <input type="text" id="userBookCondition" placeholder="حالة الكتاب" required>
      <textarea id="swapNotes" placeholder="ملاحظات إضافية"></textarea>

      <button class="btn" type="submit">إرسال طلب الاستبدال</button>
    </form>
  `;
}

function submitSwap(event, targetBookId) {
  event.preventDefault();

  const targetBook = getBook(targetBookId);
  if (!targetBook) return;

  const offeredTitle = document.getElementById("userBookTitle").value.trim();
  const offeredAuthor = document.getElementById("userBookAuthor").value.trim();
  const offeredCondition = document.getElementById("userBookCondition").value.trim();
  const notes = document.getElementById("swapNotes").value.trim();

  const swap = {
    wantedBook: targetBook.title,
    wantedAuthor: targetBook.author,
    offeredTitle: offeredTitle,
    offeredAuthor: offeredAuthor,
    offeredCondition: offeredCondition,
    notes: notes
  };

  swaps.push(swap);
  saveState();
  alert('تم تسجيل طلب استبدال على كتاب "' + targetBook.title + '"');
  event.target.reset();
}

function renderCartPage() {
  const cartItems = document.getElementById("cartItems");
  const swapItems = document.getElementById("swapItems");

  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `<div class="empty-box"><p>لا توجد كتب في السلة.</p></div>`;
    } else {
      cartItems.innerHTML = cart.map(function (book) {
        return `
          <div class="cart-item">
            <h3>${book.title}</h3>
            <div class="meta">${book.author}</div>
            <div class="price">${book.price} جنيه</div>
          </div>
        `;
      }).join("");
    }
  }

  if (swapItems) {
    if (swaps.length === 0) {
      swapItems.innerHTML = `<div class="empty-box"><p>لا توجد طلبات استبدال.</p></div>`;
    } else {
      swapItems.innerHTML = swaps.map(function (swap) {
        return `
          <div class="swap-item">
            <h3>مطلوب: ${swap.wantedBook}</h3>
            <div class="meta">المؤلف: ${swap.wantedAuthor}</div>
            <div class="meta">كتابك: ${swap.offeredTitle}</div>
            <div class="meta">مؤلف كتابك: ${swap.offeredAuthor}</div>
            <div class="meta">الحالة: ${swap.offeredCondition}</div>
            <div class="muted">${swap.notes || ""}</div>
          </div>
        `;
      }).join("");
    }
  }
}

function submitCheckout(event) {
  event.preventDefault();
  alert("تم تأكيد الطلب بنجاح");
  localStorage.removeItem("bookCart");
  localStorage.removeItem("swapRequests");
  window.location.href = "./index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  setupProductsPage();
  renderProductDetails();
  renderCartPage();
});