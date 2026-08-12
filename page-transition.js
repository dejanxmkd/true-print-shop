(function installPageTransition(){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const overlay=document.createElement('div');
  overlay.className='page-transition';
  overlay.setAttribute('aria-hidden','true');
  document.body.appendChild(overlay);

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.documentElement.classList.add('page-transition-ready');
  }));

  window.addEventListener('pageshow',()=>{
    document.documentElement.classList.remove('page-transition-leaving');
    document.documentElement.classList.add('page-transition-ready');
  });

  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(link.hasAttribute('download')||link.target==='_blank')return;

    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:'))return;

    const next=new URL(link.href,location.href);
    if(next.origin!==location.origin)return;
    if(next.pathname===location.pathname&&next.search===location.search&&next.hash)return;
    if(reduceMotion.matches)return;

    event.preventDefault();
    document.documentElement.classList.remove('page-transition-ready');
    document.documentElement.classList.add('page-transition-leaving');
    window.setTimeout(()=>{ location.href=next.href; },430);
  });
})();
