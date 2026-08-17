(()=>{
'use strict';
const PREFIX='bell-beneath-ash-';
const Game=window.Game;
if(!Game||Game.__foundationHardened)return;
Game.__foundationHardened=true;
const originalReset=Game.reset.bind(Game);
function clearProfileNamespace(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    if(k&&k.startsWith(PREFIX))keys.push(k);
  }
  for(const k of keys)localStorage.removeItem(k);
  return keys;
}
Game.reset=()=>{clearProfileNamespace();originalReset();};
window.Foundation={
  prefix:PREFIX,
  clearProfileNamespace,
  snapshot(){
    return {
      game:Game.debugState?.(),
      kingdom:window.KingdomV27?.load?.(),
      guild:window.GuildV23?.load?.(),
      realm:window.StrategyV30?.load?.()
    };
  }
};
})();