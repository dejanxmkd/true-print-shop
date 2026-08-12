const pages={
contact:['Contact us','Talk with a real person','Our support team is available Monday–Friday, 8am–6pm.','Phone: 1 800 555 0126|Email: hello@trueprint.shop|Address: 124 Thread Street, Madeville, NY 10001'],
faq:['Frequently asked questions','Ordering and customisation','Choose a product, select your options and send us your artwork. Our team will confirm the details before production.','Production normally begins after payment and artwork approval.|Colour and placement proofs are provided when required.|Custom products are made specifically for your order.'],
shipping:['Shipping policy','Production and delivery','Standard production time is 5–10 business days after payment and artwork approval. Shipping time is separate from production time.','Tracking is provided once an order ships.|Delivery estimates depend on the selected carrier and destination.|Customers are responsible for accurate delivery information.'],
refunds:['Refund policy','Custom orders','Because customised products are made specifically for each customer, custom products are final sale.','Production errors must be reported within five business days of delivery.|Approved issues will be reviewed by our customer care team.'],
privacy:['Privacy policy','Your information','We use order and contact information only to provide products, support and essential shop services.','We do not sell personal information.|Payment details are handled by the checkout provider.|Contact us to request account assistance.'],
terms:['Terms and conditions','Using True Print Shop','Orders enter production after payment and final artwork approval. Customers are responsible for having permission to reproduce submitted artwork.','Colours may vary slightly between screens and finished materials.|Production timing is estimated and may vary by order complexity.'],
about:['About us','Precision in every stitch','True Print Shop creates premium custom apparel with reliable materials, careful decoration and in-house attention to detail.','Made in-house.|Premium embroidery.|Built to last.'],
blog:['Blog','Ideas, guides and shop updates','Practical advice for choosing garments, preparing artwork and getting better results from custom print and embroidery.','Choosing the right blank for your project.|How to prepare artwork.|Embroidery versus print.'],
careers:['Careers','Make great work with us','We are building a team that cares about craft, service and dependable custom apparel.','Production and finishing.|Customer care.|Design and prepress.']
};
const key=new URLSearchParams(location.search).get('page')||'contact',data=pages[key]||pages.contact;document.title=`${data[0]} — True Print Shop`;document.getElementById('info-title').textContent=data[0];document.getElementById('info-content').innerHTML=`<h2>${data[1]}</h2><p>${data[2]}</p><ul>${data[3].split('|').map(item=>`<li>${item}</li>`).join('')}</ul>`;

(function installNestedApparelDropdown(){
  const item=document.querySelector('.desktop-nav .nav-item.has-mega-dropdown');
  if(!item)return;
  item.className='nav-item has-dropdown apparel-dropdown';
  item.innerHTML=`<a href="collection.html?category=t-shirts">Custom Apparel</a><div class="dropdown-menu apparel-menu">
    <div class="nav-subitem"><a href="collection.html?category=t-shirts">T-Shirts</a><div class="sub-dropdown-menu"><a href="collection.html?category=short-sleeve">Short Sleeve</a><a href="collection.html?category=long-sleeve">Long Sleeve</a><a href="collection.html?category=polos">Polos</a></div></div>
    <div class="nav-subitem"><a href="collection.html?category=sweatshirts">Sweatshirts</a><div class="sub-dropdown-menu"><a href="collection.html?category=hoodies">Hoodies</a><a href="collection.html?category=crewnecks">Crewnecks</a><a href="collection.html?category=zip-hoodies">Zip Up Hoodies</a><a href="collection.html?category=quarter-zips">Quarter Zip Ups</a></div></div>
    <div class="nav-subitem"><a href="collection.html?category=sweatpants">Sweatpants</a><div class="sub-dropdown-menu"><a href="collection.html?category=joggers">Joggers</a></div></div>
    <div class="nav-subitem"><a href="collection.html?category=hats">Hats</a><div class="sub-dropdown-menu"><a href="collection.html?category=athletic-hats">Athletic Hats</a><a href="collection.html?category=beanies">Beanies</a><a href="collection.html?category=fitted-hats">Fitted Hats</a><a href="collection.html?category=hats">Lifetime Hats</a><a href="collection.html?category=mesh-hats">Mesh</a><a href="collection.html?category=snapbacks">Snapback</a><a href="collection.html?category=trucker-hats">Trucker Hats</a></div></div>
    <div class="nav-subitem"><a href="collection.html?category=jackets">Jackets</a><div class="sub-dropdown-menu"><a href="collection.html?category=jackets&q=jacket">Jackets</a><a href="collection.html?category=jackets&q=vest">Vests</a></div></div>
  </div>`;
  if(document.getElementById('nested-apparel-nav-style'))return;
  const style=document.createElement('style');style.id='nested-apparel-nav-style';style.textContent=`@media(min-width:1481px){.desktop-nav>.nav-item>a,.desktop-nav .dropdown-menu a{transition:none!important;transform:none!important}.desktop-nav>.nav-item>a:hover,.desktop-nav .dropdown-menu a:hover{transform:none!important}.desktop-nav .apparel-dropdown{position:relative!important}.desktop-nav .apparel-dropdown>.apparel-menu{top:calc(100% - 2px)!important;left:0!important;min-width:290px!important;width:auto!important;padding:18px!important;display:flex!important;flex-direction:column!important;gap:4px!important;transform:none!important}.desktop-nav .apparel-dropdown:hover>.apparel-menu,.desktop-nav .apparel-dropdown:focus-within>.apparel-menu{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important}.desktop-nav .nav-subitem{position:relative}.desktop-nav .nav-subitem:after{content:"";position:absolute;top:0;right:-16px;width:18px;height:100%}.desktop-nav .nav-subitem>a{min-height:46px;padding:9px 12px!important;display:flex!important;align-items:center;justify-content:space-between;gap:22px;font-size:16px!important;font-weight:700!important;color:var(--color-ink)!important;white-space:nowrap!important}.desktop-nav .nav-subitem>a:after{content:"chevron_right";font-family:"Material Icons";font-size:19px;color:var(--color-blue)}.desktop-nav .sub-dropdown-menu{position:absolute;top:-18px;left:calc(100% + 14px);min-width:270px;padding:18px;display:flex;flex-direction:column;gap:4px;background:var(--color-cream);border:2px solid var(--color-ink);border-radius:20px;box-shadow:7px 7px 0 var(--color-ink);opacity:0;visibility:hidden;pointer-events:none;z-index:130}.desktop-nav .nav-subitem:hover>.sub-dropdown-menu,.desktop-nav .nav-subitem:focus-within>.sub-dropdown-menu{opacity:1;visibility:visible;pointer-events:auto}.desktop-nav .sub-dropdown-menu a{min-height:44px;padding:9px 12px!important;font-size:16px!important;font-weight:700!important;color:var(--color-ink)!important;white-space:nowrap!important}.desktop-nav .nav-subitem>a:hover,.desktop-nav .sub-dropdown-menu a:hover{color:var(--color-blue)!important}}`;
  document.head.appendChild(style);
})();

(function installInfoVisualFixes(){
  const style=document.createElement('style');
  style.id='canonical-info-fixes';
  style.textContent=`
    h1{font-size:clamp(64px,6.6vw,84px)!important;line-height:1.02!important;font-weight:900!important;text-transform:uppercase!important}
    h2{font-size:clamp(36px,5.5vw,64px)!important;line-height:1.05!important;font-weight:900!important;text-transform:uppercase!important;letter-spacing:-3px!important}
    .site-footer{background:#111111!important;color:#F5F1E8!important}
    .site-footer :is(h1,h2,h3,h4,h5,h6,p,a,span,strong,small,li){color:#F5F1E8!important}
    .site-footer .footer-intro,.site-footer .footer-bottom{border-color:rgba(245,241,232,.3)!important}
    .site-footer .footer-bottom a{background:#2457FF!important;border-color:#2457FF!important;color:#F5F1E8!important}
    .site-footer .footer-bottom a i{color:#F5F1E8!important}
    .site-footer .footer-bottom a:hover{background:#2457FF!important;border-color:#2457FF!important;color:#F5F1E8!important}
    @media(min-width:1481px){.desktop-nav a,.desktop-nav a:hover{transition:none!important;transform:none!important}}
  `;
  document.head.appendChild(style);
})();
