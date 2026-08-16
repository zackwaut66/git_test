(()=>{
  const baseView=view,baseWin=win;
  view=function(){if(S.screen==='result')return resultView();return baseView()};
  win=function(){
    if(!battle)return baseWin();
    const snapshot={node:battle.node,boss:battle.boss,coin:S.coin,iron:S.iron,salvage:S.salvage,survivors:battle.party?battle.party.filter(x=>x.hp>0).length:null,total:battle.party?.length||null};
    baseWin();
    const item=S.inventory[S.inventory.length-1];
    S.lastResult={...snapshot,coinGain:S.coin-snapshot.coin,ironGain:S.iron-snapshot.iron,salvageGain:S.salvage-snapshot.salvage,item:item?{name:item.name,rarity:item.rarity,atk:item.atk,slot:item.slot,set:item.set}:null};
    S.screen='result';save();render();
  };
  function resultView(){const r=S.lastResult;if(!r){S.screen='map';return map()}const n=nodes[r.node],item=r.item;return `<div class="panel result ${r.boss?'bossresult':''}"><div class=resultscene><div class=resultlight></div><div class=resultfigures></div></div><div class=resultcopy><div class=objectiveeyebrow>${r.boss?'WARDEN FALLEN':'EXPEDITION VICTORY'}</div><h1>${n[0]} Cleared</h1><p>${r.boss?'The bell tower is silent. The formation stands among the chains and ash while the Enclave signal fires answer across the Marches.':'The hostile formation has broken. The Hunters secure the ground before the ash closes over the road again.'}</p>${r.survivors!=null?`<div class=resultstat>FORMATION · ${r.survivors}/${r.total} standing</div>`:''}<div class=resultrewards><div><span>COIN</span><b>+${r.coinGain}</b></div><div><span>IRON</span><b>+${r.ironGain}</b></div><div><span>SALVAGE</span><b>+${r.salvageGain}</b></div></div>${item?`<div class="resultloot rarity-${item.rarity}"><span>${item.rarity.toUpperCase()} ${item.slot||'GEAR'}</span><h2>${item.name}</h2><p>+${item.atk} ATK${item.set?' · '+item.set+' Set':''}</p></div>`:''}<div class=choice><button class=btn onclick="go('inventory')">${r.boss?'WITNESS THE AFTERMATH':'SECURE LOOT'}</button>${r.boss?'':`<button class=btn onclick="go('map')">RETURN TO MARCHES</button>`}</div></div></div>`}
  render();
})();