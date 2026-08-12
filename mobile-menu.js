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

  function buildPanel(items,parentId=null){
    const id=`tp-mobile-panel-${panelId++}`;
    const rows=[];

    if(parentId!==null){
      rows.push(`<button class="tp-mobile-back" type="button" data-mobile-back="${esc(parentId)}"><i class="material-icons">arrow_back</i><span>Back</span></button>`);
    }

    items.forEach(item=>{
      if(item.children?.length){
        const childId=buildPanel(item.children,id);
        rows.push(`<div class="tp-mobile-parent-row"><a class="tp-mobile-link" href="${esc(item.href)}"><span>${esc(item.label)}</span></a><button class="tp-mobile-next" type="button" data-mobile-next="${esc(childId)}" aria-label="Open ${esc(item.label)} submenu"><i class="material-icons">chevron_right</i></button></div>`);
      }else{
        rows.push(`<a class="tp-mobile-link" href="${esc(item.href)}"><span>${esc(item.label)}</span></a>`);
      }
    });

    panels.push(`<section class="tp-mobile-panel${parentId===null?' is-current':''}" id="${id}" aria-hidden="${parentId===null?'false':'true'}"><div class="tp-mobile-panel-inner">${rows.join('')}</div></section>`);
    return id;
  }

  const rootId=buildPanel(tree);

  menu.innerHTML=`<div class="tp-mobile-menu-shell">${panels.join('')}</div>`;
  menu.dataset.mobileMenuEnhanced='true';
  menu.setAttribute('aria-label','Mobile navigation');
  menu.querySelector(`#${rootId}`)?.classList.add('is-current');

  function showPanel(id,direction='forward'){
    const current=menu.querySelector('.tp-mobile-panel.is-current');
    const next=menu.querySelector(`#${CSS.escape(id)}`);
    if(!next||next===current)return;

    menu.querySelectorAll('.tp-mobile-panel').forEach(panel=>{
      panel.classList.remove('is-current');
      panel.setAttribute('aria-hidden','true');
    });

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
        .tp-mobile-panel{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;opacity:0;visibility:hidden;pointer-events:none;transform:translate3d(100%,0,0);transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .18s ease,visibility .3s;will-change:transform}
        .tp-mobile-panel.is-current{opacity:1;visibility:visible;pointer-events:auto;transform:translate3d(0,0,0)}
        .tp-mobile-panel-inner{width:min(100%,760px);min-height:100%;margin:0 auto;padding:clamp(30px,5vh,54px) 22px 42px;display:flex;flex-direction:column;align-items:stretch}
        .tp-mobile-parent-row{width:100%;display:grid;grid-template-columns:minmax(0,1fr) 48px;align-items:center}
        .tp-mobile-link,.tp-mobile-back,.tp-mobile-next{margin:0;border:0!important;border-radius:0!important;background:transparent!important;color:#F5F1E8!important;box-shadow:none!important;text-decoration:none!important;transform:none!important;transition:none!important}
        .tp-mobile-link{width:100%;min-height:68px;padding:14px 0;display:flex!important;align-items:center!important;font-size:clamp(29px,5vw,46px)!important;line-height:.98!important;font-weight:900!important;letter-spacing:-.04em!important;text-transform:uppercase!important}
        .tp-mobile-link:hover,.tp-mobile-link:focus-visible{color:#F5F1E8!important;transform:none!important}
        .tp-mobile-next{width:48px;height:48px;padding:0;display:grid!important;place-items:center!important;cursor:pointer}
        .tp-mobile-next i{font-size:30px!important;color:#F5F1E8!important}
        .tp-mobile-back{width:max-content;min-height:44px;margin:0 0 18px;padding:0;display:flex!important;align-items:center!important;gap:8px;font-size:14px!important;line-height:1!important;font-weight:800!important;letter-spacing:.06em!important;text-transform:uppercase!important;cursor:pointer}
        .tp-mobile-back i{font-size:22px!important;color:#F5F1E8!important}
        .menu-tool[aria-expanded="true"]{background:#2457FF!important;color:#F5F1E8!important;border-color:#111!important}
      }
      @media(max-width:600px){
        .tp-mobile-panel-inner{padding:28px 16px 34px}
        .tp-mobile-parent-row{grid-template-columns:minmax(0,1fr) 44px}
        .tp-mobile-link{min-height:62px;padding:13px 0;font-size:24px!important}
        .tp-mobile-next{width:44px;height:44px}
      }
      @media(prefers-reduced-motion:reduce){.tp-mobile-panel{transition:none!important}}
    `;
    document.head.appendChild(style);
  }
})();