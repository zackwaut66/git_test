(()=>{
  const baseStart=start, baseHunters=hunters, baseMap=map;
  function hallSupport(){
    const l=S.buildings.hall||1;
    return [
      {name:'Enclave Guard',role:'Auxiliary Frontline',unlock:2,desc:'Adds a durable fourth body to expedition formations.'},
      {name:'March Scout',role:'Auxiliary Backline',unlock:3,desc:'Adds a fifth ranged support position to expedition formations.'}
    ].map(x=>`<div class="supportcard ${l<x.unlock?'locked':''}"><b>${x.name}</b><span>${x.role}</span><small>${l>=x.unlock?x.desc:`Hunter Hall Lv ${x.unlock} required`}</small></div>`).join('');
  }
  hunters=function(){
    return `${baseHunters()}<div class="panel hallsupport"><h2>EXPEDITION SUPPORT</h2><div class=supportgrid>${hallSupport()}</div><p class=sub>Hunter Hall upgrades expand the field formation without replacing the three core Hunters.</p></div>`;
  };
  start=function(i,carry){
    baseStart(i,carry);
    if(!battle?.party)return;
    const hall=S.buildings.hall||1;
    battle.party=battle.party.filter(u=>u.core||u.name==='Enclave Guard'&&hall>=2||u.name==='March Scout'&&hall>=3);
    render();
  };
  depart=function(i){
    clearTimeout(timer);
    const tower=S.buildings.tower||1;
    const discoveryChance=Math.min(.82,.48+tower*.08);
    if(i<3&&Math.random()<discoveryChance){battle={node:i,boss:false,pending:true};S.screen='event';render()}
    else start(i);
  };
  eventChoice=function(risk){
    const i=battle.node,e=events[i],tower=S.buildings.tower||1,infirmary=S.buildings.infirmary||1;
    S.events=(S.events||0)+1;
    if(risk){
      const good=Math.random()<Math.min(.86,.58+tower*.08);
      if(good){
        if(e.reward==='salvage')S.salvage+=6+i*2+tower-1;
        if(e.reward==='iron')S.iron+=10+i*2+tower;
        if(e.reward==='coin')S.coin+=30+i*5+tower*3;
        toast('SCOUTING PAID OFF · EXPEDITION ADVANTAGE');
        battle.edge=10+tower*2;
      }else{
        const injury=Math.max(5,18-infirmary*4);
        toast(`FIELD INJURY · ${injury} FRONTLINE DAMAGE`);
        battle.hurt=injury;
      }
    }else{
      battle.edge=4+tower;
      toast('FORMATION PRESERVED');
    }
    save();start(i,battle);
  };
  map=function(){
    const html=baseMap(),tower=S.buildings.tower||1;
    const known=encounters.slice(0,S.revealed).map((e,i)=>`<div class=intelrow><span>${nodes[i][0]}</span><b>${tower>=2?e.trait:'THREAT DETECTED'}</b>${tower>=3?`<small>${i===3?'Warden plus supporting hostiles':'Multiple hostiles expected'}</small>`:''}</div>`).join('');
    return `${html}<div class="panel scoutintel"><h2>SCOUT TOWER INTELLIGENCE · LV ${tower}</h2>${known}<p class=sub>${tower===1?'Upgrade the Scout Tower to identify enemy traits before departure.':tower===2?'Enemy traits identified. Lv 3 estimates formation size and improves field-discovery odds.':'Maximum prototype intelligence: traits, formation estimates and improved discovery outcomes.'}</p></div>`;
  };
  render();
})();