(()=>{
  const pools=[
    [
      {title:'THE BURIED HOUSE',text:'A roofline protrudes from the ash beside the old farm road. The door is below ground, but a narrow window has been broken inward.',a:'SEARCH THE HOUSE',b:'MARK IT AND MOVE',reward:'salvage'},
      {title:'THE SILO VOICES',text:'A rusted grain silo answers the wind with a sound too much like whispering. Fresh scrape marks circle the maintenance hatch.',a:'OPEN THE HATCH',b:'KEEP THE ROAD',reward:'iron'},
      {title:'THE COLD CELLAR',text:'Stone steps descend beneath a collapsed farmhouse. The cellar door is intact, and someone painted an Enclave trail mark on it years ago.',a:'BREAK THE SEAL',b:'LEAVE THE MARK',reward:'coin'}
    ],
    [
      {title:'THE HANGING BUS',text:'A transit carriage hangs half over the collapsed causeway. Something metallic catches the light inside. The concrete beneath it is still shifting.',a:'CROSS INTO THE BUS',b:'TAKE THE LONG ROAD',reward:'iron'},
      {title:'THE LAST CHECKPOINT',text:'Concrete barriers divide the road around a military inspection shelter. One locker remains chained shut; the pavement around it is blackened.',a:'CUT THE CHAIN',b:'BYPASS THE POST',reward:'salvage'},
      {title:'THE SIGNAL LAMP',text:'A dead traffic mast begins blinking once every thirteen seconds as the Hunters approach. The intersection beyond it disappears into dense ash.',a:'FOLLOW THE SIGNAL',b:'HOLD THE ROUTE',reward:'coin'}
    ],
    [
      {title:'THE UNLIT SHRINE',text:'Behind Saint Orra stands a roadside shrine untouched by the collapse. Three black candles remain upright. None have burned.',a:'OPEN THE RELIQUARY',b:'LEAVE IT CLOSED',reward:'coin'},
      {title:'THE SUNKEN VESTRY',text:'Water fills the chapel vestry to the knees. A locked iron case is visible beneath the surface beside a row of empty ceremonial hooks.',a:'ENTER THE WATER',b:'SEAL THE DOOR',reward:'iron'},
      {title:'THE CONFESSIONAL',text:'One confessional remains standing inside the ruined nave. When the formation passes, something knocks twice from the other side of its wooden screen.',a:'OPEN THE SCREEN',b:'DO NOT ANSWER',reward:'salvage'}
    ]
  ];
  function chosen(){const i=battle?.node??0;return pools[i]?.[battle?.variant||0]||events[i]}
  depart=function(i){
    clearTimeout(timer);const tower=S.buildings.tower||1,chance=Math.min(.82,.48+tower*.08);
    if(i<3&&Math.random()<chance){battle={node:i,boss:false,pending:true,variant:Math.floor(Math.random()*pools[i].length)};S.screen='event';render()}else start(i)
  };
  eventView=function(){
    const i=battle?.node??0,e=chosen();
    return `<div class="panel discovery zone-${nodes[i][4]}"><div class=eventscene><div class=eventruin></div></div><div class=eventcopy><div class=set>FIELD DISCOVERY · ${nodes[i][0]}</div><h1>${e.title}</h1><p>${e.text}</p><div class=choice><button class=btn onclick="eventChoice(true)">${e.a}</button><button class=btn onclick="eventChoice(false)">${e.b}</button></div><p class=sub>Scout Tower level changes discovery frequency and the odds of a profitable search. Infirmary level reduces injury when a search goes wrong.</p></div></div>`
  };
  eventChoice=function(risk){
    const i=battle.node,e=chosen(),tower=S.buildings.tower||1,infirmary=S.buildings.infirmary||1;S.events=(S.events||0)+1;
    if(risk){const good=Math.random()<Math.min(.86,.58+tower*.08);if(good){if(e.reward==='salvage')S.salvage+=6+i*2+tower-1;if(e.reward==='iron')S.iron+=10+i*2+tower;if(e.reward==='coin')S.coin+=30+i*5+tower*3;toast('SCOUTING PAID OFF · EXPEDITION ADVANTAGE');battle.edge=10+tower*2}else{const injury=Math.max(5,18-infirmary*4);toast(`FIELD INJURY · ${injury} FRONTLINE DAMAGE`);battle.hurt=injury}}else{battle.edge=4+tower;toast('FORMATION PRESERVED')}
    save();start(i,battle)
  };
  render();
})();