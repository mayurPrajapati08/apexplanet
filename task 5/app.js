/* === DATA (add image property; leave empty string "" if you don't have one) === */
const products = [
  {
    id: 1,
    name: "Gaming Laptop X15",
    category: "laptop",
    price: 95000,
    rating: 4.7,
    image: "laptopx15.png"
  },
  {
    id: 2,
    name: "Ultrabook Pro 14",
    category: "laptop",
    price: 78000,
    rating: 4.5,
    image: "ultrabook.png"
  },
  {
    id: 3,
    name: "Wireless Gaming Headset",
    category: "headset",
    price: 4500,
    rating: 4.3,
    image: "headset.png"
  },
  {
    id: 4,
    name: "Studio Monitoring Headphones",
    category: "headset",
    price: 6200,
    rating: 4.8,
    image: "simage.png"
  },
  {
    id: 5,
    name: "RGB Gaming Mouse",
    category: "mouse",
    price: 1800,
    rating: 4.1,
    image: "mouse.png"
  },
  {
    id: 6,
    name: "Ergonomic Wireless Mouse",
    category: "mouse",
    price: 2200,
    rating: 4.6,
    image: "emouse.png"
  }
];

/* === ELEMENTS === */
const grid = document.getElementById("product-grid");
const filterSelect = document.getElementById("filter-category");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");

const cartToggle = document.getElementById("cart-toggle");
const cartDrawer = document.getElementById("cart-drawer");
const cartClose = document.getElementById("cart-close");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const heroCartBtn = document.getElementById("view-cart-from-hero");
const checkoutBtn = document.getElementById("checkout-btn");

const themeToggle = document.getElementById("theme-toggle");

/* === CART STATE (LOCALSTORAGE) === */
const CART_KEY = "neoncart_cart";
let cart = [];

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* === RENDER PRODUCTS (with <img> and lazy loading) === */
function renderProducts(items) {
  grid.innerHTML = "";

  items.forEach((p, index) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.style.opacity = "0";
    card.style.transform = "translateY(10px) scale(0.98)";

    // if image url present, use it; else use gradient placeholder div
    const imageHtml = p.image
      ? `<img class="product-thumb"
               src="${p.image}"
               alt="${p.name}"
               loading="lazy" />`
      : `<div class="product-thumb" aria-hidden="true"></div>`;

    card.innerHTML = `
      ${imageHtml}
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-meta">Category · ${p.category}</p>
        <div class="price-row">
          <span class="price">₹${p.price.toLocaleString()}</span>
          <span class="rating">${p.rating.toFixed(1)} ★</span>
        </div>
      </div>
      <button class="btn primary add-btn"><span>Add to Cart</span></button>
    `;

    const btn = card.querySelector(".add-btn");
    btn.addEventListener("click", () => {
      addToCart(p.id);
      openCart(); // open cart immediately when adding
    });

    grid.appendChild(card);

    // staggered reveal animation
    setTimeout(() => {
      card.style.transition =
        "opacity 0.28s ease, transform 0.28s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0) scale(1)";
    }, index * 60);
  });
}

/* === FILTER + SORT === */
function applyFilters() {
  const cat = filterSelect.value;
  const q = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;

  let result = products.filter((p) => {
    const matchCat = cat === "all" || p.category === cat;
    const matchSearch = p.name.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (sort === "price-asc") {
    result = result.slice().sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result = result.slice().sort((a, b) => b.price - a.price);
  } else if (sort === "rating-desc") {
    result = result.slice().sort((a, b) => b.rating - a.rating);
  }

  renderProducts(result);
}

/* === CART LOGIC === */
function addToCart(id) {
  const item = cart.find((c) => c.id === id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
}

function updateQty(id, delta) {
  cart = cart
    .map((item) =>
      item.id === id ? { ...item, qty: item.qty + delta } : item
    )
    .filter((item) => item.qty > 0);
  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((entry) => {
    const product = products.find((p) => p.id === entry.id);
    if (!product) return;
    const lineTotal = product.price * entry.qty;
    total += lineTotal;
    count += entry.qty;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-name">${product.name}</div>
      <div class="cart-qty">
        <button class="qty-btn" data-type="dec">−</button>
        <span>${entry.qty}</span>
        <button class="qty-btn" data-type="inc">+</button>
      </div>
      <div class="cart-meta">₹${product.price.toLocaleString()} each</div>
      <div class="cart-meta" style="text-align:right;">
        ₹${lineTotal.toLocaleString()}
      </div>
    `;

    row
      .querySelector("[data-type='dec']")
      .addEventListener("click", () => updateQty(entry.id, -1));
    row
      .querySelector("[data-type='inc']")
      .addEventListener("click", () => updateQty(entry.id, 1));

    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = `₹${total.toLocaleString()}`;
  cartCountEl.textContent = count;
}

/* === CART DRAWER === */
function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

/* === THEME TOGGLE === */
function initTheme() {
  const saved = localStorage.getItem("neoncart_theme");
  if (saved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  if (next === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem("neoncart_theme", next);
}

/* === EVENTS === */
filterSelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
searchInput.addEventListener("input", () => {
  window.requestAnimationFrame(applyFilters);
});

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
heroCartBtn.addEventListener("click", openCart);

// close when clicking dark overlay
cartDrawer.addEventListener("click", (e) => {
  if (e.target === cartDrawer) closeCart();
});

checkoutBtn.addEventListener("click", () => {
  alert("Demo checkout only – no real payment.");
});

themeToggle.addEventListener("click", toggleTheme);

/* === INIT === */
initTheme();
loadCart();
applyFilters();
renderCart();
