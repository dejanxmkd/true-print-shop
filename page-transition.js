(function installPageTransition(){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey='trueprint:page-transition';
  const duration=520;
  const easing='cubic-bezier(.65,0,.35,1)';
  let leaving=false;
  let activeAnimation=null;

  const overlay=document.createElement('div');
  overlay.className='page-transition';
  overlay.setAttribute('aria-hidden','true');

  const setPosition=value=>{
    overlay.style.transform=`translate3d(0,${value},0)`;
  };

  const animate=(from,to)=>{
    activeAnimation?.cancel?.();
    setPosition(from);
    activeAnimation=overlay.animate(
      [
        {transform:`translate3d(0,${from},0)`},
        {transform:`translate3d(0,${to},0)`}
      ],
      {duration,easing,fill:'forwards'}
    );
    return activeAnimation.finished.catch(()=>{});
  };

  let arriving=false;
  try{
    arriving=sessionStorage.getItem(storageKey)==='1';
    if(arriving)sessionStorage.removeItem(storageKey);
  }catch{}

  setPosition(arriving&&!reduceMotion.matches?'0%':'100%');
  document.body.appendChild(overlay);

  if(arriving&&!reduceMotion.matches){
    requestAnimationFrame(()=>requestAnimationFrame(()=>animate('0%','-100%')));
  }

  window.addEventListener('pageshow',event=>{
    if(!event.persisted)return;
    leaving=false;
    activeAnimation?.cancel?.();
    setPosition('100%');
  });

  const navigate=async href=>{
    if(leaving)return;
    leaving=true;

    if(reduceMotion.matches){
      location.assign(href);
      return;
    }

    try{sessionStorage.setItem(storageKey,'1');}catch{}
    await animate('100%','0%');
    location.assign(href);
  };

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
