(function(){
 const config=()=>({url:String(window.SUPABASE_URL||'').replace(/\/$/,''),key:window.SUPABASE_ANON_KEY||''});
 const encodePath=path=>String(path).split('/').map(encodeURIComponent).join('/');
 async function request(path,{auth=false,method='GET',body,file,prefer}={}){
  const {url,key}=config();
  if(!url||!key)throw new Error('Konfigurasi Supabase belum lengkap.');
  const identity=auth&&window.learneeFirebaseIdentity?await window.learneeFirebaseIdentity():null;
  if(auth&&!identity?.token)throw new Error('Silakan masuk dengan akun yang berwenang terlebih dahulu.');
  const headers={apikey:key,Authorization:'Bearer '+(identity?.token||key)};
  if(prefer)headers.Prefer=prefer;
  if(file){headers['Content-Type']=file.type||'application/pdf';headers['x-upsert']='false';body=file}
  else if(body!==undefined){headers['Content-Type']='application/json';body=JSON.stringify(body)}
  const response=await fetch(url+path,{method,headers,body});
  if(!response.ok){
   let detail=response.statusText;
   try{const result=await response.json();detail=result.message||result.msg||result.error_description||JSON.stringify(result)}catch(e){}
   throw new Error('Supabase ('+response.status+'): '+detail);
  }
  if(response.status===204)return null;
  const text=await response.text();
  return text?JSON.parse(text):null;
 }
 async function removeObject(path){
  return request('/storage/v1/object/materials',{auth:true,method:'DELETE',body:{prefixes:[path]}});
 }
 async function uploadObject(file,identity,role){
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'_')||'materi.pdf';
  const folder=role==='admin'?'admin':'teacher';
  const path=folder+'/'+identity.uid+'/'+crypto.randomUUID()+'-'+safeName;
  await request('/storage/v1/object/materials/'+encodePath(path),{auth:true,method:'POST',file});
  return path;
 }
 async function listMaterials(includePrivate){
  const rows=await request('/rest/v1/materials?select=*&order=created_at.desc',{auth:includePrivate});
  return Array.isArray(rows)?rows:[];
 }
 async function createMaterial(file,values,role){
  const identity=window.learneeFirebaseIdentity?await window.learneeFirebaseIdentity():null;
  if(!identity?.token)throw new Error('Silakan masuk dengan akun yang berwenang terlebih dahulu.');
  const path=await uploadObject(file,identity,role);
  try{
   const rows=await request('/rest/v1/materials?select=*',{auth:true,method:'POST',prefer:'return=representation',body:{...values,storage_path:path,created_by:identity.uid}});
   if(!Array.isArray(rows)||!rows[0])throw new Error('Data materi tidak dikembalikan oleh database.');
   return rows[0];
  }catch(error){
   try{await removeObject(path)}catch(cleanupError){console.error('Gagal membersihkan PDF setelah penyimpanan metadata gagal:',cleanupError)}
   throw error;
  }
 }
 async function updateMaterial(id,values,file,role,oldPath){
  const identity=window.learneeFirebaseIdentity?await window.learneeFirebaseIdentity():null;
  if(!identity?.token)throw new Error('Silakan masuk dengan akun yang berwenang terlebih dahulu.');
  let newPath=null;
  if(file)newPath=await uploadObject(file,identity,role);
  try{
   const query='/rest/v1/materials?id=eq.'+encodeURIComponent(id)+'&select=*';
   const rows=await request(query,{auth:true,method:'PATCH',prefer:'return=representation',body:{...values,...(newPath?{storage_path:newPath}:{}),updated_at:new Date().toISOString()}});
   if(!Array.isArray(rows)||!rows[0])throw new Error('Materi tidak ditemukan atau tidak memiliki izin untuk diubah.');
   let warning=null;
   if(newPath&&oldPath){try{await removeObject(oldPath)}catch(error){warning='Perubahan tersimpan, tetapi PDF lama gagal dibersihkan: '+error.message}}
   return {row:rows[0],warning};
  }catch(error){
   if(newPath){try{await removeObject(newPath)}catch(cleanupError){console.error('Gagal membersihkan PDF baru setelah perubahan materi gagal:',cleanupError)}}
   throw error;
  }
 }
 async function deleteMaterial(id,path){
  const rows=await request('/rest/v1/materials?id=eq.'+encodeURIComponent(id),{auth:true,method:'DELETE'});
  if(path){
   try{await removeObject(path)}catch(error){return {warning:'Data materi terhapus, tetapi file PDF gagal dibersihkan: '+error.message}}
  }
  return {warning:null};
 }
 async function signedUrl(path,auth){
  const result=await request('/storage/v1/object/sign/materials/'+encodePath(path),{auth:!!auth,method:'POST',body:{expiresIn:3600}});
  const signed=result?.signedURL||result?.signedUrl;
  if(!signed)throw new Error('URL PDF tidak dikembalikan oleh Storage.');
  const {url}=config();
  if(/^https?:\/\//i.test(signed))return signed;
  return url+(signed.startsWith('/storage/v1')?signed:'/storage/v1'+(signed.startsWith('/')?'':'/')+signed);
 }
 window.LearneeSupabaseApi={listMaterials,createMaterial,updateMaterial,deleteMaterial,signedUrl};
})();
