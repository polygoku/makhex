import type {APIRoute} from 'astro';
import {projects} from '../data/projects';
import {products} from '../data/products';
import {supplierResearch,sourcingReviewedAt} from '../data/supplier-research';

// Static machine-readable sourcing references for human makers and AI agents.
// Never contains wholesale cost, exact supplier option IDs or buyer credentials.
export const prerender = true;
export const GET: APIRoute = () => {
  const data={
    schema:'makhex-research-sourcing-v1',
    lastReadFromSupplier:sourcingReviewedAt,
    purpose:'Public research references only: NOT a checkout, verified BOM or orderability claim',
    purchaseStatus:'NOT_APPROVED',
    supplierQualification:'PENDING',
    components:products.map(product=>{
      const source=supplierResearch[product.slug];
      return {
        slug:product.slug,title:product.title,
        sourceItemId:source.itemId,
        aliExpressResearchUrl:source.url,
        selectedFormat:source.selectedFormat,
        technicalGate:source.gate,
        caution:source.caution,
        storeState:'HIDDEN_ZERO_INVENTORY'
      };
    }),
    projects:projects.map(project=>({
      slug:project.slug,title:project.title,
      url:'https://makhex.com/projects/'+project.slug+'/',
      components:project.materials.map(m=>{
        const source=supplierResearch[m.slug];
        return {
          slug:m.slug,quantity:m.qty,role:m.why,
          aliExpressResearchUrl:source.url,
          selectedFormat:source.projectOptions?.[project.slug]??source.selectedFormat,
          technicalGate:source.gate
        };
      })
    })),
    bomGaps:[
      {projectSlug:'voice-command-node',part:'Speaker sized for the verified amplifier',state:'UNSOURCED'},
      {projectSlug:'smart-desk-button',part:'Momentary pushbutton and input wiring',state:'UNSOURCED'},
      {projectSlug:'rgb-matrix-clock',part:'Rated 5V LED power supply and possible level shifter',state:'UNSOURCED'}
    ]
  };
  return new Response(JSON.stringify(data,null,2),{
    headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}
  });
};
