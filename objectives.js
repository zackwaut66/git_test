(()=>{
  S.objectiveStep??=0;S.clears??=[0,0,0,0];S.craftedItems??=0;
  const baseEnclave=enclave,objectiveBaseWin=win;
  const tasks=[
    {title:'Open the Western Road',text:'Clear the Forsaken Farmstead once.',done:()=>S.clears?.[0]>=1,reward:{coin:25,iron:8}},
    {title:'Strengthen the Hall',text:'Raise the Hunter Hall to Level 2 and unlock Enclave Guard support.',done:()=>S.buildings.hall>=2,reward:{coin:20,iron:10}},
    {title:'Break the Causeway',text:'Clear the Hollow Causeway once.',done:()=>S.clears?.[1]>=1,reward:{coin:35,salvage:6}},
    {title:'Arm the March',text:'Craft at least one piece of gear at the Forge.',done:()=>S.craftedItems>=1,reward:{iron:12,salvage:8}},
    {title:'Silence Saint Orra',text:'Clear Saint Orra Chapel once.',done:()=>S.clears?.[2]>=1,reward:{coin:45,iron:15}},
    {title:'The Bell Must Stop',text:'Defeat the Penitent Warden.',done:()=>S.clears?.[3]>=1,reward:{coin:100,iron:30,salvage:20}}
  ];
  win=function(){const region=battle?.node;objectiveBaseWin();if(Number.isInteger(region)){S.clears[region]=(S.clears[region]||0)+1;save()}};
  const oldForgeCraft=window.forgeCraft;
  if(oldForgeCraft)window.forgeCraft=function(){const before=S.inventory.length;oldForgeCraft();if(S.inventory.length>before){S.craftedItems++;save();render()}};
  function rewardText(r){return Object.entries(r).map(([k,v])=>`${v} ${k.toUpperCase()}`).join(' · ')}
  enclave=function(){
    const i=Math.min(S.objectiveStep,tasks.length),t=tasks[i];
    const panel=i>=tasks.length?`<div class="panel objective complete"><div class=objectiveeyebrow>VERTICAL SLICE</div><h2>THE MARCH HOLDS</h2><p>The Penitent Warden is dead. Prototype 0.1's guided objective chain is complete.</p></div>`:`<div class="panel objective ${t.done()?'ready':''}"><div class=objectiveeyebrow>ACTIVE OBJECTIVE · ${i+1}/${tasks.length}</div><h2>${t.title}</h2><p>${t.text}</p><div class=set>REWARD · ${rewardText(t.reward)}</div>${t.done()?'<button class=btn onclick="claimObjective()">CLAIM & ADVANCE</button>':'<div class="objectivepending">IN PROGRESS</div>'}</div>`;
    return `${panel}${baseEnclave()}`
  };
  window.claimObjective=function(){const t=tasks[S.objectiveStep];if(!t||!t.done())return;Object.entries(t.reward).forEach(([k,v])=>S[k]=(S[k]||0)+v);S.objectiveStep++;save();render();toast('OBJECTIVE COMPLETE · REWARD SECURED')};
  render();
})();