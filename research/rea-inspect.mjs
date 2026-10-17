/**
 * Passive CDP REA investigation in a disposable Chrome profile.
 * No contact form submission or user data. Every observation is scoped to the source origin.
 */
import { chromium } from '@playwright/test';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const execFileAsync=promisify(execFile);
const out='research/rea-output';
await mkdir(out,{recursive:true});
const url='https://xn-----6kcbablcjk5dhfd3bbeb0ep8fwag6n.xn--p1ai/';
const chrome=spawn(chromium.executablePath(),[
 '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
 '--no-first-run','--password-store=basic','--remote-debugging-address=127.0.0.1',
 '--remote-debugging-port=9222','--user-data-dir=/tmp/rea-dvizh-profile',url
],{stdio:'ignore'});
async function evidence(name,args) {
 try{
  const {stdout,stderr}=await execFileAsync('npx',['-y','rea-agents@latest',...args],{timeout:160000,maxBuffer:10*1024*1024});
  await writeFile(path.join(out,name),stdout);
  await writeFile(path.join(out,name+'.stderr.txt'),stderr);
  return {ok:true,output:stdout};
 }catch(error){
  await writeFile(path.join(out,name+'.error.txt'),String(error)+'\n'+String(error.stdout||'').slice(0,50000));
  return {ok:false,error:String(error)};
 }
}
try{
 await new Promise(resolve=>setTimeout(resolve,5000));
 const result=await evidence('targets.json',['list-browser-targets','http://127.0.0.1:9222','--approved','--json']);
 // Target selection is explicit only when discoverable from the actual REA response.
 if(result.ok){
  let target=null;
  try {
   const data=JSON.parse(result.output);
   const candidates=Array.isArray(data)?data:
     Array.isArray(data.targets)?data.targets:
     Array.isArray(data.data?.targets)?data.data.targets:
     Array.isArray(data.result?.targets)?data.result.targets:[];
   target=candidates.find(x=>String(x.url||x.target_url||'').startsWith(url));
  }catch{}
  if(target){
   const targetId=target.target_id||target.targetId||target.id;
   if(targetId) await evidence('page.json',['inspect-web-page','http://127.0.0.1:9222',String(targetId),'--approved','--json']);
  }
 }
}finally{
 chrome.kill('SIGTERM');
}
console.log('REA evidence output written to '+out);
