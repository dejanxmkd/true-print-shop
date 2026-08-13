(function(){
  const params=new URLSearchParams(location.search);
  const slug=params.get('slug')||'custom-apparel';
  const articles={
    'custom-apparel':{category:'Featured',title:'How to build custom apparel people actually want to wear',deck:'From fabric weight and fit to print placement and finishing, here is what makes branded apparel feel premium instead of promotional.',meta:'6 min read',body:[['p','The difference between a shirt people wear once and a shirt they reach for every week usually starts before the logo is ever printed. The blank, the fit and the placement all matter.'],['h2','Start with the garment, not the graphic'],['p','A premium result starts with choosing the right base garment for the job. Think about weight, hand feel, structure and how the piece will actually be worn.'],['ul',['Choose a fabric weight that matches the use case','Keep fit consistent across the team','Make sure the surface works with your decoration method']],['h2','Scale the artwork for the garment'],['p','A chest logo, sleeve mark and full back print all need different proportions. One logo size rarely works everywhere.'],['callout','Good branded apparel should feel like clothing first and merchandise second.'],['h2','Finishing details make the difference'],['p','Clean placement, consistent sizing and the right decoration method are what make the final piece feel intentional.']]},
    'embroidery-caps':{category:'Embroidery',title:'Choosing the right cap for embroidery',deck:'Structure, panels and fabric all matter more than most people think.',meta:'4 min read'},
    'logo-sizing':{category:'Design tips',title:'Logo sizing that works on apparel',deck:'A practical guide to chest, sleeve and back placements.',meta:'5 min read'},
    'uniform-system':{category:'Workwear',title:'What makes a good uniform system',deck:'Keep teams consistent without making every piece feel identical.',meta:'5 min read'},
    'blank-tshirt':{category:'Guides',title:'Picking the right blank T-shirt',deck:'Fit, weight, softness and printability explained without the jargon.',meta:'5 min read'}
  };
  const article=articles[slug]||articles['custom-apparel'];
  article.body=article.body||[['p',article.deck],['h2','What to consider'],['p','The best choice depends on how the garment will be worn, how often it will be washed and how the artwork needs to perform.'],['h2','Keep the system simple'],['p','Consistent materials, sizing and decoration rules make future reorders easier and keep the final result looking intentional.']];
  const set=(selector,text)=>{const el=document.querySelector(selector);if(el)el.textContent=text};
  set('[data-article-category]',article.category);set('[data-article-title]',article.title);set('[data-article-deck]',article.deck);set('[data-article-meta]',article.meta);
  document.title=`${article.title} | True Print Shop`;
  const body=document.querySelector('[data-article-body]');
  if(body){body.innerHTML=article.body.map(block=>{if(block[0]==='p')return `<p>${block[1]}</p>`;if(block[0]==='h2')return `<h2>${block[1]}</h2>`;if(block[0]==='h3')return `<h3>${block[1]}</h3>`;if(block[0]==='callout')return `<div class="article-callout">${block[1]}</div>`;if(block[0]==='ul')return `<ul>${block[1].map(item=>`<li>${item}</li>`).join('')}</ul>`;return ''}).join('')}
})();