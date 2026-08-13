(function installContactForm(){
  const form=document.getElementById('contact-form');
  if(!form)return;

  document.querySelectorAll('.contact-field').forEach(field=>field.classList.add('account-field'));

  const title=document.querySelector('.contact-intro h1');
  const intro=document.querySelector('.contact-intro p');
  if(title)title.textContent='CONTACT US';
  if(intro){
    intro.innerHTML='<span>We\'re happy to answer questions or help you with returns.</span><span>Fill out the form below and our team will get back to you.</span>';
  }

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
