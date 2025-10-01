
const products = [
  {id:1, name:"Organic Apples", category:"groceries", price:120, rating:4, desc:"Fresh farm organic apples.", img:"images/apples.jpg"},
  {id:2, name:"LED Bulb", category:"electricals", price:80, rating:5, desc:"Energy saving LED bulb.", img:"images/bulb.jpg"},
  {id:3, name:"Vacuum Cleaner", category:"household", price:3500, rating:4, desc:"High power vacuum cleaner.", img:"images/vacuum.jpg"},
  {id:4, name:"Rice Bag 10kg", category:"groceries", price:600, rating:5, desc:"Premium quality rice.", img:"images/ricebag.jpg"},
  {id:5, name:"Mixer Grinder", category:"electricals", price:2500, rating:4, desc:"3-in-1 Mixer Grinder.", img:"images/mixer.jpg"},
  {id:6, name:"Dish Soap", category:"household", price:50, rating:3, desc:"Lemon fresh dish soap.", img:"images/dishsoap.jpg"},
  {id:7, name:"Bananas (1kg)", category:"groceries", price:60, rating:4, desc:"Fresh and ripe bananas.", img:"images/bananas.jpg"},
  {id:8, name:"Smartphone Charger", category:"electricals", price:450, rating:5, desc:"Fast charging USB-C charger.", img:"images/charger.jpg"},
  {id:9, name:"Laundry Detergent", category:"household", price:180, rating:4, desc:"Effective stain remover detergent.", img:"images/detergent.jpg"},
  {id:10, name:"Brown Bread", category:"groceries", price:40, rating:3, desc:"Healthy whole grain brown bread.", img:"images/bread.jpg"},
  {id:11, name:"Table Lamp", category:"electricals", price:900, rating:4, desc:"Stylish desk table lamp.", img:"images/tablelamp.jpg"},
  {id:12, name:"Ceiling Fan", category:"electricals", price:2200, rating:5, desc:"Energy efficient ceiling fan.", img:"images/fan.jpg"},
  {id:13, name:"Cooking Oil 1L", category:"groceries", price:150, rating:5, desc:"Pure sunflower cooking oil.", img:"images/cookingoil.jpg"},
  {id:14, name:"Floor Cleaner", category:"household", price:120, rating:4, desc:"Liquid floor cleaner for sparkling floors.", img:"images/floorcleaner.jpg"},
  {id:15, name:"Cheese Pack", category:"groceries", price:250, rating:4, desc:"Organic cheddar cheese pack.", img:"images/cheese.jpg"},
  {id:16, name:"Hair Dryer", category:"electricals", price:1500, rating:4, desc:"Compact hair dryer with heat settings.", img:"images/hairdryer.jpg"}
];


let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentProducts = [...products]; // Tracks currently displayed products


function displayProducts(list){
  const container = document.getElementById('product-carousel');
  container.innerHTML = '';
  list.forEach(p=>{
    container.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
        <p class="rating">${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</p>
        <p>${p.desc}</p>
        <button onclick="addToCart(${p.id})">🛒 Add to Cart</button>
        <button onclick="addToWishlist(${p.id})">❤️ Wishlist</button>
        <button onclick="viewDetails(${p.id})">ℹ️ Details</button>
      </div>`;
  });
  currentProducts = list; 
  updateDashboard();
  renderCartSidebar();
  renderWishlistSidebar();
}


function addToCart(id){
  cart.push(id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateDashboard();
  renderCartSidebar();
}

function addToWishlist(id){
  if(!wishlist.includes(id)) wishlist.push(id);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateDashboard();
  renderWishlistSidebar();
}

function removeFromCart(id){
  cart = cart.filter(item => item !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateDashboard();
  renderCartSidebar();
}

function removeFromWishlist(id){
  wishlist = wishlist.filter(item => item !== id);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateDashboard();
  renderWishlistSidebar();
}

function updateDashboard(){
  document.getElementById('cart-count').textContent = `🛒 ${cart.length}`;
  document.getElementById('wishlist-count').textContent = `❤️ ${wishlist.length}`;
}


function renderCartSidebar(){
  const cartContainer = document.getElementById('cart-items');
  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach(id=>{
    const p = products.find(pr=>pr.id===id);
    total += p.price;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <p>${p.name} - ₹${p.price}</p>
        <button class="remove-btn" onclick="removeFromCart(${p.id})">❌ Remove</button>
      </div>`;
  });

  document.getElementById('sidebar-total').textContent = total;

  const cartSidebar = document.getElementById('cart-sidebar');

  
  const oldOrderBtn = document.getElementById('order-btn');
  if(oldOrderBtn) oldOrderBtn.remove();
  const oldPaymentBtn = document.getElementById('payment-btn');
  if(oldPaymentBtn) oldPaymentBtn.remove();

  if(cart.length > 0){
    
    const orderBtn = document.createElement('button');
    orderBtn.id = 'order-btn';
    orderBtn.className = 'order-btn';
    orderBtn.textContent = '✅ Place Order';
    orderBtn.onclick = placeOrder;
    cartSidebar.appendChild(orderBtn);

    
    const paymentBtn = document.createElement('button');
    paymentBtn.id = 'payment-btn';
    paymentBtn.className = 'payment-btn';
    paymentBtn.textContent = '💳 Pay Now';
    paymentBtn.style.marginTop = '0.5rem';
    paymentBtn.onclick = payNow;
    cartSidebar.appendChild(paymentBtn);
  }
}


function placeOrder(){
  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  let orderedProducts = cart.map(id=>{
    const p = products.find(pr=>pr.id===id);
    return `${p.name} - ₹${p.price}`;
  }).join('\n');

  let totalPrice = cart.reduce((sum,id)=>sum + products.find(p=>p.id===id).price,0);

  alert(`🎉 Order Placed Successfully!\n\nOrdered Items:\n${orderedProducts}\n\nTotal: ₹${totalPrice}`);

  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateDashboard();
  renderCartSidebar();
}


function payNow(){
  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  let totalPrice = cart.reduce((sum,id)=>sum + products.find(p=>p.id===id).price,0);

  let confirmPayment = confirm(`💰 Total Amount: ₹${totalPrice}\n\nDo you want to proceed with payment?`);
  if(confirmPayment){
    alert("🎉 Payment Successful! Thank you for your purchase.");
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateDashboard();
    renderCartSidebar();
  } else {
    alert("Payment cancelled.");
  }
}


function renderWishlistSidebar(){
  const wishContainer = document.getElementById('wishlist-items');
  wishContainer.innerHTML = '';
  wishlist.forEach(id=>{
    const p = products.find(pr=>pr.id===id);
    wishContainer.innerHTML += `
      <div class="wishlist-item">
        <img src="${p.img}" alt="${p.name}">
        <p>${p.name} - ₹${p.price}</p>
        <button class="remove-btn" onclick="removeFromWishlist(${p.id})">❌ Remove</button>
      </div>`;
  });
}


function toggleCartSidebar(){ document.getElementById('cart-sidebar').classList.toggle('active'); }
function toggleWishlistSidebar(){ document.getElementById('wishlist-sidebar').classList.toggle('active'); }


function viewDetails(id){
  const p = products.find(pr=>pr.id===id);
  document.getElementById('modal-body').innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.img}" alt="${p.name}">
    <p>Price: ₹${p.price}</p>
    <p>Rating: ${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</p>
    <p>${p.desc}</p>`;

  document.getElementById('reviews').innerHTML = `
    <h3>Reviews</h3>
    <p>⭐⭐⭐⭐☆ - "Good quality product!" - Priya</p>
    <p>⭐⭐⭐⭐⭐ - "Value for money!" - Rajesh</p>`;

  document.getElementById('product-modal').style.display = 'flex';
}

function closeModal(){ document.getElementById('product-modal').style.display = 'none'; }


function filterByCategory(){
  const cat = document.getElementById('categoryFilter').value;
  let filtered = cat ? products.filter(p => p.category === cat) : [...products];


  const searchVal = document.getElementById('search').value.toLowerCase();
  if(searchVal) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal));

  displayProducts(filtered);
}

function sortProducts(){
  const val = document.getElementById('sort').value;
  let sorted = [...currentProducts]; 

  if(val==='priceLow') sorted.sort((a,b)=>a.price-b.price);
  else if(val==='priceHigh') sorted.sort((a,b)=>b.price-a.price);
  else if(val==='name') sorted.sort((a,b)=>a.name.localeCompare(b.name));

  displayProducts(sorted);
}

document.getElementById('search').addEventListener('input', function(){
  const val = this.value.toLowerCase();
  let filtered = products.filter(p=>p.name.toLowerCase().includes(val));


  const cat = document.getElementById('categoryFilter').value;
  if(cat) filtered = filtered.filter(p => p.category === cat);

  displayProducts(filtered);
});


document.getElementById('darkModeBtn').addEventListener('click', function(){
  document.body.classList.toggle('dark-mode');
});


displayProducts(products);
