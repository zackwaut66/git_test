(()=>{
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){clearTimeout(timer);if(battle&&S.screen==='battle')battle.paused=true;save();return}
    if(battle&&S.screen==='battle'&&battle.paused){battle.paused=false;clearTimeout(timer);timer=setTimeout(tick,900);render();toast('EXPEDITION RESUMED')}
  });
  window.addEventListener('pagehide',()=>save());
})();