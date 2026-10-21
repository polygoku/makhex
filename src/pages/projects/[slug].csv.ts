import type{APIRoute} from 'astro';
import {projects} from '../../data/projects';
import {projectBomCsv} from '../../lib/bom';
export const getStaticPaths=()=>projects.map(project=>({params:{slug:project.slug},props:{project}}));
export const GET:APIRoute=({props})=>{
 const project=props.project;
 return new Response(projectBomCsv(project),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="'+project.slug+'-bom.csv"','X-Content-Type-Options':'nosniff'}});
};
