(function installTruePrintMobileMenu(){
  const menu=document.querySelector('.mobile-menu');
  const menuButton=document.querySelector('.menu-tool');
  if(!menu||!menuButton)return;

  const tree=[
    {label:'Bundles',href:'collection.html?category=bundles',children:[
      {label:'Lifetime Hats Bundles',href:'collection.html?category=hat-bundles'},
      {label:'Crew Neck Bundles',href:'collection.html?category=crew-neck-bundles'},
      {label:'Hoodie Bundles',href:'collection.html?category=hoodie-bundles'},
      {label:'T-Shirt Bundles',href:'collection.html?category=t-shirt-bundles'}
    ]},
    {label:'Custom Apparel',href:'collection.html?category=t-shirts',children:[
      {label:'T-Shirts',href:'collection.html?category=t-shirts',children:[
        {label:'Short Sleeve',href:'collection.html?category=short-sleeve'},
        {label:'Long Sleeve',href:'collection.html?category=long-sleeve'},
        {label:'Polos',href:'collection.html?category=polos'}
      ]},
      {label:'Sweatshirts',href:'collection.html?category=sweatshirts',children:[
        {label:'Hoodies',href:'collection.html?category=hoodies'},
        {label:'Crewnecks',href:'collection.html?category=crewnecks'},
        {label:'Zip Up Hoodies',href:'collection.html?category=zip-hoodies'},
        {label:'Quarter Zip Ups',href:'collection.html?category=quarter-zips'}
      ]},
      {label:'Sweatpants',href:'collection.html?category=sweatpants',children:[
        {label:'Joggers',href:'collection.html?category=joggers'}
      ]},
      {label:'Hats',href:'collection.html?category=hats',children:[
        {label:'Athletic Hats',href:'collection.html?category=athletic-hats'},
        {label:'Beanies',href:'collection.html?category=beanies'},
        {label:'Fitted Hats',href:'collection.html?category=fitted-hats'},
        {label:'Lifetime Hats',href:'collection.html?category=hats'},
        {label:'Mesh',href:'collection.html?category=mesh-hats'},
        {label:'Snapback',href:'collection.html?category=snapbacks'},
        {label:'Trucker Hats',href:'collection.html?category=trucker-hats'}
      ]},
      {label:'Jackets',href:'collection.html?category=jackets',children:[
        {label:'Jackets',href:'collection.html?category=jackets&q=jacket'},
        {label:'Vests',href:'collection.html?category=jackets&q=vest'}
      ]}
    ]},
    {label:'First Responders',href:'collection.html?category=first-responders',children:[
      {label:'T-Shirts',href:'collection.html?category=first-responders&q=t-shirt'},
      {label:'Job Shirts',href:'collection.html?category=first-responders&q=job'},
      {label:'Sweatshirts',href:'collection.html?category=first-responders&q=sweatshirt'},
      {label:'Hats',href:'collection.html?category=first-responders&q=hat'},
      {label:'Polos',href:'collection.html?category=first-responders&q=polo'},
      {label:'Jackets',href:'collection.html?category=first-responders&q=jacket'}
    ]},
    {label:'Safety',href:'collection.html?category=safety'},
    {label:'Blanks',href:'collection.html?category=blanks',children:[
      {label:'T-Shirts',href:'collection.html?category=blanks&q=tee'},
      {label:'Hoodies',href:'collection.html?category=blanks&q=hoodie'},
      {label:'Hats',href:'collection.html?category=blanks&q=hat'},
      {label:'Jacket',href:'collection.html?category=blanks&q=jacket'},
      {label:'Vest',href:'collection.html?category=blanks&q=vest'}
    ]},
    {label:'Merch',href:'collection.html?category=merch'},
    {label:'Contact Us',href:'info.html?page=contact'},
    {label:'Blog',href:'info.html?page=blog'}
  ];

  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const panels=[];
  let panelId=0;

  function buildPanel(items,title,parentId=null,parentTitle='Menu',parentHref=''){
    const id=`tp-mobile-panel-${panelId++}`;
    const rows=[];

    if(parentId!==null){
      rows.push(`<button class="tp-mobile-back" type="button" data-mobile-back="${esc(parentId)}"><i class="material-icons">arrow_back</i><span>${esc(parentTitle)}</span></button>`);
      if(parentHref)rows.push(`<a class="tp-mobile-view-all" href="${esc(parentHref)}">VIEW ALL ${esc(title)}<i class="material-icons">north_east</i></a>`);
    }

    items.forEach(item=>{
      if(item.children?.length){
        const childId=buildPanel(item.children,item.label,id,title,item.href);
        rows.push(`<button class="tp-mobile-link tp-mobile-parent" type="button" data-mobile-next="${esc(childId)}"><span>${esc(item.label)}</span><i class="material-icons">arrow_forward</i></button>`);
      }else{
        rows.push(`<a class="tp-mobile-link" href="${esc(item.href)}"><span>${esc(item.label)}</span><i class="material-icons">north_east</i></a>`);
      }
    });

    panels.push(`<section class="tp-mobile-panel${parentId===null?' is-current':''}" id="${id}" aria-hidden="${parentId===null?'false':'true'}"><div class="tp-mobile-panel-inner"><div class="tp-mobile-kicker">${esc(title)}</div>${rows.join('')}</div></section>`);
    return id;
  }

  const rootId=buildPanel(tree,'Menu');

  menu.innerHTML=`<div class="tp-mobile-menu-shell">${panels.join('')}</div>`;
  menu.dataset.mobileMenuEnhanced='true';
  menu.setAttribute('aria-label','Mobile navigation');
  menu.querySelector(`#${rootId}`)?.classList.add('is-current');

  function showPanel(id,direction='forward'){
    const current=menu.querySelector('.tp-mobile-panel.is-current');
    const next=menu.querySelector(`#${CSS.escape(id)}`);
    if(!next||next===current)return;

    menu.querySelectorAll('.tp-mobile-panel').forEach(panel=>{
      panel.classList.remove('is-current','is-left','is-right');
      panel.setAttribute('aria-hidden','true');
    });

    if(direction==='back')current?.classList.add('is-right');
    next.classList.add('is-current');
    next.setAttribute('aria-hidden','false');
    menu.scrollTop=0;
  }

  menu.addEventListener('click',event=>{
    const next=event.target.closest('[data-mobile-next]');
    if(next){event.preventDefault();showPanel(next.dataset.mobileNext,'forward');return;}

    const back=event.target.closest('[data-mobile-back]');
    if(back){event.preventDefault();showPanel(back.dataset.mobileBack,'back');return;}

    if(event.target.closest('a[href]')){
      document.body.classList.remove('menu-open');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden','true');
      menuButton.setAttribute('aria-expanded','false');
      const icon=menuButton.querySelector('i');
      if(icon)icon.textContent='menu';
    }
  });

  menuButton.addEventListener('click',()=>{
    if(menuButton.getAttribute('aria-expanded')==='true'){
      const root=menu.querySelector(`#${CSS.escape(rootId)}`);
      if(root&&!root.classList.contains('is-current'))setTimeout(()=>showPanel(rootId,'back'),180);
    }
  });

  if(!document.getElementById('tp-mobile-menu-style')){
    const style=document.createElement('style');
    style.id='tp-mobile-menu-style';
    style.textContent=`
      @media(max-width:1480px){
        .mobile-menu[data-mobile-menu-enhanced="true"]{padding:0!important;display:block!important;background:#2457FF!important;color:#F5F1E8!important;overflow:hidden!important;border:0!important}
        .mobile-menu[data-mobile-menu-enhanced="true"] .mobile-help,.mobile-menu[data-mobile-menu-enhanced="true"] .mobile-primary{display:none!important}
        .tp-mobile-menu-shell{position:relative;width:100%;height:100%;min-height:100%;overflow:hidden;background:#2457FF}
        .tp-mobile-panel{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;opacity:0;visibility:hidden;pointer-events:none;transform:translate3d(100%,0,0);transition:transform .34s cubic-bezier(.2,.8,.2,1),opacity .2s ease,visibility .34s;will-change:transform}
        .tp-mobile-panel.is-current{opacity:1;visibility:visible;pointer-events:auto;transform:translate3d(0,0,0)}
        .tp-mobile-panel-inner{width:min(100%,760px);min-height:100%;margin:0 auto;padding:clamp(32px,5vh,58px) 22px 48px;display:flex;flex-direction:column;align-items:stretch}
        .tp-mobile-kicker{margin:0 0 26px;color:#F5F1E8;font-size:13px;line-height:1;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.66}
        .tp-mobile-link,.tp-mobile-back,.tp-mobile-view-all{width:100%;margin:0;padding:17px 0;border:0!important;border-bottom:1px solid rgba(245,241,232,.28)!important;border-radius:0!important;background:transparent!important;color:#F5F1E8!important;box-shadow:none!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px;text-align:left;text-decoration:none!important;transform:none!important;transition:none!important;cursor:pointer}
        .tp-mobile-link{min-height:70px;font-size:clamp(29px,5vw,46px)!important;line-height:.98!important;font-weight:900!important;letter-spacing:-.04em!important;text-transform:uppercase!important}
        .tp-mobile-link i{flex:none;font-size:30px!important;color:#F5F1E8!important}
        .tp-mobile-link:hover,.tp-mobile-link:focus-visible{color:#F5F1E8!important;transform:none!important}
        .tp-mobile-back{justify-content:flex-start!important;min-height:48px;padding:0 0 22px!important;border-bottom:0!important;font-size:15px!important;font-weight:800!important;text-transform:uppercase!important;letter-spacing:.08em!important}
        .tp-mobile-back i{font-size:24px!important}
        .tp-mobile-view-all{min-height:52px;margin:0 0 14px;padding:0 0 18px!important;font-size:15px!important;line-height:1.1!important;font-weight:800!important;letter-spacing:.05em!important;text-transform:uppercase!important}
        .tp-mobile-view-all i{font-size:20px!important}
        .menu-tool[aria-expanded="true"]{background:#2457FF!important;color:#F5F1E8!important;border-color:#111!important}
      }
      @media(max-width:600px){.tp-mobile-panel-inner{padding:30px 16px 36px}.tp-mobile-kicker{margin-bottom:20px}.tp-mobile-link{min-height:64px;padding:15px 0;font-size:clamp(28px,9vw,40px)!important}}
      @media(prefers-reduced-motion:reduce){.tp-mobile-panel{transition:none!important}}
    `;
    document.head.appendChild(style);
  }
})();
