(()=>{
  const baseCombat=combat,baseAbility=ability;
  function livingHunter(name){return battle?.party?.some(p=>p.name===name&&p.hp>0)}
  combat=function(){
    let html=baseCombat();if(!battle)return html;
    html=html.replace('SEVER ·40','DUELIST · SEVER ·40').replace('BRACE ·25','VANGUARD · BRACE ·25').replace('FIELD TREATMENT ·35','PHYSICIAN · FIELD TREATMENT ·35');
    if(!livingHunter('Duelist'))html=html.replace('onclick="ability(\'sever\')"','disabled onclick="ability(\'sever\')"');
    if(!livingHunter('Vanguard'))html=html.replace('onclick="ability(\'guard\')"','disabled onclick="ability(\'guard\')"');
    if(!livingHunter('Physician'))html=html.replace('onclick="ability(\'heal\')"','disabled onclick="ability(\'heal\')"');
    return html;
  };
  ability=function(t){
    const owner=t==='sever'?'Duelist':t==='guard'?'Vanguard':t==='heal'?'Physician':null;
    if(owner&&!livingHunter(owner))return toast(`${owner.toUpperCase()} IS DOWN · ABILITY UNAVAILABLE`);
    return baseAbility(t);
  };
  render();
})();