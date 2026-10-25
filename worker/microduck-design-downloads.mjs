import {microduckFiles,microduckFileById} from './microduck-file-index.mjs';

const PREFIX='/api/v1/community/projects/microduck-robot/';
const noStore={
  'cache-control':'private, no-store, max-age=0',
  'x-content-type-options':'nosniff',
  'x-robots-tag':'noindex, nofollow',
  'referrer-policy':'no-referrer',
  'content-security-policy':"default-src 'none'; sandbox"
};

export async function handleMicroduckDesignApi(req,env,sessionFn,json,err){
  const path=new URL(req.url).pathname;
  if(!path.startsWith(PREFIX))return null;
  if(req.method!=='GET')return err(405,'Only GET is allowed',{'allow':'GET'});
  const user=await sessionFn(req,env);
  if(!user)return err(401,'Sign in to a MAKHEX maker account to download these designs');
  const relative=path.slice(PREFIX.length).replace(/\/$/,'');
  if(relative==='design-resources'){
    return json({
      project:'microduck-robot',
      access:'authenticated-maker-session',
      creator:'kissqy',
      upstream:'https://github.com/kissqy/Microduck-kissqy',
      note:'MAKHEX site owner attests redistribution authorization for the source CAD files. Original creator and upstream rights retained. Personal/member use does not grant permission to commercially manufacture derivatives.',
      entries:microduckFiles.length,
      resources:microduckFiles.map(f=>({
        id:f.id,title:f.title,group:f.group,description:f.description,filename:f.filename,
        bytes:f.sizeBytes,sha256:f.sha256,downloadUrl:PREFIX+'design-downloads/'+f.id
      }))
    });
  }
  if(!relative.startsWith('design-downloads/'))return err(404,'Unknown member design resource');
  const id=relative.slice('design-downloads/'.length);
  if(!/^[a-z0-9-]+$/.test(id))return err(404,'Unknown download');
  const file=microduckFileById.get(id);
  if(!file)return err(404,'Unknown download');
  if(!env.MICRODUCK_FILES)return err(503,'Protected design storage is unavailable');
  const data=await env.MICRODUCK_FILES.get(file.key,{type:'arrayBuffer'});
  if(!(data instanceof ArrayBuffer) || data.byteLength!==file.sizeBytes)
    return err(503,'Design file temporarily unavailable');
  const safeFallback=file.id+'.'+file.filename.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g,'');
  const encoded=encodeURIComponent(file.filename).replace(/[()']/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
  return new Response(data,{
    status:200,
    headers:{
      ...noStore,
      'content-type':'application/octet-stream',
      'content-disposition':'attachment; filename="'+safeFallback+'"; filename*=UTF-8\'\''+encoded,
      'x-makhex-file-sha256':file.sha256
    }
  });
}
