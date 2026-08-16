from pathlib import Path

app=Path('app.js')
s=app.read_text()
old="[['Penitent Warden',895,38,'front','warden'],['Bellbound Servitor',225,25,'front','servitor'],['Bellbound Servitor',225,26,'front','servitor']]"
new="[['Penitent Warden',895,38,'front','warden'],['Bellbound Servitor',225,25,'front','servitor'],['Censer Servitor',225,26,'front','servitor']]"
if old not in s:
    raise SystemExit('Warden variant target not found')
s=s.replace(old,new,1)
app.write_text(s)

stress=Path('stress-final.mjs')
t=stress.read_text()
needle="// Inventory/economy mutation torture in disposable batches to avoid masking memory leaks as test-harness exhaustion."
block=r'''// Dedicated discovery-event coverage: progression normally leaves the Farmstead after its first clear,
// so explicitly revisit all three non-boss regions and validate every authored discovery event.
await page.reload({waitUntil:'domcontentloaded'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
const dedicatedEvents=await page.evaluate(()=>{
  const titles=new Set();
  for(let region=0;region<3;region++){
    for(let n=0;n<250;n++){
      const s=Game.fresh();
      s.started=true;
      s.screen='map';
      s.clears=[1,1,1,0];
      s.buildings.hall=2;
      s.buildings.tower=3;
      s.crafted=1;
      Game.debugSetState(s);
      Game.depart(region);
      if(Game.state.screen==='event'){
        const title=document.querySelector('.eventcopy h1')?.textContent?.trim();
        if(title)titles.add(title);
        Game.resolveEvent(false);
        if(Game.battle)Game.go('map');
      }else if(Game.battle){
        Game.go('map');
      }
    }
  }
  return [...titles];
});
for(const title of dedicatedEvents)summary.eventCoverage.add(title);

'''
if needle not in t:
    raise SystemExit('Stress insertion point not found')
t=t.replace(needle,block+needle,1)
stress.write_text(t)
print('Final stress coverage patch applied.')
