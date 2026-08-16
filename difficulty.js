(()=>{
  const baseStart=start;
  const mods=[{hp:2.0,atk:2},{hp:1.5,atk:2},{hp:1.7,atk:3},{hp:1.5,atk:5}];
  start=function(i,carry){
    baseStart(i,carry);
    if(!battle?.enemies||battle.tuned)return;
    const m=mods[i];
    battle.enemies.forEach(e=>{e.hp=Math.round(e.hp*m.hp);e.max=e.hp;e.atk+=m.atk});
    const pieces=setCount();
    if(pieces>=2){const core=battle.party.filter(p=>p.core);const share=5/Math.max(1,core.length);core.forEach(p=>p.atk+=share);battle.set2=true}
    if(pieces>=4){battle.resolve=Math.min(100,battle.resolve+15);battle.set4=true}
    battle.tuned=true;
    render();
  };
  function alive(a){return a.filter(x=>x.hp>0)}
  function hit(u,d){u.hp=Math.max(0,u.hp-Math.max(1,Math.round(d)))}
  function targetEnemy(){
    if(battle.enemies[battle.target]?.hp>0)return battle.enemies[battle.target];
    const idx=battle.enemies.findIndex(x=>x.hp>0);battle.target=Math.max(0,idx);return battle.enemies[battle.target];
  }
  tick=function(){
    if(!battle||S.screen!=='battle')return;
    const b=battle;b.turn++;
    b.party.forEach(u=>{if(u.hp>0&&u.status.bleed>0){hit(u,3);u.status.bleed--}if(u.status.mark>0)u.status.mark--});
    b.enemies.forEach(u=>{if(u.hp>0&&u.status.bleed>0){hit(u,6);u.status.bleed--}if(u.status.broken>0)u.status.broken--});
    let tgt=targetEnemy();
    alive(b.party).forEach(u=>{if(!tgt||tgt.hp<=0)tgt=targetEnemy();if(!tgt)return;const row=u.row==='back'?1.03:1,broken=tgt.status.broken>0?1.25:1;hit(tgt,(u.atk*.28+Math.random()*4)*row*broken)});
    if(!alive(b.enemies).length)return win();
    const fronts=alive(b.party.filter(u=>u.row==='front')),backs=alive(b.party.filter(u=>u.row==='back'));
    alive(b.enemies).forEach(e=>{const pool=(e.row==='back'&&Math.random()<.35&&backs.length)?backs:(fronts.length?fronts:alive(b.party));if(!pool.length)return;const t=pool[Math.floor(Math.random()*pool.length)],mark=t.status.mark>0?1.25:1,guard=b.guard>0?.58:1;hit(t,(e.atk*.58+Math.random()*3)*mark*guard);if(e.cls==='feral'&&Math.random()<.18)t.status.bleed=2;if(e.cls==='rifleman'&&Math.random()<.16)t.status.mark=2;if(e.cls==='warden'&&b.turn%3===0){b.dread=2;t.status.mark=2}});
    if(b.turn%3===0){const doc=b.party.find(u=>u.name==='Physician'&&u.hp>0),w=alive(b.party).sort((a,c)=>a.hp/a.max-c.hp/c.max)[0];if(doc&&w)w.hp=Math.min(w.max,w.hp+7)}
    if(b.guard>0)b.guard--;if(b.dread>0)b.dread--;b.resolve=Math.min(100,b.resolve+(b.dread?5:10));
    if(!alive(b.party).length)return lose();
    render();timer=setTimeout(tick,900);
  };
  render();
})();