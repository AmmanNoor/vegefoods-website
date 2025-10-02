
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.querySelector('.menu-toggle');
  const navUL = document.querySelector('.nav ul');
  menuBtn.addEventListener('click', () => navUL.classList.toggle('show'));

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        const offset = 60; 
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({top, behavior:'smooth'});
        navUL.classList.remove('show');
      }
    });
  });



  let slideIndex = 0;
  const slides = document.querySelectorAll('.slide');
  const showSlide = (idx) => {
    slides.forEach(s=>s.classList.remove('active'));
    slides[(idx+slides.length)%slides.length].classList.add('active');
  };
  showSlide(slideIndex);
  document.querySelector('.hero-controls .next').addEventListener('click', ()=> showSlide(++slideIndex));
  document.querySelector('.hero-controls .prev').addEventListener('click', ()=> showSlide(--slideIndex));
  setInterval(()=>showSlide(++slideIndex), 6000);

  const offers = document.querySelectorAll('.offer');
  let offerIdx = 0;
  setInterval(()=> {
    offers.forEach(o=>o.classList.remove('active'));
    offers[++offerIdx % offers.length].classList.add('active');
  }, 5000);

  const filterBtns = document.querySelectorAll('.filter-btn');
  const productsGrid = document.getElementById('productsGrid');
  const productItems = productsGrid.querySelectorAll('.product');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      productItems.forEach(p=>{
        if(f === 'all' || p.dataset.type.includes(f)) p.style.display = '';
        else p.style.display = 'none';
      });
    });
  });
  document.getElementById('searchInput').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase();
    productItems.forEach(p=>{
      const name = p.dataset.name.toLowerCase();
      p.style.display = name.includes(q) ? '' : 'none';
    });
  });

  const cart = { items: [] };
  const cartBtn = document.querySelector('.cart-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.querySelector('.cart-count');
  const cartTotalEl = document.getElementById('cartTotal');

  function updateCartUI(){
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.items.forEach((it, i)=>{
      total += it.qty * it.price;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div style="flex:1">
          <strong>${it.name}</strong><div style="color:${getComputedStyle(document.documentElement).getPropertyValue('--muted')}">$${it.price.toFixed(2)} x ${it.qty}</div>
        </div>
        <div>
          <button data-remove="${i}" style="border:none;background:#eee;padding:6px;border-radius:6px;cursor:pointer">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });
    cartTotalEl.textContent = total.toFixed(2);
    cartCountEl.textContent = cart.items.reduce((s,i)=>s+i.qty,0);
  }

  document.querySelectorAll('.add-cart').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const card = e.target.closest('.product');
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      const qty = parseFloat(card.querySelector('.qty').value) || 1;
      const found = cart.items.find(it=>it.name===name);
      if(found) found.qty += qty;
      else cart.items.push({name, price, qty});
      updateCartUI();
      cartDrawer.classList.add('open');
    });
  });

  cartItemsEl.addEventListener('click', e=>{
    if(e.target.dataset.remove !== undefined){
      const idx = parseInt(e.target.dataset.remove,10);
      cart.items.splice(idx,1);
      updateCartUI();
    }
  });

  cartBtn.addEventListener('click', ()=> cartDrawer.classList.toggle('open'));
  document.querySelector('.close-cart').addEventListener('click', ()=>cartDrawer.classList.remove('open'));
  document.getElementById('checkoutBtn').addEventListener('click', ()=>{
    alert('Checkout not implemented in this demo. Total: $' + cartTotalEl.textContent);
  });

  (function renderChart(){
    const canvas = document.getElementById('salesChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const data = [12,18,9,14,22,20,16]; // kg - example
    const max = Math.max(...data);
    const padding = 40;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,w,h);
    const barW = (w - padding*2) / data.length * 0.6;
    data.forEach((val,i)=>{
      const x = padding + i * ((w - padding*2)/data.length) + ((w - padding*2)/data.length - barW)/2;
      const barH = (val / (max||1)) * (h - padding*2);
      const y = h - padding - barH;
      ctx.fillStyle = 'rgba(231,147,1,0.95)';
      ctx.fillRect(x,y,barW,barH);
      ctx.fillStyle = '#333';
      ctx.font = '14px Inter,Arial';
      ctx.fillText(val, x + barW/2 - 8, y - 6);
      ctx.fillText(labels[i], x + barW/2 - 10, h - padding + 18);
    });
  })();

  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('cname').value.trim();
    const email = document.getElementById('cemail').value.trim();
    const message = document.getElementById('cmessage').value.trim();
    if(!name || !email || !message) return alert('Please fill all fields.');
    alert('Thanks '+name+'! Message received.');
    this.reset();
  });

  document.getElementById('subscribeBtn').addEventListener('click', ()=>{
    const email = document.getElementById('subscribeEmail').value.trim();
    if(!email) return alert('Enter email');
    alert('Subscribed: ' + email);
    document.getElementById('subscribeEmail').value='';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
});
let seconds = 0;

function updateCountdown() {
  document.getElementById("days").innerText = 209817;
  document.getElementById("hours").innerText = 48;
  document.getElementById("minutes").innerText = 28;

  seconds++;
  if (seconds > 59) seconds = 1;

  document.getElementById("seconds").innerText = seconds;
}

setInterval(updateCountdown, 1000);




document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.testimonials-section');
  if(!section) return;
  const track = section.querySelector('.testimonials-track');
  const items = Array.from(track.children);
  const dotsWrap = section.querySelector('.testimonials-dots');

  let itemsPerView = getItemsPerView();
  updateCSSVar(itemsPerView);
  let pages = Math.ceil(items.length / itemsPerView);
  let currentPage = 0;
  let autoplayTimer = null;

  buildDots();
  goTo(0);
  startAutoplay();

  let rTO;
  window.addEventListener('resize', () => {
    clearTimeout(rTO);
    rTO = setTimeout(() => {
      const newItems = getItemsPerView();
      if(newItems !== itemsPerView) {
        itemsPerView = newItems;
        updateCSSVar(itemsPerView);
        pages = Math.ceil(items.length / itemsPerView);
        if(currentPage >= pages) currentPage = pages - 1;
        buildDots();
        goTo(currentPage);
      }
    }, 120);
  });

 
  function getItemsPerView(){
    const w = window.innerWidth;
    if (w >= 992) return 3;
    if (w >= 768) return 2;
    return 1;
  }
  function updateCSSVar(n){
    document.documentElement.style.setProperty('--t-items', n);
  }

  function buildDots(){
    dotsWrap.innerHTML = '';
    for(let i=0;i<pages;i++){
      const b = document.createElement('button');
      b.className = 'dot';
      b.setAttribute('aria-label', `Show testimonials page ${i+1}`);
      if(i===0) b.classList.add('active');
      b.addEventListener('click', () => {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(b);
    }
  }

  function goTo(page){
    currentPage = Math.max(0, Math.min(page, pages - 1));
    track.style.transform = `translateX(-${currentPage * 100}%)`;
    Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle('active', idx === currentPage));
  }

  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goTo( (currentPage + 1) % pages );
    }, 4500);
    section.addEventListener('mouseenter', stopAutoplay);
    section.addEventListener('mouseleave', startAutoplay);
  }
  function stopAutoplay(){
    if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  function restartAutoplay(){ stopAutoplay(); startAutoplay(); }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletterForm');
  const emailField = document.getElementById('emailField');
  function showSuccess(msg) {
    const old = document.querySelector('.newsletter-success');
    if (old) old.remove();
    const p = document.createElement('div');
    p.className = 'newsletter-success';
    p.textContent = msg;

    const wrap = document.querySelector('.newsletter-inner');
    wrap.appendChild(p);
    setTimeout(()=> p.remove(), 4000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = emailField.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!ok) {
      showSuccess('Please enter a valid email address.');
      return;
    }
    showSuccess('Thanks for subscribing! Check your email for confirmation.');
    form.reset();
  });

  const toTop = document.getElementById('toTop');
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});