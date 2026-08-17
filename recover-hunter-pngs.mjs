import fs from 'node:fs';
import path from 'node:path';

const groups={
  v:['hv1.js','hv2.js','hv3.js','hv4.js'],
  d:['hd1.js','hd2.js','hd3.js'],
  p:['hp1.js','hp2.js','hp3.js','hp4.js','hpfix.js']
};
const names={v:'hunter-vanguard-v30',d:'hunter-duelist-v30',p:'hunter-physician-v30'};
fs.mkdirSync('tmp-hunter-art',{recursive:true});
for(const [key,files] of Object.entries(groups)){
  let b64='';
  for(const file of files){
    const src=fs.readFileSync(path.join('assets','runtime',file),'utf8');
    const matches=[...src.matchAll(/'([^']*)'/g)].map(m=>m[1]).filter(x=>x.length>20);
    if(!matches.length)throw new Error(`No encoded Hunter payload found in ${file}`);
    b64+=matches.join('');
  }
  const bytes=Buffer.from(b64,'base64');
  if(bytes.subarray(0,4).toString()!=='RIFF'||bytes.subarray(8,12).toString()!=='WEBP'){
    throw new Error(`${key} payload did not reconstruct a RIFF WebP (${bytes.length} bytes)`);
  }
  const out=path.join('tmp-hunter-art',`${names[key]}.webp`);
  fs.writeFileSync(out,bytes);
  console.log(`${key}: ${bytes.length} bytes -> ${out}`);
}
