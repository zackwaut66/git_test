(()=>{
'use strict';
const ROOT=document.querySelector('#app');
if(!ROOT)return;
function metric(label,value,note){return `<div class="facilitymetric"><small>${label}</small><b>${value}</b><span>${note}</span></div>`}
function decorate(sheet){
  if(!sheet||sheet.dataset.v17Decorated==='1')return;
  const title=sheet.querySelector('h2')?.textContent||'';
  const m=title.match(/Lv\s*(\d+)/i),lv=Math.max(1,Math.min(3,Number(m?.[1]||1)));
  let kind='';
  if(/Infirmary/i.test(title))kind='infirmary';
  if(/Scout Tower/i.test(title))kind='tower';
  if(!kind)return;
  sheet.dataset.v17Decorated='1';
  sheet.classList.add('facility-v17',`facility-${kind}-v17`);
  const intro=sheet.querySelector('p');
  const panel=document.createElement('section');
  panel.className='facility-v17-intel';
  if(kind==='infirmary'){
    const failed=Math.max(5,18-lv*4),pulse=6+lv*2,treat=40+lv*5,guard=2+lv;
    panel.innerHTML=`<div class="facility-v17-kicker"><small>MEDICAL READINESS</small><b>FIELD TRIAGE · LV ${lv}</b></div><div class="facility-v17-grid">${metric('FIELD TREATMENT',`+${treat} HP`,'clears Bleed + Marked')}${metric('TRIAGE PULSE',`+${pulse} HP`,'lowest Hunter every 3 turns')}${metric('FAILED FIELD RISK',`-${failed} HP`,'front line injury')}${metric('PREPARED KIT',`${guard} GUARD`,'+8 starting Resolve')}</div>`;
  }else{
    const discover=Math.round((.28+.1*lv)*100),risk=Math.round((.55+.08*lv)*100),edge=8+lv*3,safe=3+lv;
    panel.innerHTML=`<div class="facility-v17-kicker"><small>SCOUT REPORT</small><b>WESTERN MARCH · LV ${lv}</b></div><div class="facility-v17-grid">${metric('FIELD DISCOVERY',`${discover}%`,'chance to locate an event')}${metric('RISK SUCCESS',`${risk}%`,'scouted field action')}${metric('SUCCESS EDGE',`${edge} DMG`,'opening damage on first threat')}${metric('CAUTIOUS EDGE',`${safe} DMG`,'safe-route opening advantage')}</div>`;
  }
  intro?.insertAdjacentElement('afterend',panel);
}
function scan(){ROOT.querySelectorAll('.sheet').forEach(decorate)}
const observer=new MutationObserver(scan);
observer.observe(ROOT,{childList:true,subtree:true});
scan();
})();
