(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
const DOCTRINE={
  Vanguard:{tag:'FRONTLINE · BULWARK',ability:'BRACE',cost:'25 RESOLVE',text:'Reduce incoming formation damage while the Vanguard holds the line.'},
  Duelist:{tag:'FRONTLINE · STRIKER',ability:'SEVER',cost:'40 RESOLVE',text:'Heavy strike that inflicts Bleed and Broken on the focused threat.'},
  Physician:{tag:'BACKLINE · SUPPORT',ability:'FIELD TREATMENT',cost:'35 RESOLVE',text:'Restore the weakest Hunter and clear Bleed and Marked.'}
};
function state(){try{return window.Game?.debugState?.()||null}catch{return null}}
function decorate(view){
  if(!view||view.dataset.v18Decorated==='1')return;
  const s=state();if(!s)return;
  const h=s.hunters?.find(x=>x.name===s.selectedHunter)||s.hunters?.[0];if(!h)return;
  const d=DOCTRINE[h.name]||{tag:(h.role||'HUNTER').toUpperCase(),ability:'FORMATION',cost:'AUTOMATIC',text:'Maintains formation and attacks the current focused threat.'};
  const need=Math.max(1,h.lv*48),xp=Math.max(0,h.xp||0),pct=Math.max(0,Math.min(100,Math.round(xp/need*100)));
  const nextHp=8,nextAtk=3;
  const panel=document.createElement('section');
  panel.className='hunter-progression-v18';
  panel.innerHTML=`<div class="hunter-progression-head"><div><small>HUNTER DOSSIER · ${d.tag}</small><b>${h.name.toUpperCase()}</b><span>LEVEL ${h.lv} · ${xp} / ${need} XP</span></div><div class="hunter-level-seal"><small>LV</small><b>${h.lv}</b></div></div><div class="hunter-xp-track"><i style="width:${pct}%"></i></div><div class="hunter-progression-grid"><div><small>NEXT LEVEL</small><b>+${nextHp} HP · +${nextAtk} ATK</b><span>${need-xp} XP remaining</span></div><div><small>TACTICAL DOCTRINE</small><b>${d.ability} · ${d.cost}</b><span>${d.text}</span></div></div>`;
  const loadout=view.querySelector('.loadoutmini');
  if(loadout)loadout.insertAdjacentElement('beforebegin',panel);else view.append(panel);
  view.dataset.v18Decorated='1';
}
function scan(){ROOT.querySelectorAll('.huntersview').forEach(decorate)}
new MutationObserver(scan).observe(ROOT,{childList:true,subtree:true});
scan();
})();
