// =============== Đăng ký & đăng nhập ===============
function register() {
  const email = document.getElementById("registerEmail").value;
  const pass = document.getElementById("registerPassword").value;
  if (!email || !pass) return alert("Vui lòng nhập đủ thông tin!");
  localStorage.setItem("user_" + email, pass);
  alert("Đăng ký thành công!");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;
  const saved = localStorage.getItem("user_" + email);
  if (pass === saved) {
    localStorage.setItem("currentUser", email);
    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
  } else alert("Sai thông tin!");
}

// =============== Giỏ hàng ===============
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Đã thêm vào giỏ hàng!");
}

function loadCart() {
  const div = document.getElementById("cart-items");
  if (!div) return;
  div.innerHTML = "";
  if (cart.length === 0) return div.innerHTML = "<p>Giỏ hàng trống!</p>";

  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    div.innerHTML += `
      <div class="d-flex justify-content-between mb-2">
        <span>${item.name}</span>
        <span>${item.price.toLocaleString()}đ</span>
        <button class="btn btn-danger btn-sm" onclick="removeItem(${i})">X</button>
      </div>`;
  });
  div.innerHTML += `<hr><h5>Tổng: ${total.toLocaleString()}đ</h5>`;
}

function removeItem(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function checkout() {
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const qr = document.getElementById("qrImage");
  qr.src = `https://img.vietqr.io/image/970422-123456789-compact.png?amount=${total}&addInfo=Thanh%20toan%20VIP%20STORE`;
  document.getElementById("payment-section").classList.remove("d-none");
}

// =============== Bảo hành ===============
function checkWarranty() {
  const code = document.getElementById("orderCode").value;
  const result = document.getElementById("warrantyResult");
  if (!code) return alert("Vui lòng nhập mã đơn hàng hoặc email!");
  result.innerHTML = `
    <div class="alert alert-success mt-3">
      Mã <strong>${code}</strong> còn bảo hành đến <strong>31/12/2025</strong>.
    </div>`;
}

document.addEventListener("DOMContentLoaded", loadCart);
