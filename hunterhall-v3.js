(()=>{
'use strict';
const root=document.querySelector('#app');
if(!root)return;
const ART={
  Vanguard:'./assets/hunter-vanguard-v2.svg',
  Duelist:'./assets/hunter-duelist-v2.svg',
  Physician:'./assets/hunter-physician-v2.svg'
};
const SLOT_ICON={Weapon:'⚔',Head:'◉',Armor:'⛨',Charm:'✦'};
const CREED={
  Vanguard:'Hold the breach. Break the charge. Bring the others home.',
  Duelist:'Find the opening. End the threat before it can answer.',
  Physician:'Keep the line alive long enough to finish what crossed it.'
};
const CALLSIGN={Vanguard:'THE WALL',Duelist:'THE KNIFE',Physician:'THE LANTERN'};
let queued=false;
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function state(){return window.Game?.state}
function equipmentFor(name,s){return Object.values(s?.equipped||{}).filter(x=>x&&x.owner===name)}
function statFor(h,s){
  const gear=equipmentFor(h.name,s);
  let atk=(h.atk||0)+((h.lv||1)-1)*3;
  let hp=(h.hp||0)+((h.lv||1)-1)*8;
  for(const x of gear){atk+=x.atk||0;hp+=x.hp||0}
  if(window.Game?.setCount?.('Ashen Pilgrim')>=2)atk+=4;
  if(window.Game?.setCount?.('Mourning Watch')>=2)hp+=18;
  return {atk,hp,gear};
}
function setLabel(gear){
  const c={};for(const x of gear){if(x.set)c[x.set]=(c[x.set]||0)+1}
  const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];
  return top?`${top[0]} · ${top[1]}/4`:'No set resonance';
}
function build(){
  const view=root.querySelector('.huntersview');
  const s=state();
  if(!view||!s||view.dataset.hv3==='1')return;
  view.dataset.hv3='1';
  const selected=s.hunters?.find(h=>h.name===s.selectedHunter)||s.hunters?.[0];
  if(!selected)return;
  const stats=statFor(selected,s);
  const xp=selected.xp||0,need=Math.max(1,(selected.lv||1)*48),pct=Math.min(100,Math.round(xp/need*100));
  const formation=s.buildings?.hall>=3?'5-HUNTER FORMATION':s.buildings?.hall>=2?'4-HUNTER FORMATION':'3-HUNTER FORMATION';
  const support=s.buildings?.hall>=3?'Enclave Guard + March Scout':s.buildings?.hall>=2?'Enclave Guard active':'Support slots locked';
  view.innerHTML=`
  <section class="hv3-shell" aria-label="Hunter Hall roster">
    <div class="hv3-hall" aria-hidden="true"></div>
    <div class="hv3-grain" aria-hidden="true"></div>
    <header class="hv3-topbar">
      <div><small>ENCLAVE / PERSONNEL</small><b>HUNTER HALL</b></div>
      <div class="hv3-hall-level"><span>HALL</span><strong>LV ${s.buildings?.hall||1}</strong></div>
    </header>

    <nav class="hv3-roster" aria-label="Hunter roster">
      ${(s.hunters||[]).map((h,i)=>`<button class="hv3-roster-btn ${h.name===selected.name?'active':''}" data-hv3-hunter="${esc(h.name)}" style="--thumb:url('${ART[h.name]||ART.Vanguard}')"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(h.name)}</b><small>LV ${h.lv||1}</small></button>`).join('')}
    </nav>

    <div class="hv3-character-wrap" aria-hidden="true">
      <div class="hv3-sigil"></div>
      <div class="hv3-character" style="--hero:url('${ART[selected.name]||ART.Vanguard}')"></div>
    </div>

    <aside class="hv3-gear" aria-label="Equipped gear">
      ${['Weapon','Head','Armor','Charm'].map(slot=>{const item=s.equipped?.[`${selected.name}:${slot}`];return `<button data-hv3-loot class="hv3-gear-slot ${item?'filled':''}"><i>${SLOT_ICON[slot]}</i><span>${slot}</span><b>${item?esc(item.name):'EMPTY'}</b><small>${item?`+${item.atk||0} ATK${item.hp?` · +${item.hp} HP`:''}`:'OPEN LOOT'}</small></button>`}).join('')}
    </aside>

    <section class="hv3-nameplate">
      <small>${esc(selected.role).toUpperCase()} / ${CALLSIGN[selected.name]||'HUNTER'}</small>
      <h1>${esc(selected.name).toUpperCase()}</h1>
      <p>${CREED[selected.name]||''}</p>
    </section>

    <section class="hv3-dossier">
      <div class="hv3-stat"><small>LEVEL</small><strong>${selected.lv||1}</strong><span>XP ${xp}/${need}</span><i><em style="width:${pct}%"></em></i></div>
      <div class="hv3-stat"><small>VITALITY</small><strong>${stats.hp}</strong><span>MAX HP</span></div>
      <div class="hv3-stat"><small>STRIKE</small><strong>${stats.atk}</strong><span>ATTACK</span></div>
      <div class="hv3-stat set"><small>RESONANCE</small><strong>${stats.gear.length}/4</strong><span>${esc(setLabel(stats.gear))}</span></div>
    </section>

    <footer class="hv3-command">
      <div><small>${formation}</small><b>${support}</b></div>
      <button data-hv3-loot>OPEN LOADOUT</button>
      <button data-hv3-enclave>RETURN TO ENCLAVE</button>
    </footer>
  </section>`;

  view.querySelectorAll('[data-hv3-hunter]').forEach(btn=>btn.addEventListener('click',()=>{
    const g=state();if(!g)return;g.selectedHunter=btn.dataset.hv3Hunter;window.Game.save();window.Game.render();
  }));
  view.querySelectorAll('[data-hv3-loot]').forEach(btn=>btn.addEventListener('click',()=>window.Game?.go?.('inventory')));
  view.querySelector('[data-hv3-enclave]')?.addEventListener('click',()=>window.Game?.go?.('enclave'));
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;build()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
build();
})();