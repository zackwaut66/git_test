(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
document.documentElement.classList.add('ui-v24');
document.body.classList.add('production-ui-v24');
function decorate(){
  const brand=ROOT.querySelector('.hud .brand small');
  if(brand)brand.textContent='ASHEN MARCHES · FIELD COMMAND';
  ROOT.querySelectorAll('.gameview').forEach(v=>v.classList.add('production-shell-v24'));
  ROOT.querySelectorAll('button').forEach(b=>{
    if(!b.hasAttribute('type'))b.setAttribute('type','button');
    if(!b.getAttribute('aria-label')){
      const text=(b.innerText||b.textContent||'').trim().replace(/\s+/g,' ');
      if(text)b.setAttribute('aria-label',text.slice(0,120));
    }
  });
  ROOT.querySelectorAll('.sheet').forEach(s=>s.classList.add('production-sheet-v24'));
  ROOT.querySelectorAll('.compactpanel,.mapintel,.directive,.inventoryhead,.setcard,.loadoutmini').forEach(p=>p.classList.add('production-panel-v24'));
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true});decorate();
})();