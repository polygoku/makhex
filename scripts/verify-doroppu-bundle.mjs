#!/usr/bin/env node
// Checks an exported Doroppu MAKHEX Squarespace batch; no network or store writes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SQUARESPACE_HEADER=[
 "Product ID [Non Editable]","Variant ID [Non Editable]","Product Type [Non Editable]",
 "Product Page","Product URL","Title","Description","SKU","GTIN","MPN",
 "Option Name 1","Option Value 1","Option Name 2","Option Value 2",
 "Option Name 3","Option Value 3","Price","Sale Price","On Sale",
 "Stock","Categories","Tags","Weight","Length","Width","Height",
 "Visible","Hosted Image URLs"
];
export function parseCsv(text){
 if(typeof text!=="string"||text.length>6_000_000)throw new Error("Invalid CSV size");
 const rows=[];let cells=[],field="",inside=false,after=false,atStart=true;
 function emitField(){cells.push(field);field="";atStart=true;after=false;}
 function emitRow(){if(cells.some(x=>x.trim()))rows.push(cells);cells=[];}
 for(let i=0;i<text.length;i++){
   const ch=text[i];
   if(inside){
     if(ch==='"'&&text[i+1]==='"'){field+='"';i++;}
     else if(ch==='"'){inside=false;after=true;}
     else field+=ch;
   }else if(ch===",")emitField();
   else if(ch==="\n"||ch==="\r"){emitField();emitRow();if(ch==="\r"&&text[i+1]==="\n")i++;}
   else if(ch==='"'){if(!atStart)throw new Error("Malformed CSV quoting");inside=true;atStart=false;}
   else {if(after&&!/\s/.test(ch))throw new Error("Malformed closing quote");if(!after)field+=ch;atStart=false;}
 }
 if(inside)throw new Error("Unclosed CSV quote");
 if(cells.length||field||!atStart){emitField();emitRow();}
 return rows;
}
export function verifyDoroppuBundle(csv,manifest){
 const failures=[];
 const require=(cond,message)=>{if(!cond)failures.push(message);};
 require(manifest && typeof manifest==="object"&&!Array.isArray(manifest),"Missing manifest object");
 if(!manifest || typeof manifest!=="object")return {ok:false,failures};
 require(manifest.schema==="makhex-doroppu-staging-v1","Unknown Doroppu contract");
 require(manifest.store==="shop.makhex.com","Unexpected Squarespace site");
 require(manifest.status==="HIDDEN_ZERO_STOCK_REVIEW_ONLY","Unsafe staging status");
 require(manifest.publishAuthorized===false && manifest.writePerformed===false && manifest.checkoutReady===false,"Manifest could enable publishing or claim a write");
 require(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.storePage||""),"Unverified Store Page format");
 require(Array.isArray(manifest.products)&&manifest.products.length>0&&manifest.products.length<=50,"Invalid source products");
 let rows;
 try{rows=parseCsv(csv);}catch(e){return {ok:false,failures:[...failures,e.message]};}
 require(rows.length>1,"CSV has no product rows");
 require(JSON.stringify(rows[0])===JSON.stringify(SQUARESPACE_HEADER),"Squarespace CSV header mismatch");
 if(rows.length<2||JSON.stringify(rows[0])!==JSON.stringify(SQUARESPACE_HEADER))return {ok:false,failures};
 const body=rows.slice(1),seenSkus=new Set(),seenSlugs=new Set(),products=[];
 let current=null;
 const pos=name=>SQUARESPACE_HEADER.indexOf(name);
 for(let i=0;i<body.length;i++){
  const cells=body[i],name="CSV row "+(i+2);
  if(cells.length!==28){require(false,name+" has wrong column count");continue;}
  const get=key=>cells[pos(key)]??"";
  require(get("Product ID [Non Editable]")===""&&get("Variant ID [Non Editable]")==="",name+" includes an existing product/variant ID");
  require(get("GTIN")===""&&get("MPN")==="",name+" must not invent unverified GTIN/MPN values");
  require(get("Stock")==="0",name+" must remain stock 0");
  require(get("On Sale")==="No"&&get("Sale Price")==="",name+" contains a sale");
  require(/^\d{1,7}\.\d{2}$/.test(get("Price")),name+" has invalid retail price");
  const sku=get("SKU");
  require(/^MKX-\d{6,20}-[A-F0-9]{12}$/.test(sku),name+" has invalid MAKHEX merchant SKU");
  require(!seenSkus.has(sku),name+" duplicate merchant SKU");
  seenSkus.add(sku);
  if(get("Product Type [Non Editable]")==="PHYSICAL"){
    const slug=get("Product URL");
    require(/^mkx-\d{6,20}$/.test(slug),name+" has invalid imported slug");
    require(!seenSlugs.has(slug),name+" duplicates product slug");seenSlugs.add(slug);
    require(get("Visible")==="No",name+" is not hidden");
    require(get("Product Page")===manifest.storePage,name+" store page does not match");
    require(Boolean(get("Title")),name+" missing title");
    current={slug,title:get("Title"),rows:0,skus:[]};products.push(current);
  }else {
    require(get("Product Type [Non Editable]")==="",name+" has invalid product type");
    require(!!current,name+" orphan option row");
    require(get("Visible")===""&&get("Title")===""&&get("Product URL")===""&&get("Product Page")==="",name+" variant row incorrectly repeats product fields");
  }
  if(current){current.rows++;current.skus.push(sku);
    require(sku.startsWith("MKX-"+current.slug.slice(4)+"-"),name+" source ID inconsistent with product");}
 }
 require(manifest.products?.length===products.length,"Manifest product count differs from CSV");
 require(manifest.sourceProductCount===products.length,"Manifest declared product count differs from CSV");
 require(manifest.variantCount===body.length,"Manifest variant count differs from CSV");
 if(Array.isArray(manifest.products)){
   for(let i=0;i<Math.min(products.length,manifest.products.length);i++){
     const item=manifest.products[i],match=products[i];
     require(item.slug===match.slug && item.title===match.title,"Manifest product identity mismatch");
     require(item.variantCount===match.rows,"Manifest variant count mismatch for "+match.slug);
     require(item.importVisibility==="No"&&item.initialStockPerVariant===0,"Unsafe product manifest state for "+match.slug);
     require(item.publishAuthorized===false&&item.qualification==="RESEARCH_ONLY","Product falsely marked approved "+match.slug);
   }
 }
 return {
   ok:failures.length===0,failures,products:products.length,variants:body.length,
   readiness:"REVIEW_ONLY_NOT_PUBLISHED",mustReview:[
     "AliExpress live orderability, exact board/SKU specifications and delivered landed cost",
     "Media rights, U.S. shipping/returns and firmware compatibility",
     "Store page slug, Squarespace categories and existing product duplicate check",
     "Authorized manual hidden import and post-import variant inventory readback"
   ]
 };
}
function cli(){
 const args=process.argv.slice(2);
 if(args.length!==2){console.error("Usage: node scripts/verify-doroppu-bundle.mjs <squarespace-import.csv> <review-manifest.json>");process.exitCode=2;return;}
 try{
  const csv=fs.readFileSync(path.resolve(args[0]),"utf8");
  const manifest=JSON.parse(fs.readFileSync(path.resolve(args[1]),"utf8"));
  const result=verifyDoroppuBundle(csv,manifest);
  console.log(JSON.stringify(result,null,2));
  if(!result.ok)process.exitCode=1;
 }catch(e){console.error("Bundle verification failed:",e.message);process.exitCode=1;}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))cli();
