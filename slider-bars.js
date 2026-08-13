(function installCardSliderBars(){
  const mobileQuery=window.matchMedia('(max-width:600px)');
  const selectors=['.product-rail','.love-rail','.recommend-grid','.category-grid','[data-card-slider]'];
  const registry=new Map();

  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

  function getOrCreateBar(rail){
    let bar=rail.nextElementSibling?.classList.contains('rail-scroll')?rail.nextElementSibling:null;
    if(!bar){
      bar=document.createElement('div');
      bar.className='tp-slider-bar';
      bar.setAttribute('aria-hidden','true');
      bar.innerHTML='<span></span>';
      rail.insertAdjacentElement('afterend',bar);
    }else{
      bar.classList.add('tp-slider-bar');
      if(!bar.querySelector('span'))bar.innerHTML='<span></span>';
    }
    return bar;
  }

  function update(rail){
    const bar=registry.get(rail);
    if(!bar)return;
    const overflow=Math.max(0,rail.scrollWidth-rail.clientWidth);
    const shouldShow=mobileQuery.matches&&overflow>2;
    bar.hidden=!shouldShow;
    if(!shouldShow)return;

    const thumb=bar.querySelector('span');
    const visibleRatio=clamp(rail.clientWidth/rail.scrollWidth,0,1);
    const width=Math.max(14,visibleRatio*100);
    const progress=overflow?clamp(rail.scrollLeft/overflow,0,1):0;
    thumb.style.width=`${width}%`;
    thumb.style.left=`${progress*(100-width)}%`;
  }

  function register(rail){
    if(registry.has(rail))return;
    const bar=getOrCreateBar(rail);
    registry.set(rail,bar);
    rail.addEventListener('scroll',()=>update(rail),{passive:true});
    bar.addEventListener('click',event=>{
      if(!mobileQuery.matches)return;
      const rect=bar.getBoundingClientRect();
      const ratio=clamp((event.clientX-rect.left)/rect.width,0,1);
      rail.scrollTo({left:ratio*(rail.scrollWidth-rail.clientWidth),behavior:'smooth'});
    });
    update(rail);
  }

  function scan(){
    document.querySelectorAll(selectors.join(',')).forEach(register);
    registry.forEach((_,rail)=>update(rail));
  }

  scan();
  window.addEventListener('load',scan,{once:true});
  window.addEventListener('resize',()=>requestAnimationFrame(scan),{passive:true});
  mobileQuery.addEventListener?.('change',scan);

  const observer=new MutationObserver(()=>requestAnimationFrame(scan));
  observer.observe(document.body,{childList:true,subtree:true});
})();
