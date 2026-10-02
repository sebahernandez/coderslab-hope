const fs=require('fs');const assert=require('assert');
const {chromium}=require('/Users/sebacure/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='/Users/sebacure/Desktop/coderslab/hope/openspec/changes/fix-mobile-navbar-icon-overlap/verification';
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Users/sebacure/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const p=await b.newPage();const results=[];
 for(const glass of [true,false])for(const variant of ['visitor','no-account','no-search','drawer-avatar'])for(const width of [320,360,375,390,414,749]){
  await p.setViewportSize({width,height:900});await p.goto('http://127.0.0.1:9292',{waitUntil:'domcontentloaded'});
  await p.locator('.header-logo__image').waitFor();await p.evaluate(()=>document.fonts.ready);
  await p.evaluate(({glass,variant})=>{
   const h=document.querySelector('#header-component');if(!glass)h.classList.remove('header--glass');
   if(variant==='no-account')h.querySelector('.account-button').remove();
   if(variant==='no-search')h.querySelectorAll('.search-action').forEach(e=>e.remove());
   if(variant==='drawer-avatar'){
    const a=h.querySelector('.account-button');const wrapper=document.createElement('dialog-component');wrapper.className='account-drawer';a.before(wrapper);wrapper.append(a);a.innerHTML='<span class="account-button__avatar">H</span>';
   }
  },{glass,variant});
  const measure=()=>p.locator('#header-component').evaluate(h=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right}};
   const controls=[...h.querySelectorAll('.search-modal__button,.account-button,cart-drawer-component > button,.action__cart,.header__icon--menu')].filter(e=>e.checkVisibility()).map(e=>({label:e.getAttribute('aria-label'),...rect(e)}));
   const logo=rect(h.querySelector('.header-logo'));const image=rect(h.querySelector('.header-logo__image'));const panel=rect(h.querySelector('.header__columns'));
   const overlaps=[];const all=[...controls,logo];for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){const a=all[i],b=all[j];if(Math.min(a.right,b.right)-Math.max(a.x,b.x)>.5&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>.5)overlaps.push([i,j]);}
   return {controls,logo,image,panel,overlaps};
  });
  for(const scroll of [0,200]){
   await p.evaluate(y=>window.scrollTo(0,y),scroll);const d=await measure();
   assert.equal(d.overlaps.length,0,JSON.stringify({glass,variant,width,d}));
   assert(d.controls.every(c=>c.width>=43.9&&c.height>=43.9));
   assert(d.controls.every(c=>c.x>=d.panel.x&&c.right<=d.panel.right));
   assert(Math.abs(d.logo.x+d.logo.width/2-(d.panel.x+d.panel.width/2))<.6);
   assert(d.image.x>=d.logo.x-.1&&d.image.right<=d.logo.right+.1);
   assert.equal(d.controls.length,variant==='no-account'||variant==='no-search'?3:4);
   results.push({glass,variant,width,scroll,...d});
  }
  if(variant==='visitor'&&[320,390].includes(width)){await p.evaluate(()=>window.scrollTo(0,0));await p.locator('#header-component').screenshot({path:`${out}/verified-${glass?'glass':'plain'}-${width}.png`});}
 }
 await p.setViewportSize({width:390,height:900});await p.goto('http://127.0.0.1:9292',{waitUntil:'domcontentloaded'});
 await p.locator('.search-modal__button:visible').click();await p.locator('#search-modal dialog').waitFor({state:'visible'});await p.keyboard.press('Escape');
 const account=await p.locator('header-actions > a.account-button').getAttribute('href');assert(account.includes('admin.hopeicecream.shop/mi-cuenta/login'));
 await p.locator('.header__icon--menu:visible').click();assert(await p.locator('.menu-drawer-container').evaluate(e=>e.open));await p.keyboard.press('Escape');
 await p.locator('cart-drawer-component > button').click();await p.locator('cart-drawer-component dialog').waitFor({state:'visible'});
 fs.writeFileSync(`${out}/matrix-results.json`,JSON.stringify({results,interactions:{search:'PASS',accountDestination:account,menu:'PASS',cart:'PASS'},limitations:['drawer-avatar es una variante DOM simulada para geometría; no se dispone de sesión autenticada ni editor real']},null,2));
 console.log('PASS',results.length,'mediciones y búsqueda/cuenta/menú/carrito');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
