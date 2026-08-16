(()=>{
'use strict';
const root=document.querySelector('#app');
if(!root)return;
/* V30: the old generated WebP runtime payloads render with severe horizontal corruption on mobile Safari.
   Use the repository's deterministic SVG Hunter art everywhere in the Hall instead. */
const FALLBACK={Vanguard:'./assets/hunter-vanguard-v2.svg',Duelist:'./assets/hunter-duelist-v2.svg',Physician:'./assets/hunter-physician-v2.svg'};
const artFor=name=>FALLBACK[name]||FALLBACK.Vanguard;
const CREED={Vanguard:'Hold the breach. Bring the others home.',Duelist:'Find the opening. End it before it can answer.',Physician:'Keep the line alive long enough to finish the hunt.'};
const CALL={Vanguard:'FRONTLINE // THE WALL',Duelist:'STRIKER // THE KNIFE',Physician:'SUPPORT // THE LANTERN'};
const SLOT_ICON={Weapon:'⚔',Head:'◉',Armor:'⛨',Charm:'✦'};
let queued=false;
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function state(){return window.Game?.state}
function gearFor(name,s){return Object.values(s?.equipped||{}).filter(x=>x&&x.owner===name)}
function stats(h,s){const gear=gearFor(h.name,s);let atk=(h.atk||0)+((h.lv||1)-1)*3,hp=(h.hp||0)+((h.lv||1)-1)*8;for(const x of gear){atk+=x.atk||0;hp+=x.hp||0}const pilgrim=Object.values(s.equipped||{}).filter(x=>x?.set==='Ashen Pilgrim').length,mourning=Object.values(s.equipped||{}).filter(x=>x?.set==='Mourning Watch').length;if(pilgrim>=2)atk+=4;if(mourning>=2)hp+=18;const kb=window.KingdomV27?.bonuses?.();if(kb){atk+=kb.atk||0;hp+=kb.hp||0}return{atk,hp,gear}}
function build(){
  const view=root.querySelector('.huntersview'),s=state();
  if(!view||!s||view.dataset.v7==='1')return;
  const h=s.hunters?.find(x=>x.name===s.selectedHunter)||s.hunters?.[0];if(!h)return;
  view.dataset.v7='1';const st=stats(h,s);const setCounts={};for(const x of st.gear){if(x.set)setCounts[x.set]=(setCounts[x.set]||0)+1}const topSet=Object.entries(setCounts).sort((a,b)=>b[1]-a[1])[0];
  view.innerHTML=`<section class="v7-hunterhall" aria-label="Hunter Hall">
    <div class="v7-hall-bg" aria-hidden="true"></div>
    <header class="v7-hall-title"><small>ENCLAVE PERSONNEL // HALL LV ${s.buildings?.hall||1}</small><b>Hunter Hall</b></header>
    <div class="v7-hero stable-vector-art" data-art="vector" style="--hero:url('${artFor(h.name)}')" aria-hidden="true"></div>
    <nav class="v7-roster" aria-label="Active Hunters">${(s.hunters||[]).map(x=>`<button data-v7-hunter="${esc(x.name)}" class="${x.name===h.name?'active':''}" style="--thumb:url('${artFor(x.name)}')"><b>${esc(x.name)}</b><small>LV ${x.lv||1}</small></button>`).join('')}</nav>
    <section class="v7-name"><small>${CALL[h.name]||'ACTIVE HUNTER'}</small><h1>${esc(h.name).toUpperCase()}</h1><p>${CREED[h.name]||''}</p></section>
    <aside class="v7-loadout" aria-label="Equipped gear">${['Weapon','Head','Armor','Charm'].map(slot=>{const x=s.equipped?.[`${h.name}:${slot}`];return `<button data-v7-loot><small>${SLOT_ICON[slot]} ${slot.toUpperCase()}</small><b>${x?esc(x.name):'EMPTY'}</b></button>`}).join('')}</aside>
    <section class="v7-stats"><div class="v7-stat"><small>LEVEL</small><b>${h.lv||1}</b></div><div class="v7-stat"><small>VITALITY</small><b>${st.hp}</b></div><div class="v7-stat"><small>STRIKE</small><b>${st.atk}</b></div><div class="v7-stat set"><small>RESONANCE</small><b>${topSet?`${topSet[1]}/4`:`${st.gear.length}/4`}</b></div></section>
    <button class="v7-hall-action" data-v7-hall>HALL MANAGEMENT · LV ${s.buildings?.hall||1}</button>
  </section>`;
  view.querySelectorAll('[data-v7-hunter]').forEach(b=>b.addEventListener('click',()=>{const g=state();if(!g)return;g.selectedHunter=b.dataset.v7Hunter;window.Game.save();window.Game.render()}));
  view.querySelectorAll('[data-v7-loot]').forEach(b=>b.addEventListener('click',()=>window.Game?.go?.('inventory')));
  view.querySelector('[data-v7-hall]')?.addEventListener('click',()=>{window.Game?.go?.('enclave');requestAnimationFrame(()=>root.querySelector('[data-building="hall"]')?.click())});
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;build()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
build();
})();