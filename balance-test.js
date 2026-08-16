// Monte Carlo balance smoke test for Prototype 0.1.
// 25,000 runs per region = 100,000 simulated expeditions on every CI pass.
const RUNS_PER_REGION=25000;
const regions=[
  {name:'Forsaken Farmstead',enemies:[[66,13,'front','feral'],[62,12,'front','feral'],[54,15,'front','feral'],[74,11,'back','lurker']]},
  {name:'Hollow Causeway',enemies:[[82,15,'front','reaver'],[78,15,'front','reaver'],[68,19,'back','rifleman'],[64,18,'back','rifleman'],[58,10,'back','spotter']]},
  {name:'Saint Orra Chapel',enemies:[[125,17,'front','husk'],[118,16,'front','husk'],[76,14,'front','thrall'],[70,18,'back','bell']]},
  {name:'Penitent Warden',enemies:[[330,24,'front','warden'],[92,16,'front','servitor'],[92,16,'front','servitor']]}
];
function party(region){
  // Expected vertical-slice progression: the core three always deploy; Hall upgrades add support.
  const bonus=[0,3,7,11][region],hall=[1,2,2,3][region];
  const p=[
    {name:'Vanguard',hp:150,max:150,atk:16+bonus,row:'front',status:{}},
    {name:'Duelist',hp:105,max:105,atk:24+bonus,row:'front',status:{}},
    {name:'Physician',hp:115,max:115,atk:12+bonus,row:'back',status:{}}
  ];
  if(hall>=2)p.push({name:'Enclave Guard',hp:105,max:105,atk:11,row:'front',status:{}});
  if(hall>=3)p.push({name:'March Scout',hp:78,max:78,atk:14,row:'back',status:{}});
  return p;
}
function living(a){return a.filter(x=>x.hp>0)}
function hit(u,d){u.hp=Math.max(0,u.hp-Math.max(1,Math.round(d)))}
function run(regionIndex){
  const p=party(regionIndex),es=regions[regionIndex].enemies.map((e,id)=>({hp:e[0],max:e[0],atk:e[1],row:e[2],cls:e[3],id,status:{}}));
  let resolve=30,guard=0,dread=0,turn=0,target=0;
  while(living(p).length&&living(es).length&&turn<120){
    turn++;
    p.forEach(u=>{if(u.hp>0&&u.status.bleed>0){hit(u,3);u.status.bleed--}if(u.status.mark>0)u.status.mark--});
    es.forEach(u=>{if(u.hp>0&&u.status.bleed>0){hit(u,6);u.status.bleed--}if(u.status.broken>0)u.status.broken--});
    let tgt=es[target];if(!tgt||tgt.hp<=0){target=es.findIndex(x=>x.hp>0);tgt=es[target]}
    living(p).forEach(u=>{if(!tgt||tgt.hp<=0){target=es.findIndex(x=>x.hp>0);tgt=es[target]}if(!tgt)return;hit(tgt,(u.atk*.32+Math.random()*4)*(tgt.status.broken>0?1.25:1))});
    const wounded=living(p).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];
    if(wounded&&wounded.hp/wounded.max<.43&&resolve>=35){resolve-=35;wounded.hp=Math.min(wounded.max,wounded.hp+42);wounded.status.bleed=0;wounded.status.mark=0}
    else if(tgt&&resolve>=40&&tgt.hp>70){resolve-=40;hit(tgt,48);tgt.status.bleed=3;tgt.status.broken=2}
    else if(tgt&&resolve>=30&&tgt.hp<55){resolve-=30;hit(tgt,38+Math.random()*10)}
    if(!living(es).length)break;
    const fronts=living(p.filter(u=>u.row==='front')),backs=living(p.filter(u=>u.row==='back'));
    living(es).forEach(e=>{let pool=(e.row==='back'&&Math.random()<.35&&backs.length)?backs:(fronts.length?fronts:living(p));if(!pool.length)return;let t=pool[Math.floor(Math.random()*pool.length)],mark=t.status.mark>0?1.25:1,block=guard>0?.58:1;hit(t,(e.atk*.34+Math.random()*3)*mark*block);if(e.cls==='feral'&&Math.random()<.18)t.status.bleed=2;if(e.cls==='rifleman'&&Math.random()<.16)t.status.mark=2;if(e.cls==='warden'&&turn%3===0){dread=2;t.status.mark=2}});
    if(turn%3===0){const doc=p.find(u=>u.name==='Physician'&&u.hp>0),w=living(p).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(doc&&w)w.hp=Math.min(w.max,w.hp+7)}
    if(guard>0)guard--;if(dread>0)dread--;resolve=Math.min(100,resolve+(dread?5:10));
  }
  return {win:living(es).length===0,turns:turn,survivors:living(p).length};
}
let total=0,failures=[];
for(let r=0;r<regions.length;r++){
  let wins=0,turns=0,survivors=0;
  for(let i=0;i<RUNS_PER_REGION;i++){const x=run(r);wins+=x.win?1:0;turns+=x.turns;survivors+=x.survivors}
  const rate=wins/RUNS_PER_REGION;total+=RUNS_PER_REGION;
  console.log(`${regions[r].name}: ${(rate*100).toFixed(1)}% wins | ${(turns/RUNS_PER_REGION).toFixed(1)} avg turns | ${(survivors/RUNS_PER_REGION).toFixed(2)} avg survivors`);
  if(rate<.08||rate>.995)failures.push(`${regions[r].name} ${(rate*100).toFixed(1)}%`);
}
console.log(`Balance smoke test complete: ${total.toLocaleString()} simulated expeditions.`);
if(failures.length)throw new Error(`Balance outliers: ${failures.join(', ')}`);
