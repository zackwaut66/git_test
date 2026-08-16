(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
const INTEL=[
  {name:'FORSaken FARMSTEAD',threat:'LOW',hostiles:'Feral · Lurker',reward:'28 Coin · 18 Iron · 3 Salvage'},
  {name:'HOLLOW CAUSEWAY',threat:'GUARDED',hostiles:'Reaver · Rifleman · Spotter',reward:'38 Coin · 17 Iron · 7 Salvage'},
  {name:'SAINT ORRA CHAPEL',threat:'SEVERE',hostiles:'Husk · Thrall · Bell Hand',reward:'48 Coin · 19 Iron · 9 Salvage'},
  {name:'PENITENT WARDEN',threat:'BOSS',hostiles:'Warden · Servitors',reward:'90 Coin · 24 Iron · 14 Salvage'}
];
function build(view){
  if(!view||view.querySelector('.march-intel-v20'))return;
  const nodes=[...view.querySelectorAll('.mapnode[data-region]')];if(!nodes.length)return;
  const strip=document.createElement('section');
  strip.className='march-intel-v20';
  strip.setAttribute('aria-label','March intelligence');
  strip.innerHTML=`<header><small>SCOUT TOWER DOSSIERS</small><b>March Intelligence</b><span>Threat profiles and base expedition recovery</span></header><div class="march-intel-track">${nodes.map(n=>{const i=Number(n.dataset.region),x=INTEL[i],open=!n.disabled&&!n.classList.contains('closed'),cleared=n.classList.contains('cleared');if(!x)return'';return `<article class="march-intel-card ${open?'open':'sealed'} ${cleared?'cleared':''}" data-v20-region="${i}"><small>${open?x.threat:'FOG'}</small><b>${open?x.name:'UNSCOUTED TERRITORY'}</b><span>${open?x.hostiles:'Scout Tower lacks a viable route.'}</span><em>${open?x.reward:'REWARD UNKNOWN'}</em>${cleared?'<i>CLEARED</i>':''}</article>`}).join('')}</div>`;
  const map=view.querySelector('.marchmap'),meta=view.querySelector('.mapintel');
  if(map)map.insertAdjacentElement('afterend',strip);else if(meta)meta.insertAdjacentElement('beforebegin',strip);else view.append(strip);
}
function scan(){ROOT.querySelectorAll('.mapview').forEach(build)}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true});
scan();
})();
