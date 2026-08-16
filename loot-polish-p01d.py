from pathlib import Path
import re

js_path=Path('app.js')
css_path=Path('app.css')
s=js_path.read_text()
css=css_path.read_text()

s=s.replace('ASHEN MARCHES · P0.1C','ASHEN MARCHES · P0.1D')

inventory=r'''function setCard(name){const n=setCount(name),d=SETS[name];return `<div class="setcard ${n>=4?'complete':n>=2?'active':''}"><div class="settitle"><b>${name}</b><span>${n}/4</span></div><div class="setpips">${[0,1,2,3].map(x=>`<i class="${x<n?'filled':''}"></i>`).join('')}</div><small>2PC ${n>=2?'ACTIVE':'LOCKED'} · ${d.two}</small><small>4PC ${n>=4?'ACTIVE':'LOCKED'} · ${d.four}</small></div>`}
function inventoryView(){const h=G.selectedHunter;return `<main class="gameview inventoryview"><section class="inventoryhead"><div><small>STOREHOUSE · COMPARE FOR ${h.toUpperCase()}</small><h2>Recovered Equipment</h2><span>${G.inventory.length} items · ${countEquipped()} equipped</span></div><button data-building="forge">OPEN FORGE</button></section><section class="setbar">${setCard('Ashen Pilgrim')}${setCard('Mourning Watch')}</section><section class="huntertabs">${G.hunters.map(x=>`<button class="${h===x.name?'active':''}" data-hunter="${x.name}">${x.name}</button>`).join('')}</section><section class="lootlist">${G.inventory.length?G.inventory.slice().sort((a,b)=>(b.owner===h)-(a.owner===h)||rarityRank(b.rarity)-rarityRank(a.rarity)||(b.atk||0)-(a.atk||0)).map(i=>itemRow(i,h)).join(''):'<div class="emptyloot">The shelves are empty. Enter the Marches.</div>'}</section></main>`}
function rarityRank(r){return {common:0,uncommon:1,rare:2,relic:3}[r]||0}
function currentFor(h,slot){return G.equipped[`${h}:${slot}`]||null}
function signed(n){return n>0?`+${n}`:`${n}`}
function compareLine(i,h){if(i.owner===h)return {cls:'equipped',text:'CURRENTLY EQUIPPED'};const cur=currentFor(h,i.slot);if(!cur)return {cls:'gain',text:`EMPTY ${i.slot.toUpperCase()} SLOT · +${i.atk||0} ATK${i.hp?` · +${i.hp} HP`:''}`};const da=(i.atk||0)-(cur.atk||0),dh=(i.hp||0)-(cur.hp||0),better=da>=0&&dh>=0&&(da>0||dh>0),worse=da<=0&&dh<=0&&(da<0||dh<0),setNote=i.set!==cur.set?` · SET ${i.set||'NONE'} ↔ ${cur.set||'NONE'}`:'';return {cls:better?'gain':worse?'loss':'mixed',text:`VS ${esc(cur.name)} · ATK ${signed(da)} · HP ${signed(dh)}${setNote}`}}
function itemRow(i,h){const eq=i.owner?`EQUIPPED · ${i.owner}`:'UNEQUIPPED',set=i.set?` · ${i.set}`:'',cmp=compareLine(i,h),fresh=G.lastDrops.some(x=>x.id===i.id);return `<article class="lootrow rarity-${i.rarity} compare-${cmp.cls} ${fresh?'freshdrop':''}"><div class="itemicon">${slotIcon(i.slot)}</div><div class="itemcopy"><small>${fresh?'<em>NEW</em> · ':''}${i.rarity.toUpperCase()} · ${i.slot}${set}</small><b>${esc(i.name)}</b><span>${i.affix} · +${i.atk||0} ATK${i.hp?` · +${i.hp} HP`:''} · ${eq}</span><strong class="compareline">${cmp.text}</strong></div><div class="itemactions"><button data-equip="${i.id}" data-owner="${h}">${i.owner===h?'EQUIPPED':`EQUIP → ${h}`}</button><button data-salvage="${i.id}" ${i.owner?'disabled':''}>SALVAGE</button></div></article>`}
function slotIcon'''

s,n=re.subn(r"function inventoryView\(\)\{.*?\}\nfunction slotIcon", inventory, s, count=1, flags=re.S)
if n!=1: raise SystemExit('inventory replacement failed')

marker='/* P01D_LOOT_COMPARE */'
if marker not in css:
    css += r'''
/* P01D_LOOT_COMPARE */
.inventoryview{grid-template-rows:64px 60px 34px 1fr}.setbar{height:60px;grid-template-columns:1fr 1fr;gap:5px;padding:4px 8px}.setcard{border:1px solid #323e43!important;padding:4px 5px!important;min-width:0;background:linear-gradient(180deg,#0e1518,#090e10)}.setcard.active{border-color:#6e684f!important}.setcard.complete{border-color:#9b8057!important;box-shadow:inset 0 0 12px rgba(176,144,97,.08)}.settitle{display:flex;align-items:center;justify-content:space-between;gap:5px}.settitle b{font:9px Georgia,serif!important;color:#c8b896}.settitle span{font-size:6.5px!important;color:#a99a7d!important;margin:0!important}.setpips{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin:3px 0}.setpips i{height:3px;background:#293136;border:1px solid #394348}.setpips i.filled{background:#9b8057;border-color:#af956c}.setcard small{display:block;font-size:5.5px;color:#7f8b8f;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lootrow{min-height:82px}.itemcopy em{font-style:normal;color:#d3b36f;letter-spacing:.6px}.compareline{display:block;margin-top:4px;font-size:6.3px;line-height:1.2;letter-spacing:.25px;color:#89969a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.compare-gain .compareline{color:#9fb69a}.compare-loss .compareline{color:#ad8580}.compare-mixed .compareline{color:#b2a27f}.compare-equipped .compareline{color:#8fa7ac}.freshdrop{background:linear-gradient(90deg,#151b1d,#0b1012);box-shadow:inset 0 0 0 1px rgba(184,158,101,.05)}
'''

js_path.write_text(s)
css_path.write_text(css)
print('Applied Prototype 0.1d loot comparison and set-chase presentation.')
