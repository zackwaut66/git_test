from pathlib import Path
import base64

root=Path(__file__).resolve().parents[1]
css='\n'.join((root/f).read_text() for f in ['app.css','hunterhall-overrides.css','hunterhall-polish.css'])
js='\n'.join((root/f).read_text() for f in ['app.js','hunterhall-v2.js'])
for p in (root/'assets').glob('*.svg'):
    uri='data:image/svg+xml;base64,'+base64.b64encode(p.read_bytes()).decode()
    css=css.replace(f'./assets/{p.name}',uri).replace(f'assets/{p.name}',uri)
    js=js.replace(f'./assets/{p.name}',uri).replace(f'assets/{p.name}',uri)
icon='data:image/svg+xml;base64,'+base64.b64encode((root/'icon.svg').read_bytes()).decode()
html=f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#080b0e"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="icon" href="{icon}"><title>The Bell Beneath Ash · Prototype 0.1</title><style>{css}</style></head><body><div id="app"></div><script>{js}</script></body></html>'''
(root/'standalone.html').write_text(html)
print(f'Built standalone.html ({len(html)} bytes)')
