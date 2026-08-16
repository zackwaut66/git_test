(()=>{
'use strict';
const ROOT=document.querySelector('#app');if(!ROOT)return;
document.documentElement.classList.add('ui-v25');document.body.classList.add('polish-v25');
function polish(){
 ROOT.querySelectorAll('button').forEach(b=>{
  if(!b.hasAttribute('type'))b.type='button';
  if(b.disabled)b.setAttribute('aria-disabled','true');else b.removeAttribute('aria-disabled');
  const t=(b.innerText||b.textContent||'').trim().replace(/\s+/g,' ');if(t&&!b.getAttribute('aria-label'))b.setAttribute('aria-label',t.slice(0,120));
 });
 ROOT.querySelectorAll('.sheet,.production-sheet-v24').forEach(s=>{if(!s.getAttribute('role'))s.setAttribute('role','region')});
 ROOT.querySelectorAll('.hpbar,.resolvebar').forEach(x=>{if(!x.getAttribute('role'))x.setAttribute('role','progressbar')});
 const live=ROOT.querySelector('.v25-live')||(()=>{const n=document.createElement('div');n.className='v25-live';n.setAttribute('aria-live','polite');n.setAttribute('aria-atomic','true');Object.assign(n.style,{position:'absolute',width:'1px',height:'1px',overflow:'hidden',clip:'rect(0 0 0 0)'});ROOT.appendChild(n);return n})();
 const view=ROOT.querySelector('.gameview');if(view){const label=(view.querySelector('h1,h2,.brand')?.textContent||'').trim();if(label&&live.dataset.last!==label){live.dataset.last=label;live.textContent=label}}
}
let q=false;function schedule(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;polish()})}
new MutationObserver(schedule).observe(ROOT,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','class']});polish();
})();