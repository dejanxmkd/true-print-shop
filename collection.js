const catalog=window.TRUE_PRINT_CATALOG,params=new URLSearchParams(location.search);let category=params.get('category')||'all',brand=params.get('brand')||'',query=params.get('q')||'',sort='featured';
const byId=id=>document.getElementById(id),categoryName=id=>catalog.categories.find(item=>item[0]===id)?.[1]||'All products';
const family={bundles:['hat-bundles','t-shirt-bundles','hoodie-bundles','crew-neck-bundles'],'t-shirts':['t-shirts','short-sleeve','long-sleeve'],sweatshirts:['sweatshirts','hoodies','crewnecks','zip-hoodies','quarter-zips'],hats:['hats','athletic-hats','beanies','fitted-hats','mesh-hats','snapbacks','trucker-hats']};
function matches(item){const [itemBrand,name,,itemCategory]=item,categories=family[category]||[category];return(category==='all'||categories.includes(itemCategory))&&(!brand||itemBrand===brand)&&(!query||`${itemBrand} ${name}`.toLowerCase().includes(query))}
function withoutBrand(name,brand){const words=brand.split(/[^a-z0-9]+/i).filter(Boolean).map(word=>word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));return name.replace(new RegExp(`^${words.join('[\\s+&.-]*')}[\\s:–—-]*`,'i'),'').trim()||name}
function productCard([itemBrand,name,price]){const displayName=withoutBrand(name,itemBrand),href=`product.html?${new URLSearchParams({name,price:`$${Number(price).toFixed(2)}`,brand:itemBrand})}`;return`<a class="catalog-card" href="${href}"><div class="image" role="img" aria-label="${displayName} placeholder"></div><small>${itemBrand}</small><h2>${displayName}</h2><strong>$${Number(price).toFixed(2)}</strong></a>`}
function render(){let items=catalog.products.filter(matches);if(sort==='low')items.sort((a,b)=>a[2]-b[2]);if(sort==='high')items.sort((a,b)=>b[2]-a[2]);if(sort==='az')items.sort((a,b)=>a[1].localeCompare(b[1]));const activeName=brand||categoryName(category),hero=document.querySelector('.catalog-hero');byId('collection-title').textContent=activeName;hero.querySelector('.eyebrow').textContent=activeName;byId('result-count').textContent=`${items.length} products`;byId('catalog-grid').innerHTML=items.map(productCard).join('')||'<p>No products in this selection yet.</p>';document.title=`${activeName} — True Print Shop`}
byId('category-list').innerHTML=catalog.categories.map(([id,label])=>`<a class="${id===category?'active':''}" href="collection.html?category=${id}">${label}</a>`).join('');
byId('brand-list').innerHTML=catalog.brands.map(label=>`<a class="${label===brand?'active':''}" href="collection.html?brand=${encodeURIComponent(label)}">${label}</a>`).join('');
// Mobile categories are hardcoded statically in collection.html to match homepage navbar
const sortTrigger=byId('sort-trigger'),sortMenu=document.querySelector('.sort-menu');sortTrigger.addEventListener('click',()=>{const open=sortMenu.classList.toggle('open');sortTrigger.setAttribute('aria-expanded',String(open))});sortMenu.addEventListener('click',event=>{const option=event.target.closest('button');if(!option)return;sort=option.dataset.value;sortTrigger.querySelector('span').textContent=option.textContent;sortMenu.querySelectorAll('button').forEach(button=>button.classList.toggle('active',button===option));sortMenu.classList.remove('open');sortTrigger.setAttribute('aria-expanded','false');render()});document.addEventListener('click',event=>{if(!event.target.closest('.sort-dropdown')){sortMenu.classList.remove('open');sortTrigger.setAttribute('aria-expanded','false')}});
const filterToggle=document.querySelector('.filter-toggle'),filterSheet=document.querySelector('.catalog-filters'),filterBackdrop=document.querySelector('.filter-backdrop'),filterClose=document.querySelector('.filter-close');filterToggle.querySelector('span').textContent='Categories & brands';
function setFilters(open){filterSheet.classList.toggle('open',open);filterBackdrop.classList.toggle('open',open);filterToggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('filters-open',open);filterSheet.style.removeProperty('--sheet-drag')}
filterToggle.addEventListener('click',()=>setFilters(true));filterClose.addEventListener('click',()=>setFilters(false));filterBackdrop.addEventListener('click',()=>setFilters(false));document.addEventListener('keydown',event=>{if(event.key==='Escape'&&filterSheet.classList.contains('open'))setFilters(false)});
const sheetHead=document.querySelector('.filter-sheet-head');let dragStart=null,dragDistance=0;sheetHead.addEventListener('touchstart',event=>{if(innerWidth>980)return;dragStart=event.touches[0].clientY;dragDistance=0},{passive:true});sheetHead.addEventListener('touchmove',event=>{if(dragStart===null)return;dragDistance=Math.max(0,event.touches[0].clientY-dragStart);filterSheet.style.setProperty('--sheet-drag',`${dragDistance}px`)},{passive:true});sheetHead.addEventListener('touchend',()=>{if(dragDistance>90)setFilters(false);else filterSheet.style.removeProperty('--sheet-drag');dragStart=null;dragDistance=0});
const searchInput=document.querySelector('.search-panel input');if(searchInput){if(query)searchInput.value=query;searchInput.addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();render()})}render();

// Sort dropdown matches the primary navigation dropdown styling.
const classicSortStyle=document.createElement('style');
classicSortStyle.textContent=`
.sort-menu{
  padding:18px!important;
  border:2px solid var(--ink)!important;
  border-radius:20px!important;
  background:var(--cream)!important;
  box-shadow:5px 5px 0 var(--ink)!important;
  overflow:visible!important;
}
.sort-menu button{
  min-height:0!important;
  padding:5px 0!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  color:var(--ink)!important;
  box-shadow:none!important;
  transform:none!important;
  text-align:left!important;
  font-size:16px!important;
  line-height:1.35!important;
  font-weight:700!important;
  transition:none!important;
}
.sort-menu button:hover,
.sort-menu button:focus-visible,
.sort-menu button.active{
  background:transparent!important;
  color:var(--blue)!important;
  box-shadow:none!important;
  transform:none!important;
}
`;
document.head.appendChild(classicSortStyle);

// Collection product cards use the same compact title typography as homepage product cards.
const catalogCardStyle=document.createElement('style');
catalogCardStyle.textContent=`
.catalog-card h2{
  margin:6px 0!important;
  font-size:19px!important;
  line-height:1.3!important;
  font-weight:800!important;
  text-transform:none!important;
  letter-spacing:0!important;
}
.catalog-card small{font-size:14px!important;line-height:1.3!important}
.catalog-card strong{font-size:18px!important;line-height:1.2!important;font-weight:800!important}
@media(max-width:600px){
  .catalog-card h2{font-size:18px!important}
  .catalog-card strong{font-size:17px!important}
}
`;
document.head.appendChild(catalogCardStyle);
