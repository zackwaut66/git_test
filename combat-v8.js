(()=>{
'use strict';
const root=document.querySelector('#app');
if(!root)return;
const allyArt=name=>{const k={Vanguard:'v',Duelist:'d',Physician:'p'}[name];const data=k&&window.__HART?.[k];return data?`data:image/webp;base64,${data}`:''};
const ENEMY={
 'Carrion Scavenger':'./assets/enemy-carrion-scavenger-v1.svg',
 'Cinder Scavenger':'./assets/enemy-carrion-scavenger-v1.svg',
 'Farmhand Thrall':'./assets/enemy-carrion-scavenger-v1.svg',
 'Ash Hound':'./assets/enemy-ash-hound-v1.svg',
 'Farmstead Lurker':'./assets/enemy-farmstead-lurker-v1.svg',
 'Grainhouse Lurker':'./assets/enemy-farmstead-lurker-v1.svg',
 'Silo Lurker':'./assets/enemy-farmstead-lurker-v1.svg'
};
let queued=false;
function artUrl(u){return u?`url("${u.replace(/"/g,'')}" )`:''}
function decorate(){
 const view=root.querySelector('.battleview');
 if(!view||view.dataset.v8==='1')return;
 view.dataset.v8='1';
 const scene=view.querySelector('.battlescene');
 if(scene?.classList.contains('zone-farm'))scene.classList.add('v8-farm-art');
 view.querySelectorAll('.allyformation .battleunit').forEach(unit=>{
   const name=unit.querySelector('b')?.textContent?.trim()||'';
   const art=allyArt(name);
   if(art){unit.classList.add('v8-illustrated','v8-ally-art');unit.style.setProperty('--unit-art',artUrl(art));unit.dataset.art='generated';}
 });
 view.querySelectorAll('.enemyformation .battleunit').forEach(unit=>{
   const name=unit.querySelector('b')?.textContent?.trim()||'';
   const art=ENEMY[name];
   if(art){unit.classList.add('v8-illustrated','v8-enemy-art');unit.style.setProperty('--unit-art',artUrl(art));unit.dataset.art='illustrated';}
 });
 const meta=view.querySelector('.combatmeta');
 if(meta&&!view.querySelector('.v8-combat-title')){
   const region=meta.querySelector('small')?.textContent||'ASHEN MARCHES';
   const turn=meta.querySelector('b')?.textContent||'';
   const tag=document.createElement('div');tag.className='v8-combat-title';tag.innerHTML=`<small>EXPEDITION ENGAGED</small><b>${region}</b><span>${turn}</span>`;scene?.appendChild(tag);
 }
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
decorate();
})();
