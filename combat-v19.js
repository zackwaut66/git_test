(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
const CLASS_INTEL={
  warden:'BOSS · periodic toll marks Hunters',servitor:'SUPPORT · restores the Warden',bell:'CONTROL · marks Hunters on bell turns',rifleman:'RANGED · can mark backline targets',spotter:'RANGED · can mark backline targets',reaver:'EXECUTIONER · stronger against wounded Hunters',husk:'ARMORED · Broken increases damage taken',feral:'FERAL · can inflict Bleed',lurker:'RANGED · attacks from the back line',thrall:'MELEE · formation pressure'
};
function state(){return window.Game?.battle||null}
function focused(b){if(!b)return null;const direct=b.enemies?.[b.target];if(direct?.hp>0)return direct;return b.enemies?.find(x=>x.hp>0)||null}
function status(u){const a=[];if(u?.status?.bleed)a.push('BLEED');if(u?.status?.mark)a.push('MARKED');if(u?.status?.broken)a.push('BROKEN');return a.length?a.join(' · '):'CLEAR'}
function decorate(view){
  if(!view||view.querySelector('.combat-controls-v19'))return;
  const b=state();if(!b)return;
  const t=focused(b);if(!t)return;
  const panel=document.createElement('section');
  panel.className=`combat-controls-v19 ${b.paused?'paused':''}`;
  panel.innerHTML=`<div class="combat-focus-v19"><small>FOCUSED THREAT</small><b>${String(t.name||'THREAT').toUpperCase()}</b><span>${CLASS_INTEL[t.cls]||'HOSTILE · formation target'} · ${status(t)}</span></div><button type="button" data-v19-pause><b>${b.paused?'RESUME FORMATION':'TACTICAL PAUSE'}</b><small>${b.paused?'continue automatic exchange':'stop automatic exchange'}</small></button>`;
  const abilities=view.querySelector('.abilities'),bar=view.querySelector('.combatbar');
  if(abilities)abilities.insertAdjacentElement('beforebegin',panel);else bar?.append(panel);
  panel.querySelector('[data-v19-pause]')?.addEventListener('click',()=>{
    const live=state();if(!live)return;
    live.paused=!live.paused;
    live.lastAction=live.paused?'TACTICAL PAUSE · FORMATION HELD':'FORMATION RESUMED';
    window.Game?.render?.();
  });
}
function scan(){ROOT.querySelectorAll('.battleview').forEach(decorate)}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true});
scan();
})();
