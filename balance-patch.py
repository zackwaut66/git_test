from pathlib import Path
p=Path('app.js')
s=p.read_text()
replacements={
"[['Carrion Scavenger',58,11,'front','feral'],['Ash Hound',44,12,'front','feral'],['Farmstead Lurker',52,10,'back','lurker']]":"[['Carrion Scavenger',180,24,'front','feral'],['Ash Hound',145,25,'front','feral'],['Farmstead Lurker',155,22,'back','lurker']]",
"[['Road Reaver',86,15,'front','reaver'],['Road Reaver',78,14,'front','reaver'],['Ashbound Rifleman',66,18,'back','rifleman'],['Bridge Spotter',54,11,'back','spotter']]":"[['Road Reaver',230,23,'front','reaver'],['Road Reaver',215,22,'front','reaver'],['Ashbound Rifleman',185,27,'back','rifleman'],['Bridge Spotter',150,18,'back','spotter']]",
"[['Reliquary Husk',128,18,'front','husk'],['Reliquary Husk',112,17,'front','husk'],['Chapel Thrall',80,17,'front','thrall'],['Bell Hand',70,20,'back','bell']]":"[['Reliquary Husk',295,24,'front','husk'],['Reliquary Husk',265,23,'front','husk'],['Chapel Thrall',200,23,'front','thrall'],['Bell Hand',175,27,'back','bell']]",
"[['Penitent Warden',410,28,'front','warden'],['Bellbound Servitor',118,18,'front','servitor'],['Bellbound Servitor',118,18,'front','servitor']]":"[['Penitent Warden',880,38,'front','warden'],['Bellbound Servitor',240,25,'front','servitor'],['Bellbound Servitor',240,25,'front','servitor']]",
"guard=b.guard?0.56:1":"guard=b.guard?0.68:1",
"(kind==='conservative'||kind==='optimizer'&&battle.region>=2)":"((kind==='conservative'&&battle.region>=1)||kind==='optimizer'&&battle.region>=2)"
}
for old,new in replacements.items():
    if old not in s:
        raise SystemExit(f'Expected balance target not found: {old[:80]}')
    s=s.replace(old,new)
# Both player-facing Brace and automated audit Brace use this assignment.
if s.count("b.guard=3}") < 2:
    raise SystemExit('Expected Brace duration targets not found')
s=s.replace("b.guard=3}","b.guard=2}")
p.write_text(s)
print('Applied audited 0.1b balance tuning.')
