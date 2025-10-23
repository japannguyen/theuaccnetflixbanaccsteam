// app.js - logic chung (localStorage based)
function $(s){return document.querySelector(s);}
function $all(s){return Array.from(document.querySelectorAll(s));}
function save(k,v){localStorage.setItem(k,JSON.stringify(v));}
function load(k){return JSON.parse(localStorage.getItem(k)||'null');}
function nowISO(){return new Date().toISOString();}
function addDays(dateISO,days){const d=new Date(dateISO);d.setDate(d.getDate()+days);return d.toISOString();}
function formatDate(iso){ if(!iso) return '-'; return new Date(iso).toLocaleDateString(); }

// AUTH
function authRegisterOrLogin(email,pass){
  const users = load('users') || {};
  if(users[email]){
    if(users[email]===pass){ localStorage.setItem('currentUser', email); return {ok:true,msg:'Đăng nhập thành công'} }
    else return {ok:false,msg:'Sai mật khẩu'};
  } else {
    users[email]=pass; save('users',users); localStorage.setItem('currentUser', email);
    return {ok:true,msg:'Đăng ký & đăng nhập thành công'};
  }
}
function currentUser(){ return localStorage.getItem('currentUser') || null; }
function logout(){ localStorage.removeItem('currentUser'); }

// CART
function getCart(){ return load('cart') || []; }
function saveCart(c){ save('cart', c); }
function addToCart(item){ const c = getCart(); c.push(item); saveCart(c); }
function clearCart(){ localStorage.removeItem('cart'); }

// ORDERS
function getOrders(){ return load('orders') || []; }
function saveOrders(a){ save('orders', a); }
function createOrdersFromCart(){
  const user = currentUser();
  if(!user) return {ok:false,msg:'Bạn cần đăng nhập để thanh toán'};
  const cart = getCart();
  if(!cart || cart.length===0) return {ok:false,msg:'Giỏ hàng trống'};
  const orders = getOrders();
  cart.forEach(item=>{
    const createdISO = nowISO();
    let startISO = createdISO;
    let endISO = null;
    if(item.durationDays) endISO = addDays(startISO, item.durationDays);
    orders.push({
      id: 'ORD'+Date.now()+Math.floor(Math.random()*90),
      userEmail: user,
      name: item.name,
      price: item.price,
      startISO,startISO,
      endISO,
      createdISO
    });
  });
  saveOrders(orders);
  clearCart();
  return {ok:true,msg:'Thanh toán thành công, đơn hàng đã lưu.'};
}

// NAV UI
function updateNavUI(){
  const user = currentUser();
  $all('.nav-username').forEach(el=>{
    if(user){ el.textContent = 'Xin chào, '+user; el.style.display='inline-block'; }
    else { el.textContent=''; el.style.display='none'; }
  });
  $all('.nav-login').forEach(el=> el.style.display = user ? 'none' : 'inline-block');
  $all('.nav-logout').forEach(el=> el.style.display = user ? 'inline-block' : 'none');
  $all('#cart-count').forEach(el=> el.textContent = getCart().length);
}

function getOrdersByEmail(email){
  const orders = getOrders();
  return orders.filter(o=>o.userEmail === email);
}

// expose
window.app = {
  authRegisterOrLogin, currentUser, logout,
  addToCart, getCart, saveCart, clearCart,
  createOrdersFromCart, getOrdersByEmail, getOrders, updateNavUI, formatDate
};
