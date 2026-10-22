import test from "node:test";
import assert from "node:assert/strict";
import { verifyDoroppuBundle, parseCsv, SQUARESPACE_HEADER } from "./verify-doroppu-bundle.mjs";

const src="1005009998887771";
function fixture(){
 const line=Array(SQUARESPACE_HEADER.length).fill("");
 const put=(field,value)=>{line[SQUARESPACE_HEADER.indexOf(field)]=value;};
 put("Product Type [Non Editable]","PHYSICAL");
 put("Product Page","shop");
 put("Product URL","mkx-"+src);
 put("Title","Example Device, ESP32");
 put("SKU","MKX-"+src+"-ABCDEF123456");
 put("Price","17.00");put("On Sale","No");put("Stock","0");put("Visible","No");
 const csv=[SQUARESPACE_HEADER,line].map(a=>a.map(v=>/[",\r\n]/.test(v)?'"'+v.replaceAll('"','""')+'"':v).join(",")).join("\r\n")+"\r\n";
 const manifest={
  schema:"makhex-doroppu-staging-v1",store:"shop.makhex.com",
  storePage:"shop",sourceProductCount:1,variantCount:1,
  status:"HIDDEN_ZERO_STOCK_REVIEW_ONLY",
  publishAuthorized:false,writePerformed:false,checkoutReady:false,
  products:[{sourceId:src,slug:"mkx-"+src,title:"Example Device, ESP32",
   variantCount:1,importVisibility:"No",initialStockPerVariant:0,publishAuthorized:false,qualification:"RESEARCH_ONLY"}],
 };
 return {csv,manifest,line};
}
test("checks hidden zero-stock Doroppu import contract",()=>{
 const f=fixture();const report=verifyDoroppuBundle(f.csv,f.manifest);
 assert.equal(report.ok,true,report.failures.join("; "));
 assert.equal(report.products,1);assert.equal(report.variants,1);
});
test("matches current Squarespace v3 28-column template",()=>{
  const f=fixture();
  assert.equal(SQUARESPACE_HEADER.length,28);
  assert.equal(verifyDoroppuBundle(f.csv,f.manifest).ok,true);
});
test("rejects an unverified GTIN",()=>{
  const f=fixture();
  f.line[SQUARESPACE_HEADER.indexOf("GTIN")]="1234567890123";
  f.csv=[SQUARESPACE_HEADER,f.line].map(a=>a.map(v=>/[",\r\n]/.test(v)?'"'+v.replaceAll('"','""')+'"':v).join(",")).join("\r\n")+"\r\n";
  assert.equal(verifyDoroppuBundle(f.csv,f.manifest).ok,false);
});
test("rejects any nonzero inventory",()=>{
 const f=fixture();f.line[SQUARESPACE_HEADER.indexOf("Stock")]="8";
 const rows=[SQUARESPACE_HEADER,f.line];f.csv=rows.map(x=>x.map(v=>/[",\r\n]/.test(v)?'"'+v.replaceAll('"','""')+'"':v).join(",")).join("\n");
 assert.equal(verifyDoroppuBundle(f.csv,f.manifest).ok,false);
});
test("rejects even one accidentally visible product",()=>{
 const f=fixture();f.csv=f.csv.replace(",No,\r\n",",Yes,\r\n");
 assert.equal(verifyDoroppuBundle(f.csv,f.manifest).ok,false);
});
test("rejects manifest that falsely claims publishing clearance",()=>{
 const f=fixture();f.manifest.publishAuthorized=true;
 assert.equal(verifyDoroppuBundle(f.csv,f.manifest).ok,false);
});
test("rejects manifest if source count and CSV count differ",()=>{
 const f=fixture();f.manifest.sourceProductCount=2;
 assert.equal(verifyDoroppuBundle(f.csv,f.manifest).ok,false);
});
test("rejects a merchant SKU that doesn't match its supplier item ID",()=>{
 const f=fixture();f.csv=f.csv.replace("MKX-"+src+"-ABCDEF123456","MKX-1234567890-ABCDEF123456");
 assert.equal(verifyDoroppuBundle(f.csv,f.manifest).ok,false);
});
test("parses a quoted field containing both comma and multiline text",()=>{
 const txt='Alpha,Beta\r\n"hello, world","line1\nline2"\r\n';
 assert.deepEqual(parseCsv(txt),[["Alpha","Beta"],["hello, world","line1\nline2"]]);
});
