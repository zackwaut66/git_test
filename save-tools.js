(()=>{
  const baseEnclave=enclave;
  enclave=function(){return `${baseEnclave()}<div class="panel savetools"><h2>PROTOTYPE SAVE</h2><p class=sub>Progress is stored on this device. Copy a compact backup code before clearing browser data or switching devices.</p><div class=choice><button class="btn small" onclick="copySaveBackup()">COPY BACKUP CODE</button><button class="btn small" onclick="restoreSaveBackup()">RESTORE BACKUP</button><button class="btn small red" onclick="resetPrototype()">RESET PROTOTYPE</button></div></div>`};
  window.copySaveBackup=async function(){try{const raw=JSON.stringify(S),code=btoa(unescape(encodeURIComponent(raw)));await navigator.clipboard.writeText(code);toast('SAVE BACKUP COPIED')}catch(e){toast('COPY FAILED · BROWSER CLIPBOARD BLOCKED')}};
  window.restoreSaveBackup=function(){const code=prompt('Paste Ashen Marches backup code:');if(!code)return;try{const raw=decodeURIComponent(escape(atob(code.trim()))),next=JSON.parse(raw);if(!next||!Array.isArray(next.hunters)||!Array.isArray(next.inventory))throw new Error('invalid');S=next;save();render();toast('SAVE RESTORED')}catch(e){toast('INVALID BACKUP CODE')}};
  window.resetPrototype=function(){if(!confirm('Reset all Prototype 0.1 progress on this device?'))return;localStorage.removeItem(K);location.reload()};
  render();
})();