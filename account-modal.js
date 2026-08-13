(function installAccountModal(){
  const buttons=[...document.querySelectorAll('.account-tool')];
  if(!buttons.length||document.querySelector('.account-modal'))return;

  document.body.insertAdjacentHTML('beforeend',`
    <div class="account-overlay" data-account-close aria-hidden="true"></div>
    <section class="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title" aria-hidden="true">
      <div class="account-modal-head">
        <h2 id="account-title">Sign in</h2>
        <button class="account-close" type="button" data-account-close aria-label="Close sign in"><i class="material-icons">close</i></button>
      </div>
      <form class="account-form">
        <label class="account-field"><span>Email address</span><input type="email" autocomplete="email" placeholder="you@example.com" required></label>
        <label class="account-field"><span>Password</span><input type="password" autocomplete="current-password" placeholder="Password" required></label>
        <button class="account-submit button primary" type="submit">Sign in</button>
      </form>
      <div class="account-links">
        <a href="#" data-account-action="forgot">Forgot your password?</a>
        <span>Don’t have an account? <a href="#" data-account-action="signup">Sign up</a></span>
      </div>
      <div class="account-benefits">
        <h3>Create an account with us and you'll be able to:</h3>
        <ul>
          <li>Check out faster</li>
          <li>Save multiple shipping addresses</li>
          <li>Access your order history</li>
          <li>Track new orders</li>
          <li>Save items to your Wish List</li>
        </ul>
      </div>
    </section>`);

  const modal=document.querySelector('.account-modal');
  const overlay=document.querySelector('.account-overlay');
  const email=modal.querySelector('input[type="email"]');
  let returnFocus=null;

  function close(){
    if(!modal.classList.contains('open'))return;
    modal.classList.remove('open');
    overlay.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('account-open');
    returnFocus?.focus();
  }

  function open(event){
    event?.preventDefault();
    returnFocus=document.activeElement;
    modal.classList.add('open');
    overlay.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('account-open');
    document.querySelector('.mobile-menu.open')?.classList.remove('open');
    document.body.classList.remove('menu-open');
    setTimeout(()=>email.focus(),60);
  }

  buttons.forEach(button=>button.addEventListener('click',open));
  document.querySelectorAll('[data-account-close]').forEach(control=>control.addEventListener('click',close));

  modal.querySelector('.account-form').addEventListener('submit',event=>{
    event.preventDefault();
    window.TruePrintUI?.showToast?.('Sign in will be connected to the store account system.');
  });

  modal.querySelectorAll('[data-account-action]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    const label=link.dataset.accountAction==='signup'?'Sign up':'Password recovery';
    window.TruePrintUI?.showToast?.(`${label} will be connected to the store account system.`);
  }));

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')close();
  });
})();
