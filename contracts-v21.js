(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
const KEY='bell-beneath-ash-contracts-v21';
const CONTRACTS=[
  {id:'cinder_pack',title:'CINDER PACK',region:0,threat:'HARD',text:'A breeding pack has returned to the Farmstead and driven scavengers into the buried houses.',hp:1.35,atk:1.20,reward:{coin:35,iron:10,salvage:5},dropRegion:1},
  {id:'blackroad_tithe',title:'BLACKROAD TITHE',region:1,threat:'DEADLY',text:'Reavers have rebuilt a toll line across the Hollow Causeway under rifle cover.',hp:1.32,atk:1.25,reward:{coin:45,iron:8,salvage:8},dropRegion:2},
  {id:'echo_choir',title:'ECHO CHOIR',region:2,threat:'NIGHTMARE',text:'The bells at Saint Orra have begun answering one another again. The Warden is dead. The choir is not.',hp:1.28,atk:1.30,reward:{coin:55,iron:10,salvage:10},dropRegion:3}
];
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{active:null,completed:{}}}catch{return{active:null,completed:{}}}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function def(id){return CONTRACTS.find(x=>x.id===id)}
function start(id){
  const c=def(id),g=window.Game;if(!c||!g?.state?.wardenDefeated)return;
  const q=load();q.active={id,rewarded:false};save(q);
  g.startBattle(c.region,{});
  const b=g.battle;if(!b)return;
  b.v21Contract=id;
  b.enemies.forEach(e=>{e.max=Math.max(1,Math.round(e.max*c.hp));e.hp=e.max;e.atk=Math.max(1,Math.round(e.atk*c.atk))});
  b.resolve=Math.max(18,b.resolve-8);
  b.lastAction=`HUNT CONTRACT · ${c.title}`;
  g.render();
}
function cancel(){const q=load();if(!q.active)return;q.active=null;save(q)}
function rewardResult(view){
  const q=load(),a=q.active,c=a&&def(a.id),g=window.Game,s=g?.state;
  if(!a||!c||!s?.lastResult||s.lastResult.region!==c.region)return;
  if(!a.rewarded){
    a.rewarded=true;q.completed[c.id]=(q.completed[c.id]||0)+1;save(q);
    const x=g.debugState();
    x.coin+=c.reward.coin;x.iron+=c.reward.iron;x.salvage+=c.reward.salvage;
    const item=g.makeItem(c.dropRegion,{minimum:'uncommon'});
    x.inventory.push(item);x.lastDrops.push(item);
    g.debugSetState(x);
    return;
  }
  if(view.querySelector('.contract-reward-v21'))return;
  const item=s.lastDrops?.[s.lastDrops.length-1];
  const panel=document.createElement('section');panel.className='contract-reward-v21';
  panel.innerHTML=`<small>HUNT CONTRACT COMPLETE</small><b>${c.title}</b><span>Bonus recovery · ◈ +${c.reward.coin} · ⚒ +${c.reward.iron} · ⌁ +${c.reward.salvage}</span><em>Bonus equipment · ${item?.name||'Recovered equipment'}</em>`;
  const rewards=view.querySelector('.rewardchips');rewards?.insertAdjacentElement('afterend',panel);
  view.querySelector('[data-secure]')?.addEventListener('click',cancel,{capture:true,once:true});
}
function board(view){
  const g=window.Game?.state;if(!g?.wardenDefeated||view.querySelector('.hunt-board-v21'))return;
  const q=load();
  const panel=document.createElement('section');panel.className='hunt-board-v21';
  panel.innerHTML=`<header><div><small>POST-WARDEN OPERATIONS</small><b>Hunt Board</b><span>Regional threats that survived the fall of the Penitent Warden.</span></div><i>REPEATABLE</i></header><div class="hunt-contracts-v21">${CONTRACTS.map(c=>`<button data-v21-contract="${c.id}"><small>${c.threat} · ${q.completed[c.id]||0} COMPLETION${(q.completed[c.id]||0)===1?'':'S'}</small><b>${c.title}</b><span>${c.text}</span><em>BOUNTY · ◈ ${c.reward.coin} · ⚒ ${c.reward.iron} · ⌁ ${c.reward.salvage} · bonus gear</em></button>`).join('')}</div>`;
  const directive=view.querySelector('.directive'),victory=view.querySelector('.victorystrip');
  if(victory)victory.insertAdjacentElement('beforebegin',panel);else if(directive)directive.insertAdjacentElement('afterend',panel);else view.append(panel);
  panel.querySelectorAll('[data-v21-contract]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.v21Contract)));
}
function battle(view){
  const q=load(),a=q.active,c=a&&def(a.id),b=window.Game?.battle;if(!a||!c||!b)return;
  if(!b.v21Contract){
    b.v21Contract=c.id;
    b.enemies.forEach(e=>{e.max=Math.max(1,Math.round(e.max*c.hp));e.hp=e.max;e.atk=Math.max(1,Math.round(e.atk*c.atk))});
    b.resolve=Math.max(18,b.resolve-8);b.lastAction=`HUNT CONTRACT · ${c.title}`;
  }
  if(view.querySelector('.contract-banner-v21'))return;
  const banner=document.createElement('div');banner.className='contract-banner-v21';banner.innerHTML=`<small>ACTIVE HUNT</small><b>${c.title}</b><span>${c.threat} CONTRACT</span>`;
  view.querySelector('.battlescene')?.append(banner);
  view.querySelector('[data-retreat]')?.addEventListener('click',cancel,{capture:true,once:true});
}
function scan(){
  const q=load(),s=window.Game?.state;
  if(q.active?.rewarded&&s?.screen==='inventory')cancel();
  ROOT.querySelectorAll('.enclaveview').forEach(board);
  ROOT.querySelectorAll('.battleview').forEach(battle);
  ROOT.querySelectorAll('.resultview').forEach(rewardResult);
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true});scan();
})();
