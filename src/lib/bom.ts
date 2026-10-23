import type{Project} from '../data/projects';
import {productBySlug} from './catalog';
import {plannedVariantForProject} from '../data/catalog-staging';
import {mosaicoAssemblyParts} from '../data/mosaico-bom';
const csv=(value:string|number)=>'"'+String(value).replace(/"/g,'""')+'"';
export function projectBomCsv(p:Project):string{
  if(p.slug==='mosaico-learning-assistant'){
    const rows=[
      ['Project','Purchase plan','Component','Quantity','Unit price USD','Line total USD','Status / Purpose'],
      [p.title,'A - Vision Combo Kit','ESP-Mosaico Vision Combo Kit','1','','','Contains Core Unit V1.2, dedicated H2 camera and Interaction Module. Do not order included boards again; camera revision and U.S. shipment unverified.'],
      [p.title,'A - Vision Combo Kit','USB-C Data Cable (1 m)','1','','','Data-capable accessory; verify it is not already included in vendor kit.'],
      ...mosaicoAssemblyParts.map(part=>[p.title,'B - Individually Sourced',part.title,String(part.quantity),'','',(part.includedInVisionCombo?'Already in Plan A kit; do not buy both plans. ':'')+part.role+'. Standalone supplier variant unverified.'])
    ];
    return '\uFEFF'+rows.map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n';
  }
  const rows=[['Project','Component','Quantity','Unit price USD','Line total USD','Purpose']];
  for(const m of p.materials){
    const product=productBySlug(m.slug);
    const choice=plannedVariantForProject(m.slug,p.slug);
    const unit=choice?.plannedRetailUsd;
    rows.push([p.title,product?.title??m.slug,String(m.qty),unit===undefined?'':unit.toFixed(2),unit===undefined?'':(unit*m.qty).toFixed(2),m.why]);
  }
  return '\uFEFF'+rows.map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n';
}
