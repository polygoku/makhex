import type{Project} from '../data/projects';
import {productBySlug} from './catalog';
import {plannedVariantForProject} from '../data/catalog-staging';
import {mosaicoAssemblyParts} from '../data/mosaico-bom';
const csv=(value:string|number)=>'"'+String(value).replace(/"/g,'""')+'"';
export function projectBomCsv(p:Project):string{
  const rows=[['Project','Component','Quantity','Unit price USD','Line total USD','Purpose']];
  for(const m of p.materials){
    const product=productBySlug(m.slug);
    const choice=plannedVariantForProject(m.slug,p.slug);
    const unit=choice?.plannedRetailUsd;
    rows.push([p.title,product?.title??m.slug,String(m.qty),unit===undefined?'':unit.toFixed(2),unit===undefined?'':(unit*m.qty).toFixed(2),m.why]);
  }
  if(p.slug==='mosaico-learning-assistant'){
    for(const part of mosaicoAssemblyParts){
      const supply=part.includedInVisionCombo?'INCLUDED IN VISION COMBO - do not order in addition to kit':'Accessory - verify whether vendor kit includes it';
      rows.push([p.title,part.title,String(part.quantity),'','',supply+'; '+part.role+'; exact standalone variant unverified']);
    }
  }
  return '\uFEFF'+rows.map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n';
}
