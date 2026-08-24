(function installTruePrintMobileMenu(){
  const menu=document.querySelector('.mobile-menu');
  const menuButton=document.querySelector('.menu-tool');
  const header=document.querySelector('.site-header');
  if(!menu||!menuButton||!header)return;

  const items=[
    {label:'Hats',href:'collection.html?category=hats'},
    {label:'T-Shirts',href:'collection.html?category=t-shirts'},
    {label:'Sweats',href:'collection.html?category=sweatshirts'},
    {label:'Jackets',href:'collection.html?category=jackets'},
    {label:'Safety',href:'collection.html?category=safety'},
    {label:'Contact us',href:'contact.html'}
  ];

  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[char]));

  menu.innerHTML=`<div class="tp-mobile-menu-shell"><nav class="tp-mobile-panel is-current" aria-label="Mobile navigation"><div class="tp-mobile-panel-inner">${items.map(item=>`<a class="tp-mobile-link" href="${esc(item.href)}"><span>${esc(item.label)}</span></a>`).join('')}</div></nav></div>`;
  menu.dataset.mobileMenuEnhanced='true';
  menu.setAttribute('aria-label','Mobile navigation');

  function syncMenuPosition(){
    const height=Math.max(0,Math.round(header.getBoundingClientRect().height));
    document.documentElement.style.setProperty('--tp-mobile-header-height',`${height}px`);
    document.documentElement.style.setProperty('--tp-mobile-menu-top',`${height}px`);
  }

  menu.addEventListener('click',event=>{
    if(!event.target.closest('a[href]'))return;
    document.body.classList.remove('menu-open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden','true');
    menuButton.setAttribute('aria-expanded','false');
    const icon=menuButton.querySelector('i');
    if(icon)icon.textContent='menu';
  });

  menuButton.addEventListener('pointerdown',syncMenuPosition,{passive:true});
  menuButton.addEventListener('click',syncMenuPosition,true);
  window.addEventListener('resize',syncMenuPosition,{passive:true});
  window.addEventListener('orientationchange',()=>requestAnimationFrame(syncMenuPosition),{passive:true});
  window.visualViewport?.addEventListener('resize',syncMenuPosition,{passive:true});
  window.visualViewport?.addEventListener('scroll',syncMenuPosition,{passive:true});
  new ResizeObserver(syncMenuPosition).observe(header);
  syncMenuPosition();

  if(!document.getElementById('tp-mobile-menu-style')){
    const style=document.createElement('style');
    style.id='tp-mobile-menu-style';
    style.textContent=`
      @media(max-width:1480px){
        html body{padding-top:var(--tp-mobile-header-height,76px)!important}
        .site-header{
          position:fixed!important;
          top:0!important;
          right:0!important;
          left:0!important;
          width:100%!important;
          z-index:10001!important;
          transform:none!important;
        }
        .mobile-menu[data-mobile-menu-enhanced="true"]{
          position:fixed!important;
          z-index:10000!important;
          top:var(--tp-mobile-menu-top,76px)!important;
          right:0!important;
          bottom:0!important;
          left:0!important;
          width:100%!important;
          height:auto!important;
          padding:0!important;
          display:block!important;
          background:#2457FF!important;
          color:#F5F1E8!important;
          opacity:1!important;
          overflow:hidden!important;
          border:0!important;
        }
        .cart-backdrop{
          top:var(--tp-mobile-header-height,76px)!important;
          height:calc(100dvh - var(--tp-mobile-header-height,76px))!important;
        }
        .cart-drawer{
          top:var(--tp-mobile-header-height,76px)!important;
          bottom:0!important;
          height:calc(100dvh - var(--tp-mobile-header-height,76px))!important;
          max-height:calc(100dvh - var(--tp-mobile-header-height,76px))!important;
        }
        .tp-mobile-menu-shell{position:relative;width:100%;height:100%;min-height:100%;overflow:hidden;background:#2457FF!important}
        .tp-mobile-panel{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;background:#2457FF!important}
        .tp-mobile-panel-inner{width:min(100%,760px);min-height:100%;margin:0 auto;padding:clamp(30px,5vh,54px) 22px 42px;display:flex;flex-direction:column;align-items:stretch}
        .tp-mobile-link{width:100%;min-height:68px;padding:14px 0;display:flex!important;align-items:center!important;margin:0;border:0!important;border-radius:0!important;background:transparent!important;color:#F5F1E8!important;box-shadow:none!important;text-decoration:none!important;transform:none!important;transition:none!important;font-size:24px!important;line-height:1.05!important;font-weight:900!important;letter-spacing:-.03em!important;text-transform:uppercase!important}
        .tp-mobile-link:hover,.tp-mobile-link:focus-visible{color:#F5F1E8!important;transform:none!important}
        .menu-tool[aria-expanded="true"]{background:#2457FF!important;color:#F5F1E8!important;border-color:#111!important}
      }
      @media(max-width:600px){
        .tp-mobile-panel-inner{padding:28px 16px 34px}
        .tp-mobile-link{min-height:62px;padding:13px 0;font-size:24px!important}
      }
    `;
    document.head.appendChild(style);
  }
})();