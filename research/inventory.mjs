/** Public, read-only inventory of the source website. No forms are submitted. */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const SOURCE='https://xn-----6kcbablcjk5dhfd3bbeb0ep8fwag6n.xn--p1ai/';
const out=new URL('./output/',import.meta.url);await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
for(const viewport of [{width:1440,height:900},{width:1024,height:768},{width:768,height:1024},{width:390,height:844}]){
 const page=await browser.newPage({viewport,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{await page.goto(SOURCE,{waitUntil:'domcontentloaded',timeout:45000});await page.waitForTimeout(2500);
 const inventory=await page.evaluate(()=>({title:document.title,href:location.href,headings:[...document.querySelectorAll('h1,h2,h3')].map(el=>({level:el.tagName,text:(el.textContent||'').trim().slice(0,180)})),links:[...document.querySelectorAll('a[href]')].map(a=>({text:(a.textContent||'').trim().slice(0,100),href:a.getAttribute('href')})),buttons:[...document.querySelectorAll('button,[role=button]')].map(x=>({text:(x.textContent||'').trim().slice(0,100),label:x.getAttribute('aria-label')})),forms:[...document.querySelectorAll('form')].map(f=>({action:f.getAttribute('action'),method:f.getAttribute('method'),fields:[...f.querySelectorAll('input,textarea,select')].map(i=>({name:i.getAttribute('name'),type:i.getAttribute('type'),required:i.hasAttribute('required')}))})),images:[...document.images].map(i=>({alt:i.alt,src:i.currentSrc||i.src})),fonts:[...document.fonts].map(f=>f.family)}));
 await page.screenshot({path:new URL(`full-${viewport.width}.png`,out).pathname,fullPage:true,animations:'disabled'});results.push({viewport,inventory,errors});
 }catch(e){results.push({viewport,error:String(e),errors})}finally{await page.close()}
}
await writeFile(new URL('inventory.json',out),JSON.stringify({source:SOURCE,capturedAt:new Date().toISOString(),results},null,2));await browser.close();console.log('Saved browser inventory to research/output/');
