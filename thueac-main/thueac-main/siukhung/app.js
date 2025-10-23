/* app.js - logic chung cho site (localStorage based) */

/* --- helpers --- */
function $(s){ return document.querySelector(s); }
function $all(s){ return Array.from(document.querySelectorAll(s)); }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key){ return JSON.parse(localStorage.getItem(key) || 'null'); }
function nowISO(){ return new Date().toISOString(); }
function addDays(dateISO, days){
  const d = new Date(dateISO);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
function formatDate(iso){
  if(!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString();
}

/* --- auth --- */
/* users stored as object: { email: password } in 'users' */
function authRegisterOrLogin(email, pass){
  const users = load('users') || {};
  if(users[email]){
    if(users[email] === pass){
      localStorage.setItem('currentUser', email);
      return { ok:true, msg:'Đăng nhập thành công' };
    }else return { ok:false, msg:'Sai mật khẩu' };
  } else {
    users[email] = pass;
    save('users', users);
    localStorage.setItem('currentUser', email);
    return { ok:true, msg:'Đăng ký & đăng nhập thành công' };
  }
}
function currentUser(){ return localStorage.getItem('currentUser') || null; }
function logout(){
  localStorage.removeItem('currentUser');
  // update UI when pages include updateNav()
}

/* --- cart --- */
/* cart array of items: { id, name, price, type, durationDays } */
function getCart(){ return load('cart') || []; }
function saveCart(arr){ save('cart', arr); }
function addToCart(item){
  const c = getCart();
  c.push(item);
  saveCart(c);
}
function clearCart(){ localStorage.removeItem('cart'); }

/* --- orders --- */
/* orders array: { id, userEmail, name, price, startISO, endISO, createdISO } */
function getOrders(){ return load('orders') || []; }
function saveOrders(arr){ save('orders', arr); }
function createOrdersFromCart(){
  const user = currentUser();
  const cart = getCart();
  if(!user) return { ok:false, msg:'Bạn cần đăng nhập để thanh toán' };
  if(cart.length === 0) return { ok:false, msg:'Giỏ hàng rỗng' };
  const orders = getOrders();
  cart.forEach(item => {
    const createdISO = nowISO();
    let startISO = createdISO;
    let endISO = null;
    if(item.durationDays) endISO = addDays(startISO, item.durationDays);
    orders.push({
      id: 'ORD' + Date.now() + Math.floor(Math.random()*90),
      userEmail: user,
      name: item.name,
      price: item.price,
      startISO, endISO, createdISO
    });
  });
  saveOrders(orders);
  clearCart();
  return { ok:true, msg:'Thanh toán thành công. Đơn hàng đã lưu.' };
}

/* --- navbar helper --- */
function updateNavUI(){
  const user = currentUser();
  $all('.nav-username').forEach(el=>{
    if(user){ el.textContent = 'Xin chào, ' + user; el.style.display='inline-block'; }
    else { el.textContent = ''; el.style.display='none'; }
  });
  $all('.nav-login').forEach(el=>{
    if(user) el.style.display='none'; else el.style.display='inline-block';
  });
  $all('.nav-logout').forEach(el=>{
    if(user) el.style.display='inline-block'; else el.style.display='none';
  });
  const count = getCart().length;
  $all('#cart-count').forEach(el=> el.textContent = count);
}

/* --- warranty query --- */
function getOrdersByEmail(email){
  const orders = getOrders();
  return orders.filter(o => o.userEmail === email);
}

/* --- expose on window for HTML to call --- */
window.app = {
  addToCart, getCart, clearCart, createOrdersFromCart,
  getOrdersByEmail, currentUser, authRegisterOrLogin,
  logout, updateNavUI, formatDate
};
