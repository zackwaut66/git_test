(()=>{
  const baseGo=go;
  go=function(x){if(S.screen!==x)history.pushState({screen:x},'',`#${x}`);baseGo(x)};
  window.addEventListener('popstate',e=>{clearTimeout(timer);const x=e.state?.screen||'enclave';S.screen=x;save();render()});
  const initial=['enclave','hunters','map','inventory','forge','loadout'].includes(location.hash.slice(1))?location.hash.slice(1):S.screen;
  S.screen=['battle','event'].includes(initial)?'enclave':initial;history.replaceState({screen:S.screen},'',`#${S.screen}`);save();render();
})();