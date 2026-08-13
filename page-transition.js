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