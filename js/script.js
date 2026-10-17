(function(){
  var cart={};
  function fmt(v){return 'R$ '+v.toFixed(2).replace('.',',');}
  var cartEl=document.getElementById('cart'),ov=document.getElementById('ov');
  function toggle(o){cartEl.classList.toggle('open',o);ov.classList.toggle('open',o);}
  document.getElementById('openCart').onclick=function(){toggle(true);};
  document.getElementById('closeCart').onclick=function(){toggle(false);};
  ov.onclick=function(){toggle(false);};
  function render(){
    var box=document.getElementById('items'),ids=Object.keys(cart),t=0,c=0;
    box.innerHTML='';
    if(!ids.length){box.innerHTML='<div class="empty">Seu carrinho está vazio.</div>';}
    ids.forEach(function(id){
      var it=cart[id];t+=it.price*it.q;c+=it.q;
      var r=document.createElement('div');r.className='row';
      r.innerHTML='<div class="n">'+it.name+'<small>'+(it.price>0?fmt(it.price):'Preço a definir')+'</small></div><div class="qty"><button data-a="-" data-id="'+id+'">−</button><b>'+it.q+'</b><button data-a="+" data-id="'+id+'">+</button></div>';
      box.appendChild(r);
    });
    document.getElementById('count').textContent=c;
    document.getElementById('total').textContent=fmt(t);
  }
  document.getElementById('items').onclick=function(e){
    var b=e.target.closest('button');if(!b)return;
    var id=b.getAttribute('data-id');
    if(b.getAttribute('data-a')==='+')cart[id].q++;else if(--cart[id].q<=0)delete cart[id];
    render();
  };
  [].forEach.call(document.querySelectorAll('.add'),function(btn){
    btn.onclick=function(){
      var s=btn.closest('[data-id]'),id=s.dataset.id;
      if(cart[id])cart[id].q++;else cart[id]={name:s.dataset.name,price:parseFloat(s.dataset.price),q:1};
      render();toggle(true);
    };
  });
  var nav=document.getElementById('nav');
  document.getElementById('menuBtn').onclick=function(){nav.classList.toggle('open');};
  [].forEach.call(nav.querySelectorAll('a'),function(a){a.onclick=function(){nav.classList.remove('open');};});
  var fbKey='fb-sr-sra-batata',fbs=[],stars=0;
  try{fbs=JSON.parse(localStorage.getItem(fbKey)||'[]');}catch(e){fbs=[];}
  var fbList=document.getElementById('fbList'),starBtns=[].slice.call(document.querySelectorAll('#stars button'));
  function paint(n){starBtns.forEach(function(b,k){b.classList.toggle('on',k<n);});}
  starBtns.forEach(function(b,k){b.onclick=function(){stars=k+1;paint(stars);};});
  function fbRender(){
    fbList.innerHTML='';
    if(!fbs.length){var e=document.createElement('div');e.className='fb-empty';e.textContent='Ainda não há feedbacks. Seja o primeiro a deixar o seu!';fbList.appendChild(e);return;}
    fbs.slice().reverse().forEach(function(f){
      var d=document.createElement('div');d.className='fb-item';
      var h=document.createElement('div'),n=document.createElement('b'),s=document.createElement('span');
      n.textContent=f.name;s.className='st';s.textContent='  '+'★'.repeat(f.stars)+'☆'.repeat(5-f.stars);
      h.appendChild(n);h.appendChild(s);
      var p=document.createElement('p');p.textContent=f.msg;
      d.appendChild(h);d.appendChild(p);fbList.appendChild(d);
    });
  }
  document.getElementById('fbForm').onsubmit=function(e){
    e.preventDefault();
    var name=document.getElementById('fbName').value.trim()||'Cliente',msg=document.getElementById('fbMsg').value.trim(),err=document.getElementById('fbErr');
    if(!msg||!stars){err.textContent='Escolha uma nota e escreva seu comentário.';return;}
    err.textContent='';
    fbs.push({name:name,stars:stars,msg:msg});
    try{localStorage.setItem(fbKey,JSON.stringify(fbs));}catch(x){}
    e.target.reset();stars=0;paint(0);fbRender();
  };
  fbRender();
  render();
})();
