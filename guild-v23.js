(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
const KEY='bell-beneath-ash-guild-v23';
const CONTRACT_KEY='bell-beneath-ash-contracts-v21';
const ALLIES=[
  {name:'Mara Voss',role:'Bulwark',power:72},
  {name:'Brother Hale',role:'Warden',power:66},
  {name:'Ilyan Reed',role:'Scout',power:61},
  {name:'Sister Rook',role:'Chirurgeon',power:58}
];
const OBJECTIVES=[
  {id:'gate',name:'ASH GATE',type:'FORTIFICATION',def:84,score:110,text:'Break the outer gate and open a lane for allied Hunters.'},
  {id:'bell',name:'BELL TOWER',type:'CONTROL',def:92,score:135,text:'Silence the enemy signal tower before it coordinates reinforcements.'},
  {id:'reliquary',name:'BLACK RELIQUARY',type:'COMMAND',def:104,score:165,text:'Strike the enemy command vault and collapse their war effort.'}
];
function fresh(){return {formed:false,name:'Ashen Covenant',xp:0,level:1,contribution:0,wins:0,losses:0,war:{phase:'idle',assignments:{},attacks:3,score:0,enemyScore:0,log:[],resolved:false,rewarded:false}}}
function load(){try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'null')||{})}catch{return fresh()}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
function game(){return window.Game?.state||null}
function contractState(){try{return JSON.parse(localStorage.getItem(CONTRACT_KEY)||'null')||{completed:{}}}catch{return{completed:{}}}}
function pveContribution(){const g=game(),c=contractState().completed||{};if(!g)return 0;const clears=(g.clears||[]).reduce((a,b)=>a+(b||0),0);const contracts=Object.values(c).reduce((a,b)=>a+(b||0),0);return clears*12+contracts*18+(g.wardenDefeated?30:0)}
function sync(s){const total=pveContribution();if(total>s.contribution){const gain=total-s.contribution;s.contribution=total;s.xp+=gain;while(s.xp>=s.level*100){s.xp-=s.level*100;s.level++}save(s)}return s}
function esc(x){return String(x||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function close(){document.querySelector('.guild-overlay-v23')?.remove()}
function open(){const g=game();if(!g)return;const s=sync(load());render(s)}
function formGuild(s,name){const clean=String(name||'Ashen Covenant').trim().slice(0,28)||'Ashen Covenant';s.formed=true;s.name=clean;s.xp+=25;s.contribution=Math.max(s.contribution,pveContribution());save(s);render(s)}
function resetWar(s){s.war={phase:'prep',assignments:{},attacks:3,score:0,enemyScore:0,log:['War Table opened. Three strike teams await orders.'],resolved:false,rewarded:false};save(s);render(s)}
function assign(s,hunter,obj){if(s.war.phase!=='prep')return;for(const k of Object.keys(s.war.assignments)){if(s.war.assignments[k]===hunter)delete s.war.assignments[k]}s.war.assignments[obj]=hunter;save(s);render(s)}
function launch(s){if(s.war.phase!=='prep'||Object.keys(s.war.assignments).length<3)return;s.war.phase='war';s.war.log.unshift('War horns sounded. Three coordinated attacks remain.');save(s);render(s)}
function hunterPower(name){const g=game(),h=g?.hunters?.find(x=>x.name===name);if(!h)return 60;const stats=window.Game?.hunterStats?window.Game.hunterStats(h):null;return (h.lv||1)*12+(stats?.atk||h.atk||15)+(stats?.hp||h.hp||120)/10}
function strike(s,objId){if(s.war.phase!=='war'||s.war.attacks<=0)return;const o=OBJECTIVES.find(x=>x.id===objId);if(!o)return;const assigned=s.war.assignments[objId]||'Vanguard';const power=hunterPower(assigned)+s.level*5+ALLIES.reduce((a,b)=>a+b.power,0)/12;const roll=0.88+Math.random()*.24;const attack=Math.round(power*roll);const success=attack>=o.def;const gained=success?o.score:Math.round(o.score*.38);const enemyGain=Math.round(58+Math.random()*54+(s.war.attacks===1?22:0));s.war.score+=gained;s.war.enemyScore+=enemyGain;s.war.attacks--;s.war.log.unshift(`${assigned} struck ${o.name}: ${success?'BREACHED':'CONTESTED'} · +${gained} war score.`);if(s.war.attacks<=0){s.war.phase='results';s.war.resolved=true;const win=s.war.score>=s.war.enemyScore;s.war.log.unshift(win?'Enemy command broken. The field belongs to your guild.':'The enemy held enough ground to force withdrawal.');}save(s);render(s)}
function claim(s){if(s.war.phase!=='results'||s.war.rewarded)return;const win=s.war.score>=s.war.enemyScore;s.war.rewarded=true;if(win)s.wins++;else s.losses++;const xp=win?85:45;s.xp+=xp;while(s.xp>=s.level*100){s.xp-=s.level*100;s.level++}const g=window.Game?.debugState?.();if(g){g.coin+=(win?80:35);g.iron+=(win?20:8);g.salvage+=(win?16:6);window.Game.debugSetState(g)}save(s);render(s)}
function rosterHtml(s){const g=game();const hunters=(g?.hunters||[]).map(h=>`<article><div><small>PLAYER HUNTER</small><b>${h.name}</b><span>${h.role} · LV ${h.lv}</span></div><em>${Math.round(hunterPower(h.name))} PWR</em></article>`).join('');const allies=ALLIES.map(a=>`<article class="sim"><div><small>SIMULATED ALLY</small><b>${a.name}</b><span>${a.role}</span></div><em>${a.power} PWR</em></article>`).join('');return hunters+allies}
function warHtml(s){const w=s.war;if(w.phase==='idle')return `<section class="war-empty-v23"><small>WAR TABLE</small><b>No active campaign</b><span>Open a simulated guild war to test preparation, assignments, coordinated attacks and scoring.</span><button data-v23-newwar>OPEN WAR TABLE</button></section>`;
if(w.phase==='prep')return `<section class="war-table-v23"><header><div><small>PHASE I · PREPARATION</small><b>Order of Cinders</b><span>Enemy Guild · power estimate 418</span></div><em>${Object.keys(w.assignments).length}/3 ASSIGNED</em></header><div class="war-objectives-v23">${OBJECTIVES.map(o=>`<article><small>${o.type} · DEF ${o.def}</small><b>${o.name}</b><span>${o.text}</span><div class="assign-row-v23">${['Vanguard','Duelist','Physician'].map(h=>`<button class="${w.assignments[o.id]===h?'selected':''}" data-v23-assign="${o.id}" data-hunter="${h}">${h}</button>`).join('')}</div></article>`).join('')}</div><button class="war-primary-v23" data-v23-launch ${Object.keys(w.assignments).length<3?'disabled':''}>${Object.keys(w.assignments).length<3?'ASSIGN ALL THREE OBJECTIVES':'DECLARE WAR'}</button></section>`;
if(w.phase==='war')return `<section class="war-table-v23 active"><header><div><small>PHASE II · WAR</small><b>${esc(s.name)} vs Order of Cinders</b><span>Coordinated attack window</span></div><em>${w.attacks} ATTACK${w.attacks===1?'':'S'} LEFT</em></header><div class="war-score-v23"><div><small>${esc(s.name).toUpperCase()}</small><b>${w.score}</b></div><i>WAR SCORE</i><div><small>ORDER OF CINDERS</small><b>${w.enemyScore}</b></div></div><div class="war-targets-v23">${OBJECTIVES.map(o=>`<button data-v23-strike="${o.id}" ${w.attacks<=0?'disabled':''}><small>${o.type}</small><b>${o.name}</b><span>${w.assignments[o.id]||'UNASSIGNED'} · ${o.score} max score</span></button>`).join('')}</div><div class="war-log-v23">${w.log.slice(0,4).map(x=>`<span>${esc(x)}</span>`).join('')}</div></section>`;
const win=w.score>=w.enemyScore;return `<section class="war-results-v23 ${win?'win':'loss'}"><small>PHASE III · RESULTS</small><b>${win?'WAR VICTORY':'FIELD WITHDRAWAL'}</b><span>${esc(s.name)} ${w.score} · ${w.enemyScore} Order of Cinders</span><div><em>${win?'+85 GUILD XP · ◈ 80 · ⚒ 20 · ⌁ 16':'+45 GUILD XP · ◈ 35 · ⚒ 8 · ⌁ 6'}</em></div><button data-v23-claim ${w.rewarded?'disabled':''}>${w.rewarded?'REWARDS CLAIMED':'CLAIM WAR REWARDS'}</button><button class="secondary" data-v23-newwar>PREPARE ANOTHER WAR</button></section>`}
function render(s){close();const overlay=document.createElement('div');overlay.className='guild-overlay-v23';overlay.innerHTML=`<section class="guild-shell-v23"><header class="guild-head-v23"><div><small>ENCLAVE COMMAND · V23</small><b>GUILD HALL</b><span>${s.formed?esc(s.name):'SEALED CHAMBER REOPENED'}</span></div><button data-v23-close>×</button></header>${!s.formed?`<main class="guild-form-v23"><small>ESTABLISH A GUILD</small><h2>The Western Road Needs a Banner</h2><p>Form a local prototype guild. This simulates the persistent guild layer before online accounts and real multiplayer are introduced.</p><label>GUILD NAME<input data-v23-name maxlength="28" value="Ashen Covenant"></label><button data-v23-form>ESTABLISH GUILD</button></main>`:`<main class="guild-main-v23"><section class="guild-status-v23"><div><small>GUILD LEVEL</small><b>${s.level}</b><span>${s.xp}/${s.level*100} XP</span></div><div><small>PVE CONTRIBUTION</small><b>${s.contribution}</b><span>campaign + hunts</span></div><div><small>WAR RECORD</small><b>${s.wins}-${s.losses}</b><span>victories · defeats</span></div></section>${warHtml(s)}<section class="guild-roster-v23"><header><small>GUILD ROSTER</small><b>Strike Company</b><span>3 player Hunters · 4 simulated allies</span></header>${rosterHtml(s)}</section></main>`}</section>`;document.body.append(overlay);
overlay.querySelector('[data-v23-close]')?.addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
overlay.querySelector('[data-v23-form]')?.addEventListener('click',()=>formGuild(s,overlay.querySelector('[data-v23-name]')?.value));
overlay.querySelectorAll('[data-v23-newwar]').forEach(b=>b.addEventListener('click',()=>resetWar(s)));
overlay.querySelectorAll('[data-v23-assign]').forEach(b=>b.addEventListener('click',()=>assign(s,b.dataset.hunter,b.dataset.v23Assign)));
overlay.querySelector('[data-v23-launch]')?.addEventListener('click',()=>launch(s));
overlay.querySelectorAll('[data-v23-strike]').forEach(b=>b.addEventListener('click',()=>strike(s,b.dataset.v23Strike)));
overlay.querySelector('[data-v23-claim]')?.addEventListener('click',()=>claim(s));}
function unlockGuild(){ROOT.querySelectorAll('.hotspot.guild').forEach(btn=>{if(btn.dataset.v23Ready)return;btn.dataset.v23Ready='1';btn.classList.remove('locked');btn.disabled=false;const span=btn.querySelector('span');if(span)span.textContent='OPEN';btn.addEventListener('click',open)})}
function scan(){unlockGuild()}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true});scan();
window.GuildV23={open,load,save,reset:()=>{localStorage.removeItem(KEY)},OBJECTIVES};
})();