import type{Project} from '../data/projects';
import {productBySlug} from './catalog';
const csv=(value:string|number)=>'"'+String(value).replace(/"/g,'""')+'"';
export function projectBomCsv(p:Project):string{
 const rows=[['Project','Part slug','Component','Quantity','Role','Verification']];
 for(const m of p.materials){
  const item=productBySlug(m.slug);
  rows.push([p.title,m.slug,item?.title||'Unknown component',String(m.qty),m.why,'RESEARCH ONLY - verify exact SKU and wiring']);
 }
 return '\uFEFF'+rows.map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n';
}
