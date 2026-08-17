(()=>{
'use strict';
const BASE='bell-beneath-ash-p01b';
const KINGDOM='bell-beneath-ash-kingdom-v27';
const GUILD='bell-beneath-ash-guild-v23';
const REALM='bell-beneath-ash-strategy-v30';
const CONTRACTS='bell-beneath-ash-contracts-v21';
const isObj=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const finite=x=>Number.isFinite(x);
const nonneg=x=>finite(x)&&x>=0;
function parse(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function quarantine(key,reason){
  const raw=localStorage.getItem(key);
  if(raw!==null){try{sessionStorage.setItem(`bell-preflight-quarantine:${key}`,raw.slice(0,200000))}catch{}}
  localStorage.removeItem(key);
  try{console.warn(`[Bell Preflight] Reset unsafe store ${key}: ${reason}`)}catch{}
}
function baseOk(x){
  return isObj(x)&&x.version===3&&typeof x.screen==='string'&&typeof x.started==='boolean'&&
    nonneg(x.coin)&&nonneg(x.iron)&&nonneg(x.salvage)&&isObj(x.buildings)&&
    ['hall','forge','infirmary','tower'].every(k=>nonneg(x.buildings[k])&&x.buildings[k]>=1)&&
    Array.isArray(x.hunters)&&x.hunters.length===3&&x.hunters.every(h=>isObj(h)&&typeof h.name==='string'&&nonneg(h.lv)&&nonneg(h.xp)&&finite(h.hp)&&finite(h.atk))&&
    Array.isArray(x.clears)&&x.clears.length===4&&x.clears.every(nonneg)&&Array.isArray(x.inventory)&&
    isObj(x.equipped)&&nonneg(x.crafted)&&nonneg(x.eventCount)&&typeof x.wardenDefeated==='boolean';
}
function kingdomOk(x){
  return isObj(x)&&x.version===1&&Array.isArray(x.plots)&&x.plots.length===6&&x.plots.every((p,i)=>
    isObj(p)&&typeof p.reclaimed==='boolean'&&(p.building===null||['bastion','arsenal','foundry','shrine'].includes(p.building))&&
    Number.isInteger(p.level)&&p.level>=0&&p.level<=3&&(i!==0||p.reclaimed))&&isObj(x.claims);
}
function guildOk(x){
  if(!isObj(x)||typeof x.formed!=='boolean'||typeof x.name!=='string'||!nonneg(x.xp)||!nonneg(x.level)||!nonneg(x.contribution)||!nonneg(x.wins)||!nonneg(x.losses)||!isObj(x.war))return false;
  const w=x.war;return ['idle','prep','war','results'].includes(w.phase)&&isObj(w.assignments)&&nonneg(w.attacks)&&nonneg(w.score)&&nonneg(w.enemyScore)&&Array.isArray(w.log)&&typeof w.resolved==='boolean'&&typeof w.rewarded==='boolean';
}
function realmOk(x){
  if(!isObj(x)||x.version!==1||typeof x.realmName!=='string'||typeof x.banner!=='string'||!finite(x.prestige)||!nonneg(x.influence)||!nonneg(x.wins)||!nonneg(x.losses)||!isObj(x.army)||!isObj(x.war))return false;
  if(!['levy','guard','scouts'].every(k=>nonneg(x.army[k])))return false;
  const w=x.war;return ['idle','prep','war','results'].includes(w.phase)&&(w.opponent===null||typeof w.opponent==='string')&&nonneg(w.prepUntil)&&nonneg(w.endAt)&&nonneg(w.attacks)&&nonneg(w.score)&&nonneg(w.enemyScore)&&isObj(w.assignments)&&Array.isArray(w.log)&&typeof w.rewarded==='boolean';
}
function contractsOk(x){
  return isObj(x)&&(x.active===null||isObj(x.active))&&isObj(x.completed)&&Object.values(x.completed).every(nonneg);
}
const checks=[[BASE,baseOk],[KINGDOM,kingdomOk],[GUILD,guildOk],[REALM,realmOk],[CONTRACTS,contractsOk]];
const report=[];
for(const [key,ok] of checks){
  if(localStorage.getItem(key)===null)continue;
  const parsed=parse(key);
  if(!ok(parsed)){quarantine(key,'invalid JSON or structural invariant');report.push(key)}
}
window.BellPreflight={version:1,resetStores:report};
})();