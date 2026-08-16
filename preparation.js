(()=>{
  S.fieldKit??=false;
  const baseEnclave=enclave,baseStart=start;
  function kitCost(){return Math.max(15,25-(S.buildings.infirmary-1)*3)}
  enclave=function(){
    const active=S.fieldKit;
    return `${baseEnclave()}<div class="panel prep"><h2>EXPEDITION PREPARATION</h2><div class=prepbody><div class=prepicon>✚</div><div><h3>Infirmary Field Kit</h3><p class=sub>${active?'Packed for the next combat. The formation begins under temporary Guard.':'Spend Coin to prepare bandages, splints and stimulants for the next expedition combat.'}</p><div class=set>Infirmary Lv ${S.buildings.infirmary} · ${1+S.buildings.infirmary} opening Guard turns</div></div></div>${active?'<button class="btn" disabled>FIELD KIT READY</button>':`<button class=btn onclick="buyFieldKit()">PREPARE KIT · ${kitCost()} COIN</button>`}</div>`
  };
  window.buyFieldKit=function(){const c=kitCost();if(S.coin<c)return toast('NOT ENOUGH COIN');S.coin-=c;S.fieldKit=true;save();render();toast('FIELD KIT PACKED')};
  start=function(i,carry){
    const hadKit=S.fieldKit;
    baseStart(i,carry);
    if(hadKit&&battle){battle.guard=Math.max(battle.guard||0,1+S.buildings.infirmary);battle.resolve=Math.min(100,(battle.resolve||30)+5);S.fieldKit=false;save();render();toast('FIELD KIT DEPLOYED · FORMATION GUARDED')}
  };
  render();
})();