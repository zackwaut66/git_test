from pathlib import Path
p=Path('app.js')
s=p.read_text()
replacements={
"[['Carrion Scavenger',58,11,'front','feral'],['Ash Hound',44,12,'front','feral'],['Farmstead Lurker',52,10,'back','lurker']]":"[['Carrion Scavenger',180,24,'front','feral'],['Ash Hound',145,25,'front','feral'],['Farmstead Lurker',155,22,'back','lurker']]",
"[['Road Reaver',86,15,'front','reaver'],['Road Reaver',78,14,'front','reaver'],['Ashbound Rifleman',66,18,'back','rifleman'],['Bridge Spotter',54,11,'back','spotter']]":"[['Road Reaver',230,23,'front','reaver'],['Road Reaver',215,22,'front','reaver'],['Ashbound Rifleman',185,27,'back','rifleman'],['Bridge Spotter',150,18,'back','spotter']]",
"[['Reliquary Husk',128,18,'front','husk'],['Reliquary Husk',112,17,'front','husk'],['Chapel Thrall',80,17,'front','thrall'],['Bell Hand',70,20,'back','bell']]":"[['Reliquary Husk',295,24,'front','husk'],['Reliquary Husk',265,23,'front','husk'],['Chapel Thrall',200,23,'front','thrall'],['Bell Hand',175,27,'back','bell']]",
"[['Penitent Warden',410,28,'front','warden'],['Bellbound Servitor',118,18,'front','servitor'],['Bellbound Servitor',118,18,'front','servitor']]":"[['Penitent Warden',880,38,'front','warden'],['Bellbound Servitor',240,25,'front','servitor'],['Bellbound Servitor',240,25,'front','servitor']]",
"guard=b.guard?0.56:1":"guard=b.guard?0.68:1",
"(kind==='conservative'||kind==='optimizer'&&battle.region>=2)":"((kind==='conservative'&&battle.region>=1)||kind==='optimizer'&&battle.region>=2)",
"function upgrade(k){const lv=G.buildings[k],cost=lv===1?20:40;if(lv>=3||G.iron<cost)return;G.iron-=cost;G.buildings[k]++;save();render()}":"function upgrade(k){const lv=G.buildings[k],cost=lv===1?20:40;if(lv>=3||G.iron<cost)return;G.iron-=cost;G.buildings[k]++;sheet=null;save();render()}"
}
changed=False
for old,new in replacements.items():
    if old in s:
        s=s.replace(old,new)
        changed=True
    elif new not in s:
        raise SystemExit(f'Expected old or tuned target not found: {old[:80]}')
if "b.guard=3}" in s:
    s=s.replace("b.guard=3}","b.guard=2}")
    changed=True
elif s.count("b.guard=2}") < 2:
    raise SystemExit('Expected tuned Brace duration targets not found')
if changed:
    p.write_text(s)
    print('Applied audited 0.1b balance/UX tuning.')
else:
    print('0.1b balance/UX tuning already applied.')
