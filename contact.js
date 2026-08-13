(function installContactForm(){
  const form=document.getElementById('contact-form');
  if(!form)return;

  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;

    const button=form.querySelector('.contact-submit');
    const original=button.textContent;
    button.textContent='Message ready';
    button.disabled=true;

    if(window.TruePrintUI?.showToast){
      window.TruePrintUI.showToast('Thanks — your message is ready to be connected in Shopify.');
    }

    setTimeout(()=>{
      button.textContent=original;
      button.disabled=false;
    },2200);
  });
})();
