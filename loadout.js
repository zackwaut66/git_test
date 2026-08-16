(()=>{
  const baseView=view,baseHunters=hunters,baseInventory=inventory;
  view=function(){if(S.screen==='loadout')return loadoutView();return baseView()};
  hunters=function(){return `${baseHunters()}<div class="panel loadoutentry"><h2>LOADOUT PLANNING</h2><p class=sub>Compare equipped gear by Hunter and slot before committing changes.</p><button class=btn onclick="go('loadout')">OPEN LOADOUT COMPARISON</button></div>`};
  inventory=function(){return `${baseInventory()}<div class="panel loadoutentry"><button class=btn onclick="go('loadout')">COMPARE HUNTER LOADOUTS</button></div>`};
  function current(h,slot){return S.equipped?.[`${h}:${slot}`]||null}
  function candidates(slot){return S.inventory.filter(i=>i.slot===slot&&!i.owner).sort((a,b)=>(b.atk||0)-(a.atk||0))}
  function slotRow(h,slot){
    const cur=current(h,slot),best=candidates(slot)[0],delta=best?(best.atk||0)-(cur?.atk||0):null;
    return `<div class="loadoutslot"><div><span class=slotbadge>${slot}</span><b>${cur?cur.name:'EMPTY'}</b><small>${cur?`${cur.rarity.toUpperCase()} · +${cur.atk} ATK · ${cur.affix}`:'No item equipped'}</small></div><div class=upgradepick>${best?`<span class="${delta>0?'upgradegood':delta<0?'upgradebad':''}">${delta>=0?'+':''}${delta} ATK</span><b>${best.name}</b><small>${best.rarity.toUpperCase()}${best.set?' · '+best.set:''}</small><button class="btn small" onclick="equipTo(${best.id},'${h}')">EQUIP</button>`:'<span class=sub>No unequipped candidate</span>'}</div></div>`
  }
  function loadoutView(){
    const slots=['Weapon','Head','Armor','Charm'];
    return `<div class="panel loadoutview"><h2>HUNTER LOADOUTS</h2><p class=sub>Each Hunter has one slot of each type. The right column shows the strongest currently unequipped candidate for that slot; set pieces may be worth taking even when raw ATK is lower.</p>${S.hunters.map(h=>`<section class=hunterloadout><header><h3>${h.n} · LV ${h.lv}</h3><span>POWER ${power(h)}</span></header>${slots.map(s=>slotRow(h.n,s)).join('')}</section>`).join('')}<div class=set>Ashen Pilgrim pieces equipped: ${setCount()} ${setCount()>=2?'· SET BONUS ACTIVE':''}</div><div class=choice><button class=btn onclick="go('inventory')">STOREHOUSE</button><button class=btn onclick="go('hunters')">HUNTER HALL</button></div></div>`
  }
  render();
})();