(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
const KEY='bell-beneath-ash-contracts-v21';
const ID='last_toll';
const BONUS={coin:100,iron:18,salvage:18};
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{active:null,completed:{}}}catch{return{active:null,completed:{}}}}
function save(q){localStorage.setItem(KEY,JSON.stringify(q))}
function unlocked(q){return ['cinder_pack','blackroad_tithe','echo_choir'].every(id=>(q.completed?.[id]||0)>=1)}
function start(){
  const g=window.Game,q=load();if(!g?.state?.wardenDefeated||!unlocked(q))return;
  q.active={id:ID,rewarded:false};save(q);
  g.startBattle(3,{});
  const b=g.battle;if(!b)return;
  b.v22Hunt=ID;
  b.enemies.forEach(e=>{
    const boss=e.cls==='warden';
    const hpMult=boss?1.28:1.22,atkMult=boss?1.22:1.18;
    e.max=Math.max(1,Math.round(e.max*hpMult));e.hp=e.max;e.atk=Math.max(1,Math.round(e.atk*atkMult));
  });
  b.resolve=Math.max(15,b.resolve-12);b.dread=2;b.lastAction='MASTERY HUNT · THE LAST TOLL';g.render();
}
function board(view){
  const board=view.querySelector('.hunt-board-v21');if(!board||board.querySelector('[data-v22-last-toll]'))return;
  const q=load(),open=unlocked(q),n=q.completed?.[ID]||0,track=board.querySelector('.hunt-contracts-v21');if(!track)return;
  const btn=document.createElement('button');
  btn.className=`last-toll-card-v22 ${open?'open':'locked'}`;btn.dataset.v22LastToll='';btn.disabled=!open;
  btn.innerHTML=open?`<small>MASTERY · ${n} COMPLETION${n===1?'':'S'}</small><b>LAST TOLL</b><span>The bell is silent, but its memory remains beneath Saint Orra. Draw the Warden's echo out and destroy it again.</span><em>BOUNTY · ◈ ${BONUS.coin} · ⚒ ${BONUS.iron} · ⌁ ${BONUS.salvage} · guaranteed relic</em>`:`<small>MASTERY HUNT · LOCKED</small><b>LAST TOLL</b><span>Complete Cinder Pack, Blackroad Tithe and Echo Choir at least once to unlock the final Hunt Board challenge.</span><em>THREE CONTRACT SEALS REQUIRED</em>`;
  track.append(btn);if(open)btn.addEventListener('click',start);
}
function battle(view){
  const q=load(),b=window.Game?.battle;if(q.active?.id!==ID||!b)return;
  if(!b.v22Hunt){
    b.v22Hunt=ID;b.enemies.forEach(e=>{const boss=e.cls==='warden',hm=boss?1.28:1.22,am=boss?1.22:1.18;e.max=Math.round(e.max*hm);e.hp=e.max;e.atk=Math.round(e.atk*am)});b.resolve=Math.max(15,b.resolve-12);b.dread=2;
  }
  if(view.querySelector('.last-toll-banner-v22'))return;
  const x=document.createElement('div');x.className='last-toll-banner-v22';x.innerHTML='<small>MASTERY HUNT</small><b>LAST TOLL</b><span>WARDEN ECHO</span>';view.querySelector('.battlescene')?.append(x);
  view.querySelector('[data-retreat]')?.addEventListener('click',()=>{const z=load();if(z.active?.id===ID){z.active=null;save(z)}},{capture:true,once:true});
}
function reward(view){
  const q=load(),a=q.active,g=window.Game,s=g?.state;if(a?.id!==ID||!s?.lastResult||s.lastResult.region!==3)return;
  if(!a.rewarded){
    a.rewarded=true;q.completed=q.completed||{};q.completed[ID]=(q.completed[ID]||0)+1;save(q);
    const x=g.debugState();x.coin+=BONUS.coin;x.iron+=BONUS.iron;x.salvage+=BONUS.salvage;
    const relic=g.makeItem(3,{relic:true});x.inventory.push(relic);x.lastDrops.push(relic);g.debugSetState(x);return;
  }
  if(view.querySelector('.last-toll-reward-v22'))return;
  const relic=s.lastDrops?.[s.lastDrops.length-1],panel=document.createElement('section');panel.className='last-toll-reward-v22';
  panel.innerHTML=`<small>MASTERY HUNT COMPLETE</small><b>THE LAST TOLL IS BROKEN</b><span>Mastery bounty · ◈ +${BONUS.coin} · ⚒ +${BONUS.iron} · ⌁ +${BONUS.salvage}</span><em>Relic recovered · ${relic?.name||'Warden relic'}</em>`;
  view.querySelector('.rewardchips')?.insertAdjacentElement('afterend',panel);
  view.querySelector('[data-secure]')?.addEventListener('click',()=>{const z=load();if(z.active?.id===ID){z.active=null;save(z)}},{capture:true,once:true});
}
function scan(){ROOT.querySelectorAll('.enclaveview').forEach(board);ROOT.querySelectorAll('.battleview').forEach(battle);ROOT.querySelectorAll('.resultview').forEach(reward)}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true});scan();
})();
