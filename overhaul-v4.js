(()=>{
'use strict';
const root=document.querySelector('#app');
if(!root)return;
document.documentElement.dataset.visualBuild='4';
const stamp=document.createElement('div');
stamp.className='v4-build-stamp';
stamp.textContent='VISUAL BUILD 4';
document.body.appendChild(stamp);
let queued=false;
function decorate(){
  const title=root.querySelector('.titleview');
  const enclave=root.querySelector('.enclaveview');
  const map=root.querySelector('.mapview');
  const inventory=root.querySelector('.inventoryview');
  const battle=root.querySelector('.battleview');
  const event=root.querySelector('.eventview');
  const result=root.querySelector('.resultview');
  document.documentElement.dataset.screen=title?'title':enclave?'enclave':map?'map':inventory?'inventory':battle?'battle':event?'event':result?'result':root.querySelector('.huntersview')?'hunters':'other';
  if(title&&!title.querySelector('.v4-title-mark')){
    const m=document.createElement('div');m.className='v4-title-mark';m.innerHTML='<span>ENCLAVE RECORD // 01</span><b>THE WESTERN MARCH</b>';title.appendChild(m);
  }
  if(enclave&&!enclave.querySelector('.v4-enclave-label')){
    const m=document.createElement('div');m.className='v4-enclave-label';m.innerHTML='<small>LAST HABITABLE HOLD</small><b>THE ENCLAVE</b><span>ASHFALL INDEX // SEVERE</span>';enclave.appendChild(m);
  }
  if(map&&!map.querySelector('.v4-map-label')){
    const m=document.createElement('div');m.className='v4-map-label';m.innerHTML='<small>SCOUT CARTOGRAPHY</small><b>ASHEN MARCHES</b>';map.appendChild(m);
  }
  if(inventory&&!inventory.querySelector('.v4-loot-label')){
    const m=document.createElement('div');m.className='v4-loot-label';m.textContent='RECOVERED RELICS // FIELD INVENTORY';inventory.appendChild(m);
  }
  if(battle&&!battle.querySelector('.v4-combat-label')){
    const m=document.createElement('div');m.className='v4-combat-label';m.textContent='CONTACT // RESOLVE AUTHORIZED';battle.appendChild(m);
  }
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
decorate();
})();