(function installStorefrontRefresh(){
  const navItems=[
    ['Hats','collection.html?category=hats'],
    ['T-Shirts','collection.html?category=t-shirts'],
    ['Sweats','collection.html?category=sweatshirts'],
    ['Jackets','collection.html?category=jackets'],
    ['Safety','collection.html?category=safety'],
    ['Contact Us','contact.html']
  ];

  const apply=()=>{
    const desktopNav=document.querySelector('.desktop-nav');
    if(desktopNav){
      const expected=navItems.map(([label,href])=>`<div class="nav-item"><a href="${href}">${label}</a></div>`).join('');
      if(desktopNav.dataset.storefrontRefresh!=='true'||desktopNav.innerHTML!==expected){
        desktopNav.innerHTML=expected;
        desktopNav.dataset.storefrontRefresh='true';
      }
    }

    if(!document.getElementById('storefront-refresh-style')){
      const style=document.createElement('style');
      style.id='storefront-refresh-style';
      style.textContent=`html body .site-header .brand-logo{background:#111111!important}`;
      document.head.appendChild(style);
    }

    document.querySelectorAll('.hero .button-row a').forEach(link=>{
      if(link.textContent.trim().toLowerCase()!=='start your design')link.remove();
    });

    const categoryGrid=document.querySelector('#categories .category-grid');
    if(categoryGrid&&categoryGrid.dataset.storefrontRefresh!=='true'){
      const wanted=[
        ['hats','Hats'],
        ['polos','Polos & Business Wear'],
        ['sweatshirts','Sweatshirts'],
        ['t-shirts','T-Shirts']
      ];
      const cards=[...categoryGrid.querySelectorAll('.category')];
      const byCategory=new Map(cards.map(card=>{
        const match=(card.getAttribute('href')||'').match(/[?&]category=([^&]+)/);
        return [match?.[1]||'',card];
      }));
      cards.forEach(card=>card.remove());
      wanted.forEach(([category,label])=>{
        const card=byCategory.get(category);
        if(!card)return;
        const text=card.querySelector('span');
        if(text)text.textContent=label;
        categoryGrid.appendChild(card);
      });
      categoryGrid.dataset.storefrontRefresh='true';
    }

    const hatsSection=document.querySelector('#bundles');
    if(hatsSection){
      const title=hatsSection.querySelector('.heading-row h2');
      if(title)title.textContent='Shop Hats';
      const tabs=hatsSection.querySelector('.tabs');
      if(tabs&&tabs.dataset.storefrontRefresh!=='true'){
        tabs.innerHTML='<button class="active" data-filter="hats">Hats</button>';
        tabs.dataset.storefrontRefresh='true';
      }
      hatsSection.querySelectorAll('#bundle-products article').forEach(card=>card.hidden=card.dataset.category!=='hats');
      hatsSection.querySelector('.heading-row>a')?.setAttribute('href','collection.html?category=hats');
      hatsSection.querySelector('.section-button')?.setAttribute('href','collection.html?category=hats');
    }

    const teesSection=document.querySelector('#responders');
    if(teesSection){
      const title=teesSection.querySelector('.heading-row h2');
      if(title)title.textContent='Shop T-Shirts';
      const tabs=teesSection.querySelector('.tabs');
      if(tabs&&tabs.dataset.storefrontRefresh!=='true'){
        tabs.innerHTML='<button class="active" data-filter="tees">T-Shirts</button>';
        tabs.dataset.storefrontRefresh='true';
      }
      teesSection.querySelectorAll('#responder-products article').forEach(card=>card.hidden=card.dataset.category!=='tees');
      teesSection.querySelector('.heading-row>a')?.setAttribute('href','collection.html?category=t-shirts');
      teesSection.querySelector('.section-button')?.setAttribute('href','collection.html?category=t-shirts');
    }
  };

  apply();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  setTimeout(apply,120);
})();

(function installSharedInfoRoutes(){
  const blogSlugs=['custom-apparel','embroidery-caps','logo-sizing','uniform-system','screen-print-vs-embroidery','blank-tshirt','logo-colors','station-apparel','apparel-bundles','garment-care','before-production'];
  const apply=()=>{
    document.querySelectorAll('a').forEach(link=>{
      const label=link.textContent.trim().toLowerCase();
      if(label==='contact us')link.setAttribute('href','contact.html');
      if(label==='blog')link.setAttribute('href','blog.html');
    });
    if(document.querySelector('.blog-page')){
      document.querySelectorAll('.blog-main-card,.blog-side-card,.blog-grid>.blog-card').forEach((link,index)=>{
        const slug=blogSlugs[index];
        if(slug)link.setAttribute('href',`article.html?slug=${slug}`);
      });
    }
  };
  apply();
  const observer=new MutationObserver(apply);
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();

(function loadSharedMobileMenu(){
  if(document.querySelector('script[data-mobile-menu]'))return;
  const script=document.createElement('script');
  script.src='mobile-menu.js';
  script.dataset.mobileMenu='';
  document.head.appendChild(script);
})();

(function loadSharedSliderBars(){
  if(document.querySelector('script[data-slider-bars]'))return;
  const script=document.createElement('script');
  script.src='slider-bars.js';
  script.dataset.sliderBars='';
  document.head.appendChild(script);
})();

(function loadSharedAccountModal(){
  if(document.querySelector('script[data-account-modal]'))return;
  const script=document.createElement('script');
  script.src='account-modal.js';
  script.dataset.accountModal='';
  document.head.appendChild(script);
})();

(function installPageTransition(){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const root=document.documentElement;
  const storageKey='trueprint:page-transition';
  const coverDuration=500;
  const revealDuration=560;
  const minimumHold=160;
  let leaving=false;
  let revealStarted=false;

  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

  const waitForLoad=()=>document.readyState==='complete'
    ? Promise.resolve()
    : new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));

  const waitForFonts=()=>{
    if(!document.fonts?.ready)return Promise.resolve();
    return Promise.race([document.fonts.ready,sleep(1400)]).catch(()=>{});
  };

  const waitForPseudoTransition=duration=>new Promise(resolve=>{
    let done=false;
    const finish=()=>{
      if(done)return;
      done=true;
      root.removeEventListener('transitionend',onEnd);
      clearTimeout(timer);
      resolve();
    };
    const onEnd=event=>{
      if(event.pseudoElement==='::before'&&event.propertyName==='transform')finish();
    };
    const timer=setTimeout(finish,duration+120);
    root.addEventListener('transitionend',onEnd);
  });

  const setState=state=>{
    root.classList.remove('tp-idle','tp-reset-bottom','tp-cover','tp-arriving','tp-reveal');
    if(state)root.classList.add(state);
  };

  let arriving=false;
  try{
    arriving=sessionStorage.getItem(storageKey)==='1';
    if(arriving)sessionStorage.removeItem(storageKey);
  }catch{}

  if(reduceMotion.matches)setState('tp-idle');
  else setState('tp-arriving');

  async function revealWhenReady({bfcache=false}={}){
    if(reduceMotion.matches||revealStarted)return;
    revealStarted=true;
    const started=performance.now();

    if(!bfcache){
      await waitForLoad();
      await waitForFonts();
    }

    const elapsed=performance.now()-started;
    if(elapsed<minimumHold)await sleep(minimumHold-elapsed);
    await nextFrame();

    setState('tp-reveal');
    await waitForPseudoTransition(revealDuration);
    setState('tp-idle');
  }

  revealWhenReady();

  window.addEventListener('pageshow',event=>{
    if(!event.persisted)return;
    leaving=false;
    revealStarted=false;
    if(reduceMotion.matches){
      setState('tp-idle');
      return;
    }
    setState('tp-arriving');
    revealWhenReady({bfcache:true});
  });

  const navigate=async href=>{
    if(leaving)return;
    leaving=true;

    if(reduceMotion.matches){
      location.assign(href);
      return;
    }

    setState('tp-reset-bottom');
    void root.offsetHeight;
    setState('tp-cover');
    await waitForPseudoTransition(coverDuration);

    try{sessionStorage.setItem(storageKey,'1');}catch{}
    location.assign(href);
  };

  const prefetch=link=>{
    if(!link||link.dataset.tpPrefetched==='1')return;
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:'))return;
    const next=new URL(link.href,location.href);
    if(next.origin!==location.origin)return;
    if(next.pathname===location.pathname&&next.search===location.search)return;
    const hint=document.createElement('link');
    hint.rel='prefetch';
    hint.href=next.href;
    hint.as='document';
    document.head.appendChild(hint);
    link.dataset.tpPrefetched='1';
  };

  document.addEventListener('pointerover',event=>prefetch(event.target.closest('a[href]')),{passive:true});
  document.addEventListener('focusin',event=>prefetch(event.target.closest('a[href]')));

  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(link.hasAttribute('download')||link.target==='_blank')return;

    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:'))return;

    const next=new URL(link.href,location.href);
    if(next.origin!==location.origin)return;
    if(next.pathname===location.pathname&&next.search===location.search&&next.hash)return;

    event.preventDefault();
    navigate(next.href);
  });

  window.TruePrintPageTransition={navigate};
})();