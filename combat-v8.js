(()=>{
'use strict';
const root=document.querySelector('#app');
if(!root)return;
const ALLY={Vanguard:'./assets/hunter-vanguard-v2.svg',Duelist:'./assets/hunter-duelist-v2.svg',Physician:'./assets/hunter-physician-v2.svg'};
const allyArt=name=>ALLY[name]||'';
const ENEMY={
 'Carrion Scavenger':'./assets/enemy-carrion-scavenger-v1.svg','Cinder Scavenger':'./assets/enemy-carrion-scavenger-v1.svg','Farmhand Thrall':'./assets/enemy-carrion-scavenger-v1.svg','Ash Hound':'./assets/enemy-ash-hound-v1.svg','Farmstead Lurker':'./assets/enemy-farmstead-lurker-v1.svg','Grainhouse Lurker':'./assets/enemy-farmstead-lurker-v1.svg','Silo Lurker':'./assets/enemy-farmstead-lurker-v1.svg','Road Reaver':'./assets/enemy-road-reaver-v1.svg','Tollhouse Reaver':'./assets/enemy-road-reaver-v1.svg','Ashbound Rifleman':'./assets/enemy-rifleman-v1.svg','Cinder Rifleman':'./assets/enemy-rifleman-v1.svg','Bridge Spotter':'./assets/enemy-bridge-spotter-v1.svg','Span Watcher':'./assets/enemy-bridge-spotter-v1.svg','Reliquary Husk':'./assets/enemy-reliquary-husk-v1.svg','Chapel Thrall':'./assets/enemy-chapel-thrall-v1.svg','Votive Thrall':'./assets/enemy-chapel-thrall-v1.svg','Bell Hand':'./assets/enemy-bell-hand-v1.svg','Choir Bell Hand':'./assets/enemy-bell-hand-v1.svg','Penitent Warden':'./assets/enemy-penitent-warden-v1.svg','Bellbound Servitor':'./assets/enemy-bellbound-servitor-v1.svg','Ashen Servitor':'./assets/enemy-bellbound-servitor-v1.svg','Censer Servitor':'./assets/enemy-bellbound-servitor-v1.svg'};
let queued=false;
function artUrl(u){return u?`url("${u.replace(/"/g,'')}" )`:''}
function decorate(){
 const view=root.querySelector('.battleview');if(!view||view.dataset.v8==='1')return;view.dataset.v8='1';const scene=view.querySelector('.battlescene');
 if(scene?.classList.contains('zone-farm'))scene.classList.add('v8-farm-art');if(scene?.classList.contains('zone-causeway'))scene.classList.add('v13-causeway-art');if(scene?.classList.contains('zone-chapel'))scene.classList.add('v14-chapel-art');if(scene?.classList.contains('zone-warden'))scene.classList.add('v15-warden-art');
 view.querySelectorAll('.allyformation .battleunit').forEach(unit=>{const name=unit.querySelector('b')?.textContent?.trim()||'',art=allyArt(name);if(art){unit.classList.add('v8-illustrated','v8-ally-art');unit.style.setProperty('--unit-art',artUrl(art));unit.dataset.art='vector'}});
 view.querySelectorAll('.enemyformation .battleunit').forEach(unit=>{const name=unit.querySelector('b')?.textContent?.trim()||'',art=ENEMY[name];if(art){unit.classList.add('v8-illustrated','v8-enemy-art');unit.style.setProperty('--unit-art',artUrl(art));unit.dataset.art='illustrated'}if(name==='Penitent Warden')unit.classList.add('v15-boss');if(/Servitor/.test(name))unit.classList.add('v15-servitor')});
 const meta=view.querySelector('.combatmeta');if(meta&&!view.querySelector('.v8-combat-title')){const region=meta.querySelector('small')?.textContent||'ASHEN MARCHES',turn=meta.querySelector('b')?.textContent||'',tag=document.createElement('div');tag.className='v8-combat-title';tag.innerHTML=`<small>EXPEDITION ENGAGED</small><b>${region}</b><span>${turn}</span>`;scene?.appendChild(tag)}
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});decorate();
})();