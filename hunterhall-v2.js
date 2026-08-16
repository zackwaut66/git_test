(()=>{
'use strict';
const root=document.querySelector('#app');
if(!root)return;
const ART={Vanguard:'./assets/hunter-vanguard-v2.svg',Duelist:'./assets/hunter-duelist-v2.svg',Physician:'./assets/hunter-physician-v2.svg'};
const CREED={
 Vanguard:'Hold the breach. Break the charge. Bring the others home.',
 Duelist:'Find the opening. End the threat before it can answer.',
 Physician:'Keep the line alive long enough to finish what crossed it.'
};
let queued=false;
function gearFor(name,state){return Object.values(state?.equipped||{}).filter(x=>x&&x.owner===name)}
function bestSet(gear){const counts={};for(const x of gear){if(x.set)counts[x.set]=(counts[x.set]||0)+1}const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);return entries[0]||null}
function decorate(){
 const view=root.querySelector('.huntersview');
 if(!view||view.dataset.hhV2==='1')return;
 const stage=view.querySelector('.hunterstage');
 const row=view.querySelector('.hunterrow');
 const loadout=view.querySelector('.loadoutmini');
 const panel=view.querySelector('.compactpanel');
 if(!stage||!row||!loadout||!panel)return;
 view.dataset.hhV2='1';
 const portraits=[...row.querySelectorAll('.hunterportrait')];
 const selected=portraits.find(x=>x.classList.contains('selected'))||portraits[0];
 if(!selected)return;
 const name=selected.dataset.hunter||'Vanguard';
 const role=selected.querySelector('span')?.textContent||'Hunter';
 const meta=selected.querySelector('small')?.textContent||'';
 const state=window.Game?.state;
 const hunter=state?.hunters?.find(x=>x.name===name);
 const gear=gearFor(name,state);
 const set=bestSet(gear);
 const xp=hunter?.xp||0, need=Math.max(1,(hunter?.lv||1)*48), pct=Math.min(100,Math.round(xp/need*100));
 const hero=document.createElement('section');
 hero.className='hh-hero';
 hero.style.setProperty('--hunter-art',`url("${ART[name]||ART.Vanguard}")`);
 hero.innerHTML=`
  <div class="hh-backdrop" aria-hidden="true"></div>
  <div class="hh-vignette" aria-hidden="true"></div>
  <div class="hh-kicker"><span>HUNTER HALL</span><i>ACTIVE ROSTER</i></div>
  <div class="hh-character" aria-hidden="true"><div class="hh-character-glow"></div></div>
  <div class="hh-identity">
    <small>${role.toUpperCase()}</small>
    <h1>${name.toUpperCase()}</h1>
    <p>${CREED[name]||''}</p>
    <div class="hh-statline">${meta.split(' · ').map(x=>`<span>${x}</span>`).join('')}</div>
    <div class="hh-xp"><i><em style="width:${pct}%"></em></i><span>EXPERIENCE ${xp}/${need}</span></div>
    <div class="hh-resonance ${set&&set[1]>=2?'active':''}"><b>${set?set[0].toUpperCase():'NO SET RESONANCE'}</b><span>${set?`${set[1]}/4 PIECES EQUIPPED`:`${gear.length}/4 LOADOUT SLOTS FILLED`}</span></div>
  </div>`;
 stage.insertBefore(hero,row);
 row.classList.add('hh-roster');
 portraits.forEach(btn=>{
   const n=btn.dataset.hunter;
   btn.style.setProperty('--roster-art',`url("${ART[n]||ART.Vanguard}")`);
   btn.setAttribute('aria-label',`Select ${n}`);
 });
 loadout.classList.add('hh-loadout');
 [...loadout.querySelectorAll('button')].forEach(btn=>{
   btn.title='Open Loot to change this slot';
   btn.addEventListener('click',()=>window.Game?.go?.('inventory'));
 });
 stage.appendChild(loadout);
 panel.classList.add('hh-statusbar');
 const left=panel.querySelector('div');
 if(left){const label=left.querySelector('small');if(label)label.textContent='HUNTER HALL FORMATION';}
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
decorate();
})();