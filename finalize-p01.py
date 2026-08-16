from pathlib import Path

p=Path('app.js')
s=p.read_text()

old="""const EVENTS=[
  {title:'THE BURIED HOUSE',text:'A farmhouse roof cuts through the ash. A broken window opens into the buried rooms below.',risk:'SEARCH BELOW',safe:'MARK THE SITE',resource:'salvage'},
  {title:'THE HANGING BUS',text:'A transit carriage hangs over the collapsed road. A military case is visible behind the shattered glass.',risk:'CROSS INTO IT',safe:'TAKE THE LONG ROAD',resource:'iron'},
  {title:'THE UNLIT SHRINE',text:'Three black candles stand untouched behind Saint Orra. A sealed reliquary rests beneath them.',risk:'BREAK THE SEAL',safe:'LEAVE IT CLOSED',resource:'coin'}
];
"""
new="""const EVENTS=[
  [
    {title:'THE BURIED HOUSE',text:'A farmhouse roof cuts through the ash. A broken window opens into the buried rooms below.',risk:'SEARCH BELOW',safe:'MARK THE SITE',resource:'salvage'},
    {title:'THE CINDER WELL',text:'The old irrigation well is warm to the touch. Something metallic knocks against the stone far below.',risk:'LOWER A HUNTER',safe:'SEAL THE WELL',resource:'iron'},
    {title:'THE EMPTY TABLE',text:'A table has been set for six inside a roofless kitchen. The ash has fallen everywhere except the plates.',risk:'SEARCH THE HOUSE',safe:'KEEP MOVING',resource:'coin'}
  ],
  [
    {title:'THE HANGING BUS',text:'A transit carriage hangs over the collapsed road. A military case is visible behind the shattered glass.',risk:'CROSS INTO IT',safe:'TAKE THE LONG ROAD',resource:'iron'},
    {title:'THE TOLL KEEPER',text:'A body in road leathers still sits upright inside the toll booth. Its hand is closed around a ring of keys.',risk:'TAKE THE KEYS',safe:'LEAVE THE DEAD',resource:'coin'},
    {title:'THE SUNKEN CONVOY',text:'Three military carriers lie nose-down in the ash beneath the bridge. One rear hatch remains above the surface.',risk:'CLIMB DOWN',safe:'MARK THE WRECK',resource:'salvage'}
  ],
  [
    {title:'THE UNLIT SHRINE',text:'Three black candles stand untouched behind Saint Orra. A sealed reliquary rests beneath them.',risk:'BREAK THE SEAL',safe:'LEAVE IT CLOSED',resource:'coin'},
    {title:'THE CHOIR DOOR',text:'A narrow iron door behind the chapel hums with a voice too low to be a hymn. Fresh tool marks scar the lock.',risk:'FORCE IT OPEN',safe:'BAR THE DOOR',resource:'iron'},
    {title:'THE BONE CENSER',text:'A silver censer swings from a dead branch without wind. Black ash falls upward into its bowl.',risk:'CUT IT DOWN',safe:'PASS IN SILENCE',resource:'salvage'}
  ]
];
const ENCOUNTER_VARIANTS=[
  [
    [['Cinder Scavenger',175,24,'front','feral'],['Ash Hound',150,24,'front','feral'],['Grainhouse Lurker',160,22,'back','lurker']],
    [['Farmhand Thrall',190,22,'front','thrall'],['Carrion Scavenger',165,24,'front','feral'],['Silo Lurker',150,24,'back','lurker']]
  ],
  [
    [['Tollhouse Reaver',225,23,'front','reaver'],['Road Reaver',220,22,'front','reaver'],['Cinder Rifleman',180,27,'back','rifleman'],['Bridge Spotter',155,18,'back','spotter']],
    [['Road Reaver',235,23,'front','reaver'],['Ashbound Rifleman',180,26,'back','rifleman'],['Ashbound Rifleman',170,25,'back','rifleman'],['Span Watcher',165,19,'back','spotter']]
  ],
  [
    [['Reliquary Husk',285,24,'front','husk'],['Chapel Thrall',215,23,'front','thrall'],['Chapel Thrall',205,23,'front','thrall'],['Bell Hand',180,27,'back','bell']],
    [['Reliquary Husk',300,24,'front','husk'],['Reliquary Husk',250,23,'front','husk'],['Votive Thrall',205,22,'front','thrall'],['Choir Bell Hand',175,28,'back','bell']]
  ],
  [
    [['Penitent Warden',880,38,'front','warden'],['Bellbound Servitor',235,25,'front','servitor'],['Ashen Servitor',245,25,'front','servitor']],
    [['Penitent Warden',895,38,'front','warden'],['Bellbound Servitor',225,25,'front','servitor'],['Bellbound Servitor',225,26,'front','servitor']]
  ]
];
"""
if old not in s: raise SystemExit('EVENT block not found')
s=s.replace(old,new)

repls={
"let G=load();let battle=null;let timer=null;let pendingRegion=null;let sheet=null;":"let G=load();let battle=null;let timer=null;let pendingRegion=null;let pendingEvent=0;let sheet=null;",
"function reset(){localStorage.removeItem(KEY);G=fresh();battle=null;pendingRegion=null;sheet=null;render()}":"function reset(){localStorage.removeItem(KEY);G=fresh();battle=null;pendingRegion=null;pendingEvent=0;sheet=null;render()}",
"ASHEN MARCHES · P0.1D":"ASHEN MARCHES · P0.1 FINAL",
"function eventView(){const e=EVENTS[pendingRegion];return":"function eventView(){const pool=EVENTS[pendingRegion],e=pool[pendingEvent%pool.length];return",
"function depart(i){if(!regionOpen(i))return;pendingRegion=i;const eventAllowed=i<3&&G.clears[0]>0;":"function depart(i){if(!regionOpen(i))return;pendingRegion=i;pendingEvent=i<3?Math.floor(Math.random()*EVENTS[i].length):0;const eventAllowed=i<3&&G.clears[0]>0;",
"function resolveEvent(risk){const i=pendingRegion,e=EVENTS[i],tower=G.buildings.tower,infirmary=G.buildings.infirmary;":"function resolveEvent(risk){const i=pendingRegion,pool=EVENTS[i],e=pool[pendingEvent%pool.length],tower=G.buildings.tower,infirmary=G.buildings.infirmary;",
"function startBattle(i,carry={}){pendingRegion=null;const enemies=REGIONS[i].enemies.map((x,n)=>":"function startBattle(i,carry={}){pendingRegion=null;const base=REGIONS[i].enemies,variants=ENCOUNTER_VARIANTS[i]||[],source=variants.length&&Math.random()<.45?variants[Math.floor(Math.random()*variants.length)]:base,enemies=source.map((x,n)=>",
"const names={Weapon:['Grave-Iron Blade','Blackroad Cleaver','Cinder Pike','Pilgrim Severance'],Head:['Ash Hood','Watchman Visor','Reliquary Helm','Mourning Cowl'],Armor:['Road Mantle','Graveplate Coat','Ash-Walker Harness','Watchman Plate'],Charm:['Censer Shard','Bellbone Talisman','Black Salt Reliquary','Pilgrim Token']};return{id:Date.now()+itemId+++(Math.random()),name:opt.name||names[slot][Math.floor(Math.random()*names[slot].length)],slot,rarity,atk:base,hp,set,affix:['Keen','Stalwart','Hollow','Vicious','Consecrated','Ashbound'][Math.floor(Math.random()*6)]}":"const names={Weapon:['Grave-Iron Blade','Blackroad Cleaver','Cinder Pike','Pilgrim Severance','Bell-Tooth Saber','Marcher Falchion','Saint Orra Hatchet','Coffin Nail Spear'],Head:['Ash Hood','Watchman Visor','Reliquary Helm','Mourning Cowl','Roadwarden Mask','Cinder Veil','Penitent Sallet','Blackglass Hood'],Armor:['Road Mantle','Graveplate Coat','Ash-Walker Harness','Watchman Plate','Pilgrim Brigandine','Cindercoat','Reliquary Harness','Marchwarden Plate'],Charm:['Censer Shard','Bellbone Talisman','Black Salt Reliquary','Pilgrim Token','Saint Orra Medal','Roadside Reliquary','Hollow Coin','Ashen Rosary']};return{id:Date.now()+itemId+++(Math.random()),name:opt.name||names[slot][Math.floor(Math.random()*names[slot].length)],slot,rarity,atk:base,hp,set,affix:['Keen','Stalwart','Hollow','Vicious','Consecrated','Ashbound','Grim','Watchful','Penitent','Cinderworn','Relic-Bound','Roadforged'][Math.floor(Math.random()*12)]}"
}
for a,b in repls.items():
    if a not in s: raise SystemExit('Missing replacement target: '+a[:90])
    s=s.replace(a,b)

p.write_text(s)
print('Prototype 0.1 final variation pass applied.')
