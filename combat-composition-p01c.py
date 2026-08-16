from pathlib import Path

js=Path('app.js')
cssp=Path('app.css')
s=js.read_text()
css=cssp.read_text()

old="${sceneSvg(x.boss?'warden':'result')}"
new="${sceneSvg(x.boss?'warden':REGIONS[x.region].kind)}"
if old in s:
    s=s.replace(old,new)
elif new not in s:
    raise SystemExit('result scene target not found')

marker='/* P01C_COMBAT_COMPOSITION */'
if marker not in css:
    css += r'''
/* P01C_COMBAT_COMPOSITION */
.enemyformation{left:42%;right:7px;top:64px;bottom:31%;gap:4px;align-items:flex-end}
.allyformation{left:7px;right:44%;bottom:20px;gap:3px;align-items:flex-end}
.battleunit.enemy{width:25%;padding:2px 1px}.battleunit.ally{width:20%}
.battleunit.enemy .figure{width:64px;height:108px}.battleunit.ally .figure{width:60px;height:104px}
.enemyformation .row-back{margin-bottom:44px}.allyformation .row-back{margin-bottom:38px}
.battleunit b{font-size:7.5px;line-height:1.15;margin-top:2px}.battleunit small{font-size:5.8px;line-height:1.15}
.unitbar{height:5px;margin:4px 2px 3px;border:1px solid rgba(125,139,144,.16)}
.battlecallout{top:10px;max-width:82%;padding:7px 13px;background:linear-gradient(90deg,rgba(5,8,10,.05),rgba(9,13,15,.94) 20%,rgba(9,13,15,.94) 80%,rgba(5,8,10,.05));color:#eee9de;border-color:rgba(183,191,188,.5);text-shadow:0 2px 8px #000}
.reticle{top:-15px;font-size:5.5px;padding:2px 5px}
.zone-warden .enemyformation{left:26%;right:8px}.zone-warden .cls-warden{width:52%}.zone-warden .cls-servitor{width:24%}.zone-warden .cls-warden .figure{width:96px!important;height:150px!important}
.resultart .scene{filter:contrast(1.13) saturate(.72)}
.resultart:after{background:linear-gradient(0deg,rgba(6,9,11,.78),transparent 38%),repeating-linear-gradient(174deg,transparent 0 24px,rgba(220,225,219,.018) 25px 26px)}
@media(max-width:420px){.combatvitals{min-width:88px}.combatmeta>div:first-child{max-width:30%}.combatmeta small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.abilities b{font-size:6.7px}}
'''

js.write_text(s)
cssp.write_text(css)
print('Applied 0.1c combat composition and contextual result-scene polish.')
