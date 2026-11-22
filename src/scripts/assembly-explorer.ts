type Part={slug:string;title:string;qty:number;why:string;qualification:string;label:string};
const track=(event:string,project:string)=>window.dispatchEvent(new CustomEvent('makhex:track',{detail:{event,project}}));
for(const section of document.querySelectorAll<HTMLElement>('[data-assembly-project]')){
 const foundViewer=section.querySelector<HTMLElement>('[data-assembly-viewer]');
 if(!foundViewer)continue;
 const viewer:HTMLElement=foundViewer;
 let parts:Part[];
 try{parts=JSON.parse(viewer.dataset.parts||'[]')}catch{parts=[]}
 if(!parts.length)continue;
 const project=viewer.dataset.project||'';
 const selected=section.querySelector<HTMLElement>('[data-assembly-selected]');
 const status=section.querySelector<HTMLElement>('[data-assembly-status]');
 const list=[...section.querySelectorAll<HTMLButtonElement>('[data-assembly-select]')];
 const reset=section.querySelector<HTMLButtonElement>('[data-assembly-reset]');
 const explode=section.querySelector<HTMLButtonElement>('[data-assembly-explode]');
 const fallback=section.querySelector<HTMLElement>('[data-assembly-fallback]');
 let selectMesh:(slug:string)=>void=()=>{};
 let resetView:()=>void=()=>{};
 let explodeView:()=>void=()=>{};
 let initialized=false;
 function select(slug:string,source:'initial'|'list'|'mesh'='list'){
  const p=parts.find(item=>item.slug===slug);
  if(!p)return;
  for(const button of list){
   const active=button.dataset.assemblySelect===slug;
   button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));
  }
  if(selected)selected.textContent=p.title+' · '+p.qty+'× · '+p.why;
  if(status)status.textContent=p.label+'. This is a sourcing request, not a payment authorization.';
  selectMesh(slug);
  if(source==='mesh')section.querySelector<HTMLElement>('.assembly-part-list button.is-active')?.focus({preventScroll:true});
  if(source!=='initial')track('assembly_interact',project);
 }
 list.forEach(button=>button.addEventListener('click',()=>select(button.dataset.assemblySelect||'')));
 reset?.addEventListener('click',()=>resetView());
 explode?.addEventListener('click',()=>explodeView());
 select(parts[0].slug,'initial');
 async function initialize(){
  if(initialized)return;initialized=true;
  const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
  if(connection?.saveData){if(status)status.textContent='3D loading skipped to save data. All components remain selectable.';return;}
  try{
   const THREE=await import('three');
   const {OrbitControls}=await import('three/addons/controls/OrbitControls.js');
   const scene=new THREE.Scene();scene.background=new THREE.Color(0x172b22);
   const camera=new THREE.PerspectiveCamera(37,1,.1,100);camera.position.set(8,6.5,9);
   const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
   renderer.domElement.setAttribute('aria-label','Drag to rotate the illustrative assembly, or select parts from the list');
   renderer.domElement.tabIndex=0;viewer.append(renderer.domElement);
   viewer.classList.add('is-ready');fallback?.setAttribute('hidden','');
   scene.add(new THREE.HemisphereLight(0xe0f8db,0x36453f,2.2));
   const sun=new THREE.DirectionalLight(0xffffff,2.6);sun.position.set(-4,9,6);scene.add(sun);
   const grid=new THREE.GridHelper(8,16,0x54705c,0x335143);grid.position.y=-.42;scene.add(grid);
   const base=new THREE.Mesh(new THREE.BoxGeometry(7.1,.16,6.6),new THREE.MeshStandardMaterial({color:0x24392f,roughness:.8}));
   base.position.y=-.55;scene.add(base);
   const hub=new THREE.Mesh(new THREE.BoxGeometry(1.55,.42,1.22),new THREE.MeshStandardMaterial({color:0x668a61,metalness:.28,roughness:.42}));
   hub.position.y=.1;scene.add(hub);
   const chip=new THREE.Mesh(new THREE.BoxGeometry(1.21,.035,.91),new THREE.MeshStandardMaterial({color:0x253d35,roughness:.45}));
   chip.position.y=.34;scene.add(chip);
   const meshes=new Map<string,InstanceType<typeof THREE.Group>>();
   const origins=new Map<string,InstanceType<typeof THREE.Vector3>>();
   const clickable:InstanceType<typeof THREE.Object3D>[]=[];
   for(const [i,part] of parts.entries()){
    const angle=i/parts.length*Math.PI*2-Math.PI/2,radius=Math.min(2.8,2.25+parts.length*.023);
    const x=Math.cos(angle)*radius,z=Math.sin(angle)*radius,y=.12+(i%3)*.2;
    const group=new THREE.Group();group.userData.slug=part.slug;group.position.set(x,y,z);scene.add(group);
    origins.set(part.slug,group.position.clone());meshes.set(part.slug,group);
    const color=part.qualification==='ENGINEERING_HOLD'?0xc89166:part.qualification==='QUOTE_REQUIRED'?0xa7ada1:part.qualification==='PAYMENT_READY'?0xaddc74:0x88b6a0;
    const mat=new THREE.MeshStandardMaterial({color,roughness:.42,metalness:.17,emissive:0});
    const mechanical=/servo|bearing|motor|fastener|cable|wire/i.test(part.slug);
    const sensor=/sensor|imu|camera|vl53|bme|mic|sgp/i.test(part.slug);
    const geo=mechanical?new THREE.CylinderGeometry(.39,.39,.45,12):sensor?new THREE.SphereGeometry(.38,16,12):new THREE.BoxGeometry(.92,.28,.63);
    const object=new THREE.Mesh(geo,mat);object.userData.slug=part.slug;group.add(object);clickable.push(object);
    const led=new THREE.Mesh(new THREE.SphereGeometry(.07,8,8),new THREE.MeshBasicMaterial({color:0xf5c881}));
    led.position.y=.41;group.add(led);
    const wire=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,.15,z),new THREE.Vector3(x*.57,.23,z*.57),new THREE.Vector3(0,.3,0)]),new THREE.LineBasicMaterial({color:0x7cae83,transparent:true,opacity:.58}));
    scene.add(wire);
   }
   const controls=new OrbitControls(camera,renderer.domElement);
   controls.enablePan=false;controls.enableDamping=false;controls.minDistance=5;controls.maxDistance=18;
   controls.maxPolarAngle=Math.PI*.82;controls.minPolarAngle=.3;controls.target.set(0,.02,0);
   const render=()=>renderer.render(scene,camera);controls.addEventListener('change',render);
   const resize=()=>{
    const width=Math.max(1,viewer.clientWidth),height=Math.max(1,viewer.clientHeight);
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();
   };
   const observer=new ResizeObserver(resize);observer.observe(viewer);resize();
   selectMesh=slug=>{
    for(const [key,group] of meshes)for(const child of group.children){
     if(child instanceof THREE.Mesh&&child.material instanceof THREE.MeshStandardMaterial)
      child.material.emissive.setHex(key===slug?0x27361a:0);
    }
    render();
   };
   let isExploded=false;
   explodeView=()=>{
    isExploded=!isExploded;
    for(const [slug,group] of meshes){
     const origin=origins.get(slug)!;group.position.copy(origin);
     if(isExploded){group.position.x*=1.3;group.position.z*=1.3;group.position.y+=.3;}
    }
    explode?.setAttribute('aria-pressed',String(isExploded));
    explode?.classList.toggle('is-active',isExploded);render();
   };
   resetView=()=>{camera.position.set(8,6.5,9);controls.target.set(0,.02,0);controls.update();render();};
   let down:{x:number;y:number}|null=null;
   renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
   renderer.domElement.addEventListener('pointerup',e=>{
    if(!down||Math.abs(down.x-e.clientX)+Math.abs(down.y-e.clientY)>8)return;
    const box=renderer.domElement.getBoundingClientRect();
    const pos=new THREE.Vector2((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1);
    const ray=new THREE.Raycaster();ray.setFromCamera(pos,camera);
    const hit=ray.intersectObjects(clickable,false)[0]?.object;
    if(hit?.userData.slug)select(String(hit.userData.slug),'mesh');
   });
   renderer.domElement.addEventListener('webglcontextlost',e=>{
    e.preventDefault();viewer.classList.remove('is-ready');fallback?.removeAttribute('hidden');
    if(status)status.textContent='3D display unavailable. Select any part in the index.';
   });
   const first=list.find(x=>x.classList.contains('is-active'));
   if(first)selectMesh(first.dataset.assemblySelect||'');
   window.addEventListener('pagehide',()=>{observer.disconnect();controls.dispose();renderer.dispose()},{once:true});
  }catch{
   viewer.classList.remove('is-ready');fallback?.removeAttribute('hidden');
   if(status)status.textContent='3D visualization unavailable in this browser. The complete BOM and request buttons still work.';
  }
 }
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();void initialize()}},{rootMargin:'220px'});
  observer.observe(viewer);
 }else void initialize();
}
