/** Read-only source investigation. No clicks, submissions or private data capture. */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SOURCE = 'https://xn-----6kcbablcjk5dhfd3bbeb0ep8fwag6n.xn--p1ai/';
const outputDir = fileURLToPath(new URL('./output/', import.meta.url));
const viewports = [
 { width: 1440, height: 900 },
 { width: 1024, height: 768 },
 { width: 768, height: 1024 },
 { width: 390, height: 844 }
];
const safeName = text => String(text).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 70);
await mkdir(outputDir, {recursive:true});
const browser = await chromium.launch({headless:true});
const results = [];
try {
 for (const viewport of viewports) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
   const response = await page.goto(SOURCE, {waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForTimeout(1600);
   // Capture both screenshot and computed geometry using the same immutable viewport.
   const inventory = await page.evaluate(() => {
    const describe = element => {
     const rect = element.getBoundingClientRect();
     const computed = getComputedStyle(element);
     return {
      tag:element.tagName.toLowerCase(),
      id:element.id||null,
      classes:String(element.className||'').slice(0,180),
      text:(element.textContent||'').trim().replace(/\\s+/g,' ').slice(0,140),
      bounds:{x:Math.round(rect.x),y:Math.round(rect.y+scrollY),width:Math.round(rect.width),height:Math.round(rect.height)},
      style:{fontFamily:computed.fontFamily,fontSize:computed.fontSize,fontWeight:computed.fontWeight,lineHeight:computed.lineHeight,color:computed.color,backgroundColor:computed.backgroundColor,borderRadius:computed.borderRadius}
     };
    };
    const sections=[...document.querySelectorAll('main section, section, .t-rec')]
      .filter((node,index,array)=>array.indexOf(node)===index)
      .filter(node=>node.getBoundingClientRect().height>20);
    return {
     title:document.title,
     url:location.href,
     width:document.documentElement.scrollWidth,
     height:document.documentElement.scrollHeight,
     headings:[...document.querySelectorAll('h1,h2,h3')].map(describe),
     sections:sections.map(describe),
     links:[...document.querySelectorAll('a[href]')].map(node=>({text:(node.textContent||'').trim().slice(0,100),href:node.getAttribute('href')})),
     buttons:[...document.querySelectorAll('button,[role="button"]')].map(describe),
     forms:[...document.querySelectorAll('form')].map(form=>({method:form.getAttribute('method'),fieldTypes:[...form.querySelectorAll('input,textarea,select')].map(el=>({type:el.getAttribute('type'),required:el.hasAttribute('required')}))})),
     images:[...document.images].map(image=>({alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,src:image.currentSrc||image.src})),
     loadedFonts:[...document.fonts].map(font=>({family:font.family,status:font.status})),
     designTokens:{body:describe(document.body),h1:document.querySelector('h1')?describe(document.querySelector('h1')):null}
    };
   });
   await page.screenshot({path:path.join(outputDir,`full-${viewport.width}.png`),fullPage:true,animations:'disabled'});
   // Independently capture up to 60 sections. These are evidence, not reusable assets.
   const sections = page.locator('main section, section, .t-rec');
   const total = await sections.count();
   const captures = [];
   for (let i=0;i<Math.min(total,60);i++) {
    const section = sections.nth(i);
    try {
     if (!await section.isVisible()) continue;
     const dimensions = await section.boundingBox();
     if (!dimensions || dimensions.width<30 || dimensions.height<20) continue;
     const filename=`section-${viewport.width}-${safeName(String(i).padStart(2,'0'))}.png`;
     await section.screenshot({path:path.join(outputDir,filename),animations:'disabled',timeout:10000});
     captures.push(filename);
    } catch (error) { captures.push({index:i,error:String(error).slice(0,160)}); }
   }
   results.push({viewport,status:response?.status()||null,inventory,sectionCaptures:captures,errors});
  } catch(error) { results.push({viewport,error:String(error),errors}); }
  finally {await page.close();}
 }
} finally { await browser.close(); }
await writeFile(path.join(outputDir,'inventory.json'),JSON.stringify({source:SOURCE,createdAt:new Date().toISOString(),results},null,2));
console.log(JSON.stringify(results.map(r=>({viewport:r.viewport,status:r.status,error:r.error||null,sections:r.sectionCaptures?.length||0})),null,2));
if(results.every(r=>r.error || (r.status && r.status>=400))) process.exitCode=1;
