(()=>{
  S.tutorialSeen??=false;
  const baseView=view,baseNav=nav;
  view=function(){if(!S.tutorialSeen)return briefing();return baseView()};
  nav=function(){if(!S.tutorialSeen)return '';return baseNav()};
  function briefing(){return `<div class="briefing"><div class=briefscene><div class=briefsky></div><div class=briefcity></div></div><div class=briefcopy><div class=objectiveeyebrow>FIELD BRIEFING · PROTOTYPE 0.1</div><h1>The Ashen Marches</h1><p>The Enclave survives by sending Hunters beyond its walls. Clear buried roads, recover equipment, strengthen the settlement, and push through the fog until the Penitent Warden can be reached.</p><div class=briefsteps><div><b>1</b><span><strong>PREPARE</strong>Upgrade the Enclave, equip Hunters, and pack an Infirmary field kit when needed.</span></div><div><b>2</b><span><strong>EXPLORE</strong>Choose revealed Marches locations. Field discoveries can reward risk or injure the formation.</span></div><div><b>3</b><span><strong>COMMAND</strong>Hunters attack automatically. Tap enemies to focus them and spend shared Resolve on Hunter abilities.</span></div><div><b>4</b><span><strong>RETURN STRONGER</strong>Equip, compare, salvage and craft gear. Victories reveal the road to the Warden.</span></div></div><button class=btn onclick="finishBriefing()">ENTER THE ENCLAVE</button></div></div>`}
  window.finishBriefing=function(){S.tutorialSeen=true;S.screen='enclave';save();history.replaceState({screen:'enclave'},'','#enclave');render()};
  render();
})();