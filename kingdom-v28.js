(()=>{
'use strict';
const ROOT=document.querySelector('#app');if(!ROOT)return;
const NAMES=['INNER WARD','ASH COURT','WEST RAMPART','LOWER FOUNDRY','CINDER QUARTER','OUTER BAILEY'];
const ICON={bastion:'⛨',arsenal:'⚔',foundry:'⚒',shrine:'✦'};
function k(){try{return window.KingdomV27?.load?.()||null}catch{return null}}
function sig(x){return x?.plots?.map(p=>`${+p.reclaimed}:${p.building||'-'}:${p.level||0}`).join('|')||''}
function structure(p,i){
 const type=p.building||'empty',lv=p.level||0,icon=ICON[type]||'+';
 return `<section class="district-v28 district-${i} ${p.reclaimed?'reclaimed':'ruined'} type-${type} lv-${lv}" data-v28-district="${i}">
   <div class="district-ground-v28"></div><div class="district-ruins-v28"><i></i><i></i><i></i></div>
   <div class="district-building-v28"><span class="tower-a"></span><span class="tower-b"></span><span class="body"></span><span class="roof"></span><span class="light"></span></div>
   <div class="district-smoke-v28"><i></i><i></i></div>
   <label><b>${icon} ${p.reclaimed?(p.building||'RECLAIMED').toUpperCase():'RUINED LAND'}</b><span>${NAMES[i]}${p.building?` · LV ${lv}`:''}</span></label>
 </section>`;
}
function render(view){
 const state=k();if(!state||!view)return;const world=view.querySelector('.worldscene');if(!world)return;
 const s=sig(state);if(world.dataset.v28Sig===s)return;world.dataset.v28Sig=s;
 world.querySelector('.kingdom-growth-v28')?.remove();
 const layer=document.createElement('div');layer.className='kingdom-growth-v28';
 const reclaimed=state.plots.filter(p=>p.reclaimed).length,built=state.plots.filter(p=>p.building).length,totalLv=state.plots.reduce((n,p)=>n+(p.level||0),0);
 layer.dataset.reclaimed=String(reclaimed);layer.dataset.built=String(built);layer.dataset.levels=String(totalLv);
 layer.innerHTML=`<div class="growth-backdrop-v28"><i class="wall-left"></i><i class="wall-right"></i><i class="gate"></i><i class="spire"></i></div>${state.plots.map(structure).join('')}<div class="growth-atmosphere-v28"></div><div class="growth-status-v28"><small>ENCLAVE FOOTPRINT</small><b>${reclaimed}/6 WARDS RECLAIMED</b><span>${built} STRUCTURES · ${totalLv} TOTAL TIERS</span></div>`;
 world.prepend(layer);
 view.classList.remove('growth-v28-small','growth-v28-mid','growth-v28-large','growth-v28-fortress');
 view.classList.add(reclaimed>=6?'growth-v28-fortress':reclaimed>=4?'growth-v28-large':reclaimed>=2?'growth-v28-mid':'growth-v28-small');
}
function scan(){ROOT.querySelectorAll('.enclaveview').forEach(render)}
let q=false;function schedule(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;scan()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true});
setInterval(scan,450);scan();
window.KingdomV28={refresh:scan,signature:()=>sig(k())};
})();
