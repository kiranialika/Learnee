/* ---------- Data ---------- */
const SN=['PU','PPU','PBM','PK','Literasi B. Indonesia','Literasi B. Inggris','Penalaran Matematika'];
const TK=['Matematika Lanjut','Fisika','Kimia','Biologi','Ekonomi','Sosiologi','Geografi','Sejarah'];
const BASE_BANK={
'PK':{s:'Konsep inti: bilangan, aljabar dasar, perbandingan, dan peluang sederhana. Selalu ubah soal cerita menjadi persamaan sebelum menghitung.',q:[['Jika 3x + 5 = 20, nilai 2x adalah…',['5','10','15','7'],1,'3x = 15 → x = 5 → 2x = 10.']]},
'Fisika':{s:'Konsep inti: GLB, GLBB, Hukum Newton, usaha-energi. Gunakan diagram gaya sebelum memasukkan rumus.',q:[['Benda 2 kg dipercepat 3 m/s². Gaya resultan?',['3 N','5 N','6 N','1,5 N'],2,'F = m·a = 2×3 = 6 N.']]},
'Kimia':{s:'Konsep inti: stoikiometri, mol, larutan, dan kesetimbangan. Mol adalah jembatan antara massa dan jumlah partikel.',q:[['Mol dari 36 g air (Mr 18)?',['1','2','3','0,5'],1,'mol = massa/Mr = 36/18 = 2.']]},
'Ekonomi':{s:'Konsep inti: permintaan-penawaran, elastisitas, inflasi, dan kebijakan fiskal-moneter.',q:[['Jika harga naik dan permintaan turun, hukum yang berlaku?',['Hukum Penawaran','Hukum Permintaan','Hukum Gossen','Hukum Say'],1,'Harga naik → jumlah diminta turun = Hukum Permintaan.']]},
'Literasi B. Inggris':{s:'Konsep inti: main idea, inference, dan vocabulary in context. Baca pertanyaan dulu, lalu pindai teks.',q:[['"Scarce" paling dekat artinya…',['Abundant','Rare','Cheap','Heavy'],1,'Scarce = langka = rare.']]},
'PU':{s:'Konsep inti: penalaran induktif, deduktif, dan kuantitatif. Cari pola sebelum menghitung.',q:[['Pola 2, 4, 8, 16, … angka berikutnya?',['24','30','32','20'],2,'Setiap suku dikali 2 → 16×2 = 32.']]}};
const BANK=Object.assign(BASE_BANK,window.LEARNEE_MATERIALS||{});
const getBank=s=>{const bank=BANK[s]||{s:'Ringkasan '+s+': pahami konsep inti, hafalkan istilah kunci, lalu latihan soal bertahap dari mudah ke sulit. Tandai topik yang sering muncul di SNBT/TKA.',q:[['Langkah pertama terbaik saat mengerjakan soal '+s+'?',['Menebak cepat','Memahami perintah soal','Melihat opsi terakhir','Melewati semuanya'],1,'Memahami perintah soal mencegah salah tafsir.']]};return {...bank,q:window.LearneeQuestionFactory?window.LearneeQuestionFactory(s,bank):bank.q}}
const DEF={role:'student',page:'home',off:false,tab:'SNBT',subj:'PK',sub:'sum',programOpen:false,mf:'all',faq:'siswa',faqOpen:-1,snbtFeatureOpen:-1,mentorSubject:'Semua',mentorSearch:'',
 mentors:[
 {id:'m1',n:'Kak Dimas Pratama',sp:['PK','PU','Penalaran Matematika','Matematika Lanjut'],mode:'both',city:'Surabaya',price:20000,r:4.8,rc:32,free:2,c:'#2563EB'},
 {id:'m2',n:'Bu Sari Wulandari',sp:['Fisika','Kimia','Biologi'],mode:'online',city:'Malang',price:20000,r:4.9,rc:41,free:0,c:'#10B981'},
 {id:'m3',n:'Kak Rafi Mahendra',sp:['Literasi B. Inggris','PBM','Literasi B. Indonesia'],mode:'both',city:'Jakarta',price:20000,r:4.7,rc:18,free:3,c:'#F59E0B'},
 {id:'m4',n:'Pak Hendra Kusuma',sp:['Ekonomi','Sosiologi','Geografi','Sejarah'],mode:'offline',city:'Surabaya',price:20000,r:4.6,rc:25,free:1,c:'#8B5CF6'},
 {id:'m5',n:'Kak Nadia (Mentor Baru)',sp:['PPU','PBM','PU','PK','Fisika','Ekonomi'],mode:'both',city:'Sidoarjo',price:20000,r:0,rc:0,free:3,c:'#EC4899',demo:1}],
 sessions:[],reviews:[],materials:[],
 T:{reg:false,name:'',email:'',file:'',doc:'none',identity:'',identityFile:'',qualification:'',qualificationFile:'',experience:'',subjects:[],free:0,bal:0,claimed:false}};
let S;
try{S=Object.assign({},DEF,JSON.parse(localStorage.getItem('learnee_v1')||'{}'))}catch(e){S=JSON.parse(JSON.stringify(DEF))}
S.modal=null;
S.mentors=S.mentors.map(m=>({...m,price:20000,mode:'online'}));
const IS_ADMIN_PAGE=location.pathname.toLowerCase().endsWith('/admin.html');
if(IS_ADMIN_PAGE)S.role='admin';
else{S.role='student';S.page='home';S.modal=null}
const save=()=>{try{const{modal,...x}=S;localStorage.setItem('learnee_v1',JSON.stringify(x))}catch(e){}};const PDF_DB_NAME='learnee-content-files-v1';
let pdfDBPromise;
const pdfObjectUrls=new Set();
function pdfDB(){if(!('indexedDB'in window))return Promise.reject(new Error('Browser ini tidak mendukung penyimpanan file.'));if(pdfDBPromise)return pdfDBPromise;pdfDBPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(PDF_DB_NAME,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('files'))req.result.createObjectStore('files')};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Penyimpanan PDF tidak tersedia.'))});return pdfDBPromise}
function putPDF(file,id){return pdfDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(file,id);tx.oncomplete=()=>resolve(id);tx.onerror=()=>reject(tx.error||new Error('PDF gagal disimpan.'));tx.onabort=()=>reject(tx.error||new Error('Penyimpanan PDF dibatalkan.'))}))}
function getPDF(id){return pdfDB().then(db=>new Promise((resolve,reject)=>{const req=db.transaction('files','readonly').objectStore('files').get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error||new Error('PDF tidak bisa dibuka.'))}))}
function removePDF(id){if(!id)return Promise.resolve();return pdfDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)}))}
async function validPDF(file){if(!file)return false;if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf')){toast('Pilih file dengan format PDF.');return false}if(file.size>25*1024*1024){toast('Ukuran PDF maksimal 25 MB.');return false}const header=new TextDecoder().decode(await file.slice(0,1024).arrayBuffer());if(!header.includes('%PDF-')){toast('File yang dipilih bukan dokumen PDF yang valid.');return false}return true}
function escapeHTML(value){return String(value??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function fileSizeLabel(bytes){if(!bytes)return 'PDF';return bytes<1048576?Math.max(1,Math.round(bytes/1024))+' KB':(bytes/1048576).toFixed(1)+' MB'}/* Offline cache: seluruh ringkasan & bank soal di-prefetch ke localStorage */
try{const c={};[...SN,...TK].forEach(s=>c[s]=getBank(s));localStorage.setItem('learnee_cache',JSON.stringify(c))}catch(e){}
const isOff=()=>!navigator.onLine;
const rp=n=>n?'Rp '+n.toLocaleString('id-ID'):'Rp 0 (Sesi Gratis)';
const $=s=>document.querySelector(s);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.remove('hidden');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.add('hidden'),2800)};
const stars=n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));

/* ---------- Maskot Lee ---------- */
function lee(v='hero',w=170){
 const image=v==='landing'?'./assets/maskot-bandeng-standing.png?v=1':'./assets/maskot-bandeng.png?v=2';
 return `<img src="${image}" alt="Maskot Learnee" class="learnee-mascot mascot-${v} mascot-size-${w}">`;
}

/* ---------- Navigasi & status ---------- */
const NAV=[['Beranda','beranda'],['Sesi TKA','sesi','TKA'],['Sesi SNBT','sesi','SNBT'],['Mentoring','sesi','SNBT','men']];
function handleNav(item){
 if(!item[2]){S.page='home';go('student');return}
 if(item[2]==='SNBT'&&!item[3]){S.role='student';S.page='snbt';S.snbtFeatureOpen=-1;render();scrollTo(0,0);return}
 if(item[2]==='TKA'&&!item[3]){S.role='student';S.page='tka';S.tab='TKA';S.subj='Matematika Lanjut';S.snbtFeatureOpen=-1;render();scrollTo(0,0);return}
 if(item[3]==='men'){S.role='student';S.page='mentoring';S.mentorSubject='Semua';S.mentorSearch='';render();scrollTo(0,0);return}
 openLearningHub(item[2],item[3]||'sum')
}function chrome(){
 if(IS_ADMIN_PAGE){const n=$('#net');if(n){const off=isOff();n.textContent=off?'Mode Offline':'Status: Online';n.classList.toggle('is-offline',off);n.classList.toggle('is-online',!off)}return}
 const h=NAV.map(n=>`<a href="#${n[1]}" onclick='handleNav(${JSON.stringify(n)})' class="nav-link hover:underline">${n[0]}</a>`).join('');
 $('#nav1').innerHTML=h;$('#nav2').innerHTML=h;
 const o=isOff(),n=$('#net');
 n.textContent=o?'Mode Offline':'Status: Online';
 n.classList.toggle('is-offline',o);n.classList.toggle('is-online',!o);

 $('#role').value=S.role;
}
function go(r,sec){S.role=r;S.page='home';S.modal=null;render();if(sec)setTimeout(()=>document.getElementById(sec)?.scrollIntoView(),50);else scrollTo(0,0)}
function openMentoringPage(){S.role='student';S.page='mentoring';S.snbtFeatureOpen=-1;S.mentorSubject='Semua';S.mentorSearch='';render();scrollTo(0,0)}
function openLearningHub(tab='SNBT',sub='sum'){
 S.role='student';
 if(tab==='SNBT'&&sub==='men'){openMentoringPage();return}
 if(tab==='SNBT'){S.page='snbt';S.snbtFeatureOpen=sub==='soal'?1:sub==='sum'?0:-1;render();if(S.snbtFeatureOpen>=0)requestAnimationFrame(()=>document.getElementById('snbt-bank')?.scrollIntoView({behavior:'smooth',block:'start'}));else scrollTo(0,0);return}
 if(tab==='TKA'){S.page='tka';S.tab='TKA';S.subj='Matematika Lanjut';S.snbtFeatureOpen=sub==='soal'?1:sub==='sum'?0:-1;render();if(S.snbtFeatureOpen>=0)requestAnimationFrame(()=>document.getElementById('tka-bank')?.scrollIntoView({behavior:'smooth',block:'start'}));else scrollTo(0,0);return}
 S.page='home';S.tab=tab;S.subj='Fisika';S.sub=sub;S.programOpen=true;render()
}function openProgram(tab,trigger){
 if(trigger){trigger.classList.add('is-zooming');trigger.setAttribute('aria-busy','true')}
 setTimeout(()=>{S.role='student';if(tab==='SNBT'){S.page='snbt';S.snbtFeatureOpen=-1;render();scrollTo(0,0);return}S.page='tka';S.tab='TKA';S.subj='Matematika Lanjut';S.snbtFeatureOpen=-1;render();scrollTo(0,0)},trigger?260:0)
}function backToPrograms(){S.programOpen=false;render();requestAnimationFrame(()=>document.getElementById('programs')?.scrollIntoView({behavior:'smooth',block:'start'}))}
function scrollTestimonials(direction){const track=document.getElementById('testimonial-track');if(track)track.scrollBy({left:direction*Math.max(track.clientWidth*.78,300),behavior:'smooth'})}
function startTestimonialAutoplay(){
 clearInterval(window.__testimonialTicker);
 const track=document.getElementById('testimonial-track');if(!track)return;
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 if(!track.dataset.loopReady){
  const originals=[...track.children],originalWidth=track.scrollWidth;
  originals.forEach(card=>{const copy=card.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));track.append(copy)});
  track.dataset.loopWidth=String(originalWidth);track.dataset.loopReady='true';
 }
 let paused=false;
 track.classList.add('is-autoplaying');
 track.onpointerenter=()=>{paused=true};track.onpointerleave=()=>{paused=track.contains(document.activeElement)};
 track.onfocusin=()=>{paused=true};track.onfocusout=()=>{paused=track.matches(':hover')};
 window.__testimonialTicker=setInterval(()=>{
  if(paused||document.hidden)return;
  track.scrollLeft+=.55;
  const loopWidth=Number(track.dataset.loopWidth)||0;
  if(loopWidth&&track.scrollLeft>=loopWidth)track.scrollLeft-=loopWidth;
 },20);
}

window.addEventListener('online',render);window.addEventListener('offline',render);
function helpLee(){openM(`<div class="card p-6 max-w-sm text-center">${lee('help',110)}<h3 class="font-extrabold text-lg mt-2">Hai, aku Lee!</h3><p class="mu text-sm mt-1">${isOff()?'Kamu offline, tapi materi tersimpan tetap bisa dibaca. Buka tab Sesi lalu pilih Ringkasan atau Bank Soal.':'Butuh bantuan? Pilih mentor di tab Sesi, lalu klaim sesi gratis jika tersedia.'}</p><button class="btn btn-p mt-4" onclick="closeM()">Siap, Lee!</button></div>`)}

/* ---------- Modal ---------- */
function openM(h,st){S.modal=st||{t:'x'};const m=$('#modal');m.innerHTML=h;m.classList.add('show')}
function closeM(){S.modal=null;pdfObjectUrls.forEach(url=>URL.revokeObjectURL(url));pdfObjectUrls.clear();$("#modal").classList.remove("show");$("#modal").innerHTML=""}/* ---------- Render ---------- */
function newMaterialId(){return 'material-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function publishedMaterialContent(pair,featureIndex,slotLabel){
 const code=pair[0],name=pair[1],aliases={LBI:['Literasi B. Indonesia','Literasi dalam Bahasa Indonesia'],LBE:['Literasi B. Inggris','Literasi dalam Bahasa Inggris']};
 const subjects=[code,name].concat(aliases[code]||[]).map(x=>x.toLowerCase()),isQuestion=featureIndex===1;
 const docs=S.materials.filter(m=>m.ok&&m.pdfId&&subjects.includes(String(m.subj||'').toLowerCase())&&(String(m.kind||'').toLowerCase().indexOf('soal')>=0)===isQuestion);
 if(!docs.length)return '<div class="material-empty-slot" aria-label="'+escapeHTML(slotLabel)+' yang akan ditambahkan"></div><button type="button" class="material-empty-button" disabled>'+escapeHTML(slotLabel)+' menyusul</button>';
 return '<div class="material-pdf-list">'+docs.map(m=>'<article class="material-pdf-item"><div><b>'+escapeHTML(m.title)+'</b><small>'+escapeHTML(m.fileName||'Dokumen PDF')+' &middot; '+fileSizeLabel(m.fileSize)+'</small></div><button type="button" class="material-pdf-open" onclick="openMaterialPdf(\''+m.id+'\')">Buka PDF</button></article>').join('')+'</div>';
}
function materialManageCard(m,admin){
 const status=m.ok?'Tayang':m.rejected?'Ditolak':'Menunggu review';
 let actions=m.pdfId?'<button class="btn btn-o" onclick="openMaterialPdf(\''+m.id+'\')">Lihat PDF</button>':'';
 actions+='<button class="btn btn-o" onclick="editMaterial(\''+m.id+'\')">Edit</button>';
 if(admin)actions+=m.ok?'<button class="btn btn-o" onclick="setMaterialPublished(\''+m.id+'\',false)">Tarik</button>':'<button class="btn btn-p" onclick="reviewMat(\''+m.id+'\',true)">Tayangkan</button>'+(!m.rejected?'<button class="btn btn-o" onclick="reviewMat(\''+m.id+'\',false)">Tolak</button>':'');
 actions+='<button class="btn btn-delete" onclick="deleteMaterial(\''+m.id+'\')">Hapus</button>';
 return '<article class="material-manage-card"><div class="material-manage-head"><div><span class="material-kind-label">'+escapeHTML(m.kind||'Materi')+' &middot; '+escapeHTML(m.subj||'')+'</span><h4>'+escapeHTML(m.title||'Materi tanpa judul')+'</h4></div><span class="material-manage-status '+(m.ok?'is-live':m.rejected?'is-rejected':'is-pending')+'">'+status+'</span></div><p>'+escapeHTML(m.body||'Tidak ada deskripsi.')+'</p><div class="material-manage-meta"><span>'+escapeHTML(m.fileName||m.asset||'Belum ada PDF')+'</span><span>'+fileSizeLabel(m.fileSize)+'</span><span>'+escapeHTML(m.teacher||'Admin')+'</span></div><div class="material-manage-actions">'+actions+'</div>'+(m.note?'<small class="material-review-note">Catatan admin: '+escapeHTML(m.note)+'</small>':'')+'</article>';
}
async function createPDFMaterial(prefix,published){
 const title=$('#'+prefix+'-title').value.trim(),subject=$('#'+prefix+'-subject').value,kind=$('#'+prefix+'-kind').value,description=$('#'+prefix+'-description').value.trim(),file=$('#'+prefix+'-pdf').files[0];
 if(!title)return toast('Isi judul materi atau soal.');if(!file)return toast('Pilih file PDF terlebih dahulu.');if(!await validPDF(file))return;
 const id=newMaterialId(),pdfId='pdf-'+id;
 try{await putPDF(file,pdfId);S.materials.unshift({id,title,subj:subject,kind,body:description,fileName:file.name,fileSize:file.size,pdfId,teacher:published?'Admin':S.T.name,ok:published,rejected:false,note:'',createdAt:Date.now()});save();render();toast(published?'PDF disimpan dan langsung tayang.':'PDF dikirim ke antrean review admin.')}catch(e){toast(e.message||'PDF gagal disimpan.')}
}
function addMat(){return createPDFMaterial('teacher',false)}
function addAdminMat(){return createPDFMaterial('admin',true)}
function editMaterial(id){
 const m=S.materials.find(x=>x.id===id);if(!m)return toast('Materi tidak ditemukan.');
 if(S.role==='teacher'&&m.teacher!==S.T.name)return toast('Kamu hanya dapat mengubah materi milikmu.');
 const subjects=[...new Set([...SN,...TK])],options=subjects.map(s=>'<option '+(m.subj===s?'selected':'')+'>'+escapeHTML(s)+'</option>').join('');
 const kinds=['Ringkasan materi','Bank soal'],kindOptions=kinds.map(k=>'<option '+(String(m.kind).toLowerCase()===k.toLowerCase()?'selected':'')+'>'+k+'</option>').join('');
 let html='<div class="card material-edit-dialog"><div class="material-editor-head"><div><span class="snbt-section-kicker">Kelola konten</span><h3>Edit materi atau soal</h3></div><button class="material-close" onclick="closeM()" aria-label="Tutup">&times;</button></div>';
 html+='<label>Judul<input id="edit-title" class="inp" value="'+escapeHTML(m.title)+'"></label><label>Mapel atau subtes<select id="edit-subject" class="inp">'+options+'</select></label><label>Jenis konten<select id="edit-kind" class="inp">'+kindOptions+'</select></label><label>Deskripsi<textarea id="edit-description" class="inp" rows="3">'+escapeHTML(m.body||'')+'</textarea></label><label>Ganti PDF (opsional)<input id="edit-pdf" class="inp" type="file" accept=".pdf,application/pdf"><small>PDF maksimal 25 MB. Kosongkan jika file tidak diganti.</small></label><div class="material-manage-actions"><button class="btn btn-p" onclick="saveMaterialEdit(\''+m.id+'\')">Simpan perubahan</button><button class="btn btn-o" onclick="closeM()">Batal</button></div></div>';
 openM(html,{t:'material-edit'});
}
async function saveMaterialEdit(id){
 const m=S.materials.find(x=>x.id===id);if(!m)return toast('Materi tidak ditemukan.');
 const title=$('#edit-title').value.trim(),file=$('#edit-pdf').files[0];if(!title)return toast('Judul wajib diisi.');if(file&&!await validPDF(file))return;
 try{let nextPdfId=m.pdfId;const oldPdfId=m.pdfId;if(file){nextPdfId='pdf-'+newMaterialId();await putPDF(file,nextPdfId)}m.title=title;m.subj=$('#edit-subject').value;m.kind=$('#edit-kind').value;m.body=$('#edit-description').value.trim();if(file){m.pdfId=nextPdfId;m.fileName=file.name;m.fileSize=file.size}if(S.role==='teacher'){m.ok=false;m.rejected=false;m.note='Menunggu review admin setelah perubahan.'}m.updatedAt=Date.now();save();if(file&&oldPdfId)await removePDF(oldPdfId);closeM();render();toast(S.role==='admin'?'Perubahan materi disimpan.':'Perubahan dikirim untuk review admin.')}catch(e){toast(e.message||'Perubahan gagal disimpan.')}
}
async function deleteMaterial(id){
 const m=S.materials.find(x=>x.id===id);if(!m)return;if(S.role==='teacher'&&m.teacher!==S.T.name)return toast('Kamu hanya dapat menghapus materi milikmu.');if(!confirm('Hapus materi atau soal ini?'))return;
 try{if(m.pdfId)await removePDF(m.pdfId);S.materials=S.materials.filter(x=>x.id!==id);save();render();toast('Materi berhasil dihapus.')}catch(e){toast(e.message||'Materi gagal dihapus.')}
}
function reviewMat(id,approve){const m=S.materials.find(x=>x.id===id);if(!m)return;m.ok=approve;m.rejected=!approve;m.note=approve?'':'Materi belum disetujui admin.';save();render();toast(approve?'PDF disetujui dan ditayangkan.':'PDF ditolak. Guru dapat memperbaiki lalu mengirim ulang.')}
function setMaterialPublished(id,published){const m=S.materials.find(x=>x.id===id);if(!m)return;m.ok=published;m.rejected=false;m.note='';save();render();toast(published?'Materi ditayangkan.':'Materi ditarik dari katalog.')}
async function openMaterialPdf(id){
 const m=S.materials.find(x=>x.id===id);if(!m||!m.pdfId)return toast('File PDF tidak tersedia.');
 try{const file=await getPDF(m.pdfId);if(!file)return toast('PDF tidak ditemukan di penyimpanan browser ini.');const blob=file.type==='application/pdf'?file:new Blob([file],{type:'application/pdf'}),url=URL.createObjectURL(blob);pdfObjectUrls.add(url);let html='<div class="material-preview"><div class="material-editor-head"><div><span class="snbt-section-kicker">'+escapeHTML(m.kind||'Materi')+' &middot; '+escapeHTML(m.subj||'')+'</span><h3>'+escapeHTML(m.title)+'</h3></div><button class="material-close" onclick="closeM()" aria-label="Tutup">&times;</button></div><iframe title="Pratinjau '+escapeHTML(m.fileName)+'" src="'+url+'"></iframe><a class="btn btn-p" href="'+url+'" download="'+escapeHTML(m.fileName||'learnee.pdf')+'">Unduh PDF</a></div>';openM(html,{t:'pdf-preview'})}catch(e){toast(e.message||'PDF tidak bisa dibuka.')}
}function render(){chrome();$('#app').classList.toggle('is-mentoring-page',S.page==='mentoring');const pageView=S.role==='teacher'?teacherView():S.role==='admin'?adminView():S.page==='mentoring'?snbtMentorSection():S.page==='tka'?tkaLandingView():S.page==='snbt'?snbtLandingView():studentView();$('#app').innerHTML=pageView+footerView();const fill=$('#feeProgress');if(fill)fill.style.width=`${progress().pct}%`;startTestimonialAutoplay();save()}

function footerView(){
 return `<footer class="site-footer"><svg class="site-footer-wave" viewBox="0 0 1440 130" preserveAspectRatio="none" aria-hidden="true"><path d="M0 65 C170 12 335 20 520 48 C750 82 900 116 1110 85 C1240 66 1340 55 1440 40 L1440 130 L0 130 Z"/></svg><div class="site-footer-inner"><div class="site-footer-brand"><a class="site-footer-logo" href="#beranda" onclick="go('student')"><img src="./assets/maskot-bandeng.png?v=2" alt=""><span>Learnee</span></a><p>Belajar bebas batas, tembus PTN impian. Materi gratis yang tetap bisa dibuka saat sinyal hilang.</p><div class="site-footer-reasons"><h3>Mengapa memilih Learnee?</h3><div class="site-footer-reason"><span aria-hidden="true">&#9733;</span><p><b>Belajar gratis</b><br>Mulai persiapan TKA dan SNBT tanpa biaya.</p></div><div class="site-footer-reason"><span aria-hidden="true">&#8734;</span><p><b>Tetap bisa belajar offline</b><br>Akses materi dan bank soal walau sinyal hilang.</p></div><div class="site-footer-reason"><span aria-hidden="true">&#10003;</span><p><b>Dibantu mentor terverifikasi</b><br>Pilih mentor sesuai mapel dan kebutuhanmu.</p></div></div><div class="site-footer-pills"><button onclick="handleNav(['Sesi SNBT','sesi','SNBT'])">Persiapan SNBT</button><button onclick="handleNav(['Sesi TKA','sesi','TKA'])">Persiapan TKA</button><button onclick="openMentoringPage()">Konsultasi Mentor</button></div><div class="site-footer-contact"><a href="mailto:bantuan@learnee.id"><span aria-hidden="true">&#9993;</span>bantuan@learnee.id</a><a href="https://instagram.com/learnee.id" target="_blank" rel="noreferrer"><span aria-hidden="true">&#9673;</span>@learnee.id</a></div></div><nav class="site-footer-links" aria-label="Navigasi footer"><div class="site-footer-group"><h3>Belajar</h3><a href="#sesi" onclick="handleNav(['Sesi SNBT','sesi','SNBT'])">Materi SNBT</a><a href="#sesi" onclick="handleNav(['Sesi TKA','sesi','TKA'])">Persiapan TKA</a><a href="#fasilitas" onclick="openMentoringPage()">Konsultasi Mentor</a><a href="#fasilitas" onclick="go('student','fasilitas')">Belajar Offline</a></div><div class="site-footer-group"><h3>Learnee</h3><a href="#beranda" onclick="go('student')">Beranda</a><a href="#tentang" onclick="go('student','tentang')">Tentang Kami</a><a href="#testimoni" onclick="go('student','testimoni')">Testimoni</a><a href="#faq" onclick="go('student','faq')">FAQ</a></div><div class="site-footer-group"><h3>Bantuan &amp; Panduan</h3><a href="mailto:bantuan@learnee.id">Pusat Bantuan</a><a href="mailto:bantuan@learnee.id">Hubungi Kami</a><a href="#faq" onclick="go('student','faq')">Pertanyaan Umum</a></div></nav></div><div class="site-footer-bottom"><span>&copy; ${new Date().getFullYear()} Learnee. Belajar untuk masa depan.</span><div><a href="#tentang" onclick="go('student','tentang')">Privasi</a><a href="#tentang" onclick="go('student','tentang')">Syarat &amp; Ketentuan</a></div></div></footer>`;
}
function mentorIntroFree(m){return Boolean(m.demo)&&m.r<4}
function mentorCostsFree(m){return mentorIntroFree(m)||m.free>0}
function mentorPhoto(m){
 const photos={m1:'kak%20dimas.jpg',m2:'bu%20sari.jpg',m3:'kak%20rafi.jpg',m4:'pak%20hendra.jpg',m5:'kak%20nadia.jpg'};
 return photos[m.id]?`<img src="./assets/${photos[m.id]}" alt="Foto ${m.n}" loading="lazy">`:'';
}
function mentorCard(m,compact){
 const off=isOff(),introFree=mentorIntroFree(m),freeNow=introFree||m.free>0;
 return `<div class="card p-4 flex flex-col gap-2"><div class="flex gap-3 items-center"><div class="mentor-avatar mentor-${m.id} w-12 h-12 rounded-full text-white font-extrabold flex items-center justify-center shrink-0">${mentorPhoto(m)||m.n.replace(/^(Kak|Bu|Pak) /,'')[0]}</div><div class="min-w-0"><div class="font-bold truncate mentor-identity-name">${m.n}</div><div class="text-xs mu">${m.city} · ${m.mode==='both'?'Online & Offline':m.mode==='online'?'Online':'Offline'}</div></div></div>
 <div class="text-sm rating-stars">${m.rc?stars(m.r)+` <span class="mu">${m.r.toFixed(1)} (${m.rc})</span>`:'<span class="mu">Belum ada rating</span>'}</div>
 <div class="text-xs mu">${m.sp.join(', ')}</div>
 <div class="flex items-center justify-between mt-auto pt-2"><div><div class="font-extrabold text-sm">${rp(freeNow?0:m.price)}</div>${introFree?`<span class="gold">Gratis sampai rating 4,0</span>`:m.free>0?`<span class="gold">Sesi Gratis Tersedia (${m.free})</span>`:`<span class="text-xs mu">per sesi - 45 menit</span>`}</div>
 <button class="btn btn-p" onclick="openBook('${m.id}')">Konsultasi</button></div></div>`;
}
function toggleSnbtFeature(index){S.snbtFeatureOpen=S.snbtFeatureOpen===index?-1:index;render();if(S.snbtFeatureOpen>=0)requestAnimationFrame(()=>document.getElementById('snbt-bank')?.scrollIntoView({behavior:'smooth',block:'start'}))}
function scrollSnbtRail(id,direction){const rail=document.getElementById(id);if(rail)rail.scrollBy({left:direction*Math.max(rail.clientWidth*.78,280),behavior:'smooth'})}
function snbtShortcutAction(i,item){return i===2?'openMentoringPage()':'toggleSnbtFeature('+i+')'}
function filterMentors(query){S.mentorSearch=query;const term=query.trim().toLowerCase();document.querySelectorAll('.mentor-directory-item').forEach(card=>{card.hidden=!card.dataset.search.includes(term)})}
function snbtMentorSection(){
 const standalone=S.page==='mentoring';
 const snbtSubjects=[['PU','Penalaran Umum'],['PPU','Pengetahuan dan Pemahaman Umum'],['PBM','Kemampuan Memahami Bacaan dan Menulis'],['PK','Pengetahuan Kuantitatif'],['Literasi B. Indonesia','Literasi Bahasa Indonesia (LBI)'],['Literasi B. Inggris','Literasi Bahasa Inggris (LBE)'],['Penalaran Matematika','Penalaran Matematika (PM)']];
 const subjectOptions=[['Semua',standalone?'Semua mapel dan subtes':'Semua subtes'],...snbtSubjects,...(standalone?TK.map(subject=>[subject,subject]):[])];
 const relevantSubjects=standalone?[...SN,...TK]:SN;
 const query=(S.mentorSearch||'').trim().toLowerCase();
 const mentors=S.mentors.filter(m=>m.sp.some(s=>relevantSubjects.includes(s))&&(S.mentorSubject==='Semua'||m.sp.includes(S.mentorSubject))).map(m=>({...m,sp:m.sp.filter(s=>relevantSubjects.includes(s))})).filter(m=>(m.n+' '+m.sp.join(' ')).toLowerCase().includes(query));
 const intro=standalone?'Pilih guru berdasarkan mapel TKA atau subtes SNBT yang ingin kamu pelajari. Lihat bidang ajar, rating, dan metode konsultasi setiap mentor.':'Pilih mentor berdasarkan subtes SNBT yang ingin kamu pelajari. Setiap mentor menampilkan mapel yang dikuasai, rating, dan metode konsultasi.';
 return `<section id="snbt-bank" class="snbt-bank-section snbt-mentor-section ${standalone?'standalone':''}"><div class="snbt-mentor-layout"><aside class="snbt-mentor-intro"><span class="snbt-section-kicker">Mentoring Learnee</span><h2>Belajar bersama mentor yang sesuai</h2><p>${intro}</p><div class="mentor-free-policy"><span>Program mentor baru</span><b>Sesi gratis untuk membangun rating</b><p>Mentor baru dengan rating di bawah 4,0 masuk kategori gratis. Sesi ini menjadi bagian dari persyaratan untuk memperoleh fee ke depannya.</p></div><div class="mentor-session-note"><b>Konsultasi 1:1</b><span>Pilih sesi online atau offline sesuai ketersediaan mentor.</span></div></aside><div class="snbt-mentor-results"><header class="mentor-results-heading"><div><span class="snbt-section-kicker">Direktori mentor</span><h3>${standalone?'Cari mentor':'Cari mentor SNBT'}</h3></div><span class="mentor-result-count">${mentors.length} mentor</span></header><label class="mentor-search-box"><span aria-hidden="true">&#9906;</span><input id="mentor-search" type="search" placeholder="Cari nama mentor atau mapel" value="${S.mentorSearch||''}" oninput="filterMentors(this.value)"></label><div class="mentor-subject-filters" role="group" aria-label="Filter mapel dan subtes">${subjectOptions.map(([value,label])=>`<button type="button" class="chip ${S.mentorSubject===value?'on':''}" onclick="S.mentorSubject='${value}';render();requestAnimationFrame(()=>document.getElementById('snbt-bank')?.scrollIntoView({behavior:'smooth',block:'start'}))">${label}</button>`).join('')}</div><div class="mentor-directory-grid">${mentors.map(m=>`<div class="mentor-directory-item" data-search="${(m.n+' '+m.sp.join(' ')).toLowerCase()}">${mentorCard(m)}</div>`).join('')||'<p class="mu text-sm">Belum ada mentor yang cocok dengan mapel atau subtes ini.</p>'}</div></div></div></section>`;
}
function toggleTkaFeature(index){S.snbtFeatureOpen=S.snbtFeatureOpen===index?-1:index;render();if(S.snbtFeatureOpen>=0)requestAnimationFrame(()=>document.getElementById('tka-bank')?.scrollIntoView({behavior:'smooth',block:'start'}))}
function scrollTkaRail(id,direction){const rail=document.getElementById(id);if(rail)rail.scrollBy({left:direction*Math.max(rail.clientWidth*.78,280),behavior:'smooth'})}
function tkaShortcutAction(i){return i===2?'openMentoringPage()':'toggleTkaFeature('+i+')'}
function openCourseMaterial(tab,subject,sub='sum'){
 S.role='student';S.page='home';S.tab=tab;S.subj=subject;S.sub=sub;S.programOpen=true;S.snbtFeatureOpen=-1;render();requestAnimationFrame(()=>document.getElementById('materi-hub')?.scrollIntoView({behavior:'smooth',block:'start'}));
}
function materialFeatureCard(tab,subject,name,index){
 const bank=getBank(subject),isSummary=index===0,preview=isSummary?bank.s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,190)+'...':`${bank.q.length} soal latihan dengan kunci dan pembahasan.`;
 return `<article class="snbt-subtest-card"><span class="subtest-code">${subject}</span><h3>${name}</h3><p class="mu text-sm">${preview}</p><button class="snbt-primary-button mt-3" onclick="openCourseMaterial('${tab}','${subject}','${isSummary?'sum':'soal'}')">${isSummary?'Buka ringkasan':'Mulai latihan'}</button></article>`;
}
function tkaFeatureView(featureIndex){
 const featureDefs=[['Ringkasan Materi TKA','Pilih mapel untuk melihat ruang ringkasan TKA.','Ruang ringkasan'],['Bank Soal TKA','Pilih mapel untuk melihat ruang latihan soal TKA.','Ruang bank soal'],];
 const [title,description,slotLabel]=featureDefs[featureIndex]||featureDefs[1];
 const badgeText='Gratis';
 const groups=[['I. Kelompok Saintek',[['MAT','Matematika Lanjut'],['FIS','Fisika'],['KIM','Kimia'],['BIO','Biologi']]],['II. Kelompok Soshum',[['EKO','Ekonomi'],['SOS','Sosiologi'],['GEO','Geografi'],['SEJ','Sejarah']]]];
 return `<section id="tka-bank" class="snbt-bank-section"><header class="snbt-bank-heading"><span class="snbt-section-kicker">Persiapan TKA</span><h2>${title}</h2><p>${description}</p></header>${groups.map((group,index)=>{const railId='tka-rail-'+index;return `<div class="snbt-subtest-group"><div class="snbt-subtest-heading"><h3>${group[0]}</h3><div class="snbt-rail-controls"><button type="button" aria-label="Geser subtes ke kiri" onclick="scrollTkaRail('${railId}',-1)">&larr;</button><button type="button" aria-label="Geser subtes ke kanan" onclick="scrollTkaRail('${railId}',1)">&rarr;</button></div></div><div id="${railId}" class="snbt-subtest-rail">${group[1].map(([code,name])=>`<article class="snbt-material-card"><div class="snbt-material-cover"><div class="snbt-cover-top"><b>Learnee</b><span>${badgeText}</span></div><div class="snbt-cover-copy"><small>${code} - Persiapan TKA</small><b>${name}</b></div><img src="./assets/maskot-bandeng-standing.png?v=1" alt="" loading="lazy"><i class="snbt-cover-decoration"></i></div><div class="snbt-material-info"><span class="material-status">${slotLabel}</span><h4>${name}</h4>${publishedMaterialContent([code,name],featureIndex,slotLabel)}</div></article>`).join('')}</div></div>`}).join('')}</section>`;
}
function snbtFeatureView(featureIndex){
 const featureDefs=[['Ringkasan Materi SNBT','Pilih subtes untuk melihat ruang ringkasan.','Ruang ringkasan'],['Bank Soal SNBT','Pilih subtes untuk melihat ruang latihan soal.','Ruang bank soal'],];
 const [title,description,slotLabel]=featureDefs[featureIndex]||featureDefs[1];
 const badgeText='Gratis';
 const groups=[['I. Tes Potensi Skolastik (TPS)',[['PU','Penalaran Umum'],['PPU','Pengetahuan dan Pemahaman Umum'],['PBM','Kemampuan Memahami Bacaan dan Menulis'],['PK','Pengetahuan Kuantitatif']]],['II. Tes Literasi',[['LBI','Literasi dalam Bahasa Indonesia'],['LBE','Literasi dalam Bahasa Inggris'],['PM','Penalaran Matematika']]]];
 return `<section id="snbt-bank" class="snbt-bank-section"><header class="snbt-bank-heading"><span class="snbt-section-kicker">Persiapan SNBT</span><h2>${title}</h2><p>${description}</p></header>${groups.map((group,index)=>{const railId='snbt-rail-'+index;return `<div class="snbt-subtest-group"><div class="snbt-subtest-heading"><h3>${group[0]}</h3><div class="snbt-rail-controls"><button type="button" aria-label="Geser subtes ke kiri" onclick="scrollSnbtRail('${railId}',-1)">&larr;</button><button type="button" aria-label="Geser subtes ke kanan" onclick="scrollSnbtRail('${railId}',1)">&rarr;</button></div></div><div id="${railId}" class="snbt-subtest-rail">${group[1].map(([code,name])=>`<article class="snbt-material-card"><div class="snbt-material-cover"><div class="snbt-cover-top"><b>Learnee</b><span>${badgeText}</span></div><div class="snbt-cover-copy"><small>${code} - Persiapan SNBT</small><b>${name}</b></div><img src="./assets/maskot-bandeng-standing.png?v=1" alt="" loading="lazy"><i class="snbt-cover-decoration"></i></div><div class="snbt-material-info"><span class="material-status">${slotLabel}</span><h4>${name}</h4>${publishedMaterialContent([code,name],featureIndex,slotLabel)}</div></article>`).join('')}</div></div>`}).join('')}</section>`;
}
function snbtLandingView(){
 if(S.snbtFeatureOpen>1)S.snbtFeatureOpen=-1;
 const shortcuts=[['Ringkasan Materi','Baca materi yang tersimpan dan tetap bisa diakses offline.','sum','▤'],['Bank Soal SNBT','Ruang latihan soal untuk setiap subtes SNBT.','soal','✎'],['Konsultasi Mentor','Diskusikan soal bersama mentor secara online.','men','♧']];
 return `<div class="snbt-landing-page">
  <section class="snbt-landing-hero"><div class="snbt-hero-inner"><div class="snbt-hero-copy"><span class="snbt-eyebrow"><i></i> Belajar lebih tenang bersama Learnee</span><h1>Belajar SNBT Tanpa Takut Sinyal Hilang</h1><p>Gratis, bisa dibuka offline, dan siap dibantu mentor kapan pun kamu butuh.</p><div class="snbt-hero-actions"><button class="snbt-primary-button" onclick="openLearningHub('SNBT','sum')">Mulai Belajar Gratis <span>→</span></button><span class="snbt-no-cost">Gratis · Materi offline · Mentor</span></div></div><div class="snbt-hero-art"><div class="snbt-art-glow"></div><img src="./assets/kak-denny-papan.png" alt="Kak Denny siap membantu persiapan SNBT dan TKA" loading="eager"><div class="snbt-art-note"><span>✓</span><div><b>Belajar tetap lanjut</b><small>Materi tersimpan offline</small></div></div><span class="snbt-art-spark" aria-hidden="true">✳</span></div></div></section>
  <section class="snbt-shortcuts"><div class="snbt-shortcuts-heading"><div><span class="snbt-section-kicker">Mulai dari sini</span><h2>Belajar sesuai kebutuhanmu</h2></div><button class="snbt-link-button" onclick="toggleSnbtFeature(0)">Lihat semua materi <span>→</span></button></div><div class="snbt-shortcut-grid">${shortcuts.map((item,i)=>`<button class="snbt-shortcut-card shortcut-${i+1} ${i<2&&S.snbtFeatureOpen===i?'is-selected':''}" onclick="${snbtShortcutAction(i,item)}"><span class="shortcut-icon" aria-hidden="true">${item[3]}</span><span class="shortcut-copy"><b>${item[0]}</b><small>${item[1]}</small></span><span class="shortcut-arrow" aria-hidden="true">→</span></button>`).join('')}</div></section>${S.snbtFeatureOpen>=0?snbtFeatureView(S.snbtFeatureOpen):''}
   </div>`;
}
function tkaLandingView(){
 if(S.snbtFeatureOpen>1)S.snbtFeatureOpen=-1;
 const shortcuts=[['Ringkasan Materi TKA','Baca materi yang tersimpan dan tetap bisa diakses offline.','sum','▤'],['Bank Soal TKA','Ruang latihan untuk setiap mapel TKA.','soal','✎'],['Konsultasi Mentor','Diskusikan soal bersama mentor secara online.','men','♧']];
 return `<div class="snbt-landing-page tka-landing-page">
  <section class="snbt-landing-hero"><div class="snbt-hero-inner"><div class="snbt-hero-copy"><span class="snbt-eyebrow"><i></i> Belajar TKA SMA/SMK bersama Learnee</span><h1>Siapkan TKA dengan Belajar yang Lebih Terarah</h1><p>Pahami mapel pilihanmu lewat ringkasan dan latihan gratis. Materi tersimpan offline agar kamu bisa belajar kapan saja.</p><div class="snbt-hero-actions"><button class="snbt-primary-button" onclick="openLearningHub('TKA','sum')">Mulai Belajar Gratis <span>→</span></button><span class="snbt-no-cost">Gratis · Materi offline · Mentor</span></div></div><div class="snbt-hero-art"><div class="snbt-art-glow"></div><img src="./assets/kak-denny-papan.png" alt="Kak Denny siap menemani persiapan TKA SMA dan SMK" loading="eager"><div class="snbt-art-note"><span>✓</span><div><b>Siap hadapi TKA</b><small>Ringkasan TKA bisa offline</small></div></div><span class="snbt-art-spark" aria-hidden="true">✳</span></div></div></section>
  <section class="snbt-shortcuts"><div class="snbt-shortcuts-heading"><div><span class="snbt-section-kicker">Mulai dari sini</span><h2>Belajar sesuai kebutuhanmu</h2></div><button class="snbt-link-button" onclick="toggleTkaFeature(0)">Lihat semua materi <span>→</span></button></div><div class="snbt-shortcut-grid">${shortcuts.map((item,i)=>`<button class="snbt-shortcut-card shortcut-${i+1} ${i<2&&S.snbtFeatureOpen===i?'is-selected':''}" onclick="${tkaShortcutAction(i,item)}"><span class="shortcut-icon" aria-hidden="true">${item[3]}</span><span class="shortcut-copy"><b>${item[0]}</b><small>${item[1]}</small></span><span class="shortcut-arrow" aria-hidden="true">→</span></button>`).join('')}</div></section>${S.snbtFeatureOpen>=0?tkaFeatureView(S.snbtFeatureOpen):''}
   </div>`;
}
function studentView(){
 const list=S.tab==='SNBT'?SN:TK, bank=getBank(S.subj);
 const ments=S.mentors.filter(m=>m.sp.includes(S.subj)&&(S.mf==='all'||m.mode===S.mf||m.mode==='both'));
 const off=isOff();
 const subTabs=[['sum','Ringkasan Materi'],['soal','Bank Soal'],['vid','Video Tutorial'],['men','Direktori Mentor']].map(t=>`<button class="chip ${S.sub===t[0]?'on':''}" onclick="S.sub='${t[0]}';render()">${t[1]}</button>`).join('');
 let body='';
 if(S.sub==='sum')body=`<div class="card p-5"><div class="flex items-center gap-2 mb-2"><h4 class="font-bold">${S.subj}</h4><span class="gold saved-badge">Tersimpan offline</span></div><p class="mu leading-relaxed max-w-prose">${bank.s}</p><button class="btn btn-o mt-4" onclick="readM()">Buka mode baca</button>${S.materials.filter(x=>x.subj===S.subj&&x.ok).map(x=>`<div class="mt-4 p-3 rounded-xl border bd"><b>${x.title}</b> <span class="gold">Materi Mentor</span><p class="text-sm mu mt-1">${x.body}</p></div>`).join('')}</div>`;
if(S.sub==='soal')S.activeQuiz=bank.q;
 if(S.sub==='soal')body=`<div class="question-set-toolbar"><span>${bank.q.length} soal acak dari materi. Soal dapat berubah setiap kali set diperbarui.</span><button type="button" class="btn btn-o" onclick="render()">Ganti soal</button></div>`+bank.q.map((q,i)=>`<div class="card p-5"><p class="font-semibold mb-3">${i+1}. ${q[0]}</p><div class="grid sm:grid-cols-2 gap-2">${q[1].map((o,j)=>`<button class="btn border bd text-left" onclick="ans(this,${j},${q[2]},${i})">${'ABCD'[j]}. ${o}</button>`).join('')}</div><div id="ex${i}" class="answer-explanation hidden mt-3 p-3 rounded-xl text-sm"></div></div>`).join('');
 if(S.sub==='vid')body=off?`<div class="card p-6 text-center">${lee('offline',90)}<p class="font-bold mt-2">Video butuh internet</p><p class="mu text-sm">Pemutaran video dinonaktifkan saat offline. Coba Ringkasan atau Bank Soal dulu ya.</p></div>`:`<div class="grid sm:grid-cols-2 gap-3">${['Konsep Inti','Trik Cepat'].map(t=>`<div class="card overflow-hidden"><div class="video-thumb h-32 flex items-center justify-center"><button class="video-play w-12 h-12 rounded-full" onclick="toast('Simulasi video: ${t} ${S.subj}')" aria-label="Putar">PLAY</button></div><div class="p-3"><b>${t} ${S.subj}</b><div class="text-xs mu">12 menit - Mentor Learnee</div></div></div>`).join('')}</div>`;if(S.sub==='men')body=`<div class="flex gap-2 mb-3">${[['all','Semua'],['online','Online'],['offline','Offline']].map(t=>`<button class="chip ${S.mf===t[0]?'on':''}" onclick="S.mf='${t[0]}';render()">${t[1]}</button>`).join('')}</div><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">${ments.map(m=>mentorCard(m)).join('')||'<p class="mu">Belum ada mentor untuk filter ini.</p>'}</div>`;
 const fq={siswa:[['Bagaimana klaim kuota sesi gratis?','Mentor yang masih punya kuota ditandai badge kuning. Saat booking, biaya otomatis Rp 0.'],['Bagaimana booking sesi?','Pilih mentor, pilih Online atau Offline, lalu mulai. Sesi berlangsung 45 menit.'],['Apakah materi bisa dibuka offline?','Ya. Ringkasan Materi dan Bank Soal tersimpan otomatis di perangkatmu.']],guru:[['Dokumen apa yang dibutuhkan?','Ijazah, transkrip, atau sertifikat yang divalidasi Admin.'],['Apa aturan 3 sesi gratis?','Selesaikan 3 sesi gratis dengan rating minimal 4,0 sebelum fee bisa diklaim.'],['Kapan fee bisa dicairkan?','Setelah dokumen terverifikasi, 3 sesi gratis selesai, dan minimal 1 materi diunggah.']]}[S.faq];
 const programChoices=`<div id="programs" class="program-picker"><header class="program-picker-heading"><h2>Program Pilihan Learnee</h2><p>Pilih program belajar yang sesuai dengan persiapanmu.</p></header><div class="program-grid">
  <button type="button" class="program-card" onclick="openProgram('TKA',this)" aria-label="Pilih program Persiapan TKA"><div class="program-art program-art-tka"><span class="program-badge">TKA SMA/SMK</span>${lee('study',240)}</div><div class="program-card-copy"><span class="program-kicker">Program Pilihan</span><h3>Persiapan TKA</h3><p>Pelajari mapel Saintek dan Soshum lewat ringkasan, latihan soal, dan pembahasan.</p><span class="program-cta">Lihat program</span></div></button>
  <button type="button" class="program-card" onclick="openProgram('SNBT',this)" aria-label="Pilih program Persiapan SNBT"><div class="program-art program-art-snbt"><span class="program-badge">Seleksi Nasional</span>${lee('landing',240)}</div><div class="program-card-copy"><span class="program-kicker">Program Pilihan</span><h3>Persiapan SNBT</h3><p>Siapkan diri menghadapi TPS dan Tes Literasi bersama materi, bank soal, dan mentor.</p><span class="program-cta">Lihat program</span></div></button>
 </div></div>`;
 const sessionPanel=S.programOpen?`<div id="materi-hub" class="learning-hub"><button type="button" class="program-back" onclick="backToPrograms()">← Kembali ke program pilihan</button><div class="learning-hub-head"><div>${lee(S.tab==='SNBT'?'snbt':'tka',68)}</div><div><h3>Sesi ${S.tab}</h3><p>Materi, latihan, video, dan mentor dalam satu tempat.</p></div><div class="hub-switch">${['SNBT','TKA'].map(t=>`<button class="chip ${S.tab===t?'on':''}" onclick="S.tab='${t}';S.subj=${t==='SNBT'?"'PK'":"'Fisika'"};render()">Sesi ${t}</button>`).join('')}</div></div><div class="subject-tabs mt-4">${list.map(s=>`<button class="chip ${S.subj===s?'on':''}" onclick="S.subj='${s}';render()">${s}</button>`).join('')}</div><div class="content-tabs">${subTabs}</div><div class="grid gap-3">${body}</div></div>`:programChoices;
 return `
<section id="beranda" class="grid md:grid-cols-2 gap-6 items-center py-10">
 <div><span class="eyebrow">Belajar bareng Kak Denny di Learnee</span><h1 class="text-4xl md:text-5xl font-extrabold leading-tight mt-4">Belajar di mana aja, tanya mentor kapan aja.</h1>
 <p class="mu mt-4 max-w-lg">Pilih materi belajarmu. Kak Denny akan bantu siapkan materi SNBT & TKA, latihan, dan mentor yang pas buat kamu.</p>
 <div class="flex gap-3 mt-6 flex-wrap"><button class="btn btn-p" onclick="go('student','sesi')">Mulai Belajar Gratis</button></div></div>
 <div class="hero-mascot-wrap flex justify-center"><span class="mascot-note">Hai! Aku Kak Denny.</span>${lee('landing',440)}<span class="mascot-note mascot-note-bottom">✨ Siap belajar?</span></div>
</section>
<div class="hero-about-bridge" aria-hidden="true"><svg viewBox="0 0 1200 60" preserveAspectRatio="none"><path d="M0 25 C100 17 200 17 300 25 S500 33 600 25 S800 17 900 25 S1100 33 1200 25 L1200 60 L0 60 Z"/></svg><span></span><span></span><span></span></div>
<section id="tentang" class="about-section">
 <header class="about-header"><h2>About Us</h2><h3>Belajar Gratis dan Bisa Offline untuk Pejuang PTN se-Indonesia</h3></header>
 <div class="about-content">
  <p>Learnee adalah web pembelajaran persiapan <strong>TKA SMA/SMK</strong> dan <strong>SNBT</strong> yang dirancang <strong>gratis</strong> untuk para pejuang kesuksesan. Materi, ringkasan, dan bank soal bisa diakses <strong>secara offline</strong>, sehingga kamu tetap bisa belajar di mana saja, kapan saja, tanpa terhalang sinyal. Saat bertemu soal yang sulit, kamu bisa berkonsultasi dengan mentor terverifikasi, mulai dari <strong>sesi gratis</strong> hingga <strong>harga pelajar</strong> yang tetap terjangkau.</p>
  <p>Learnee hadir dengan empat keunggulan utama, yaitu:</p>
  <ol>
   <li>Web persiapan TKA dan SNBT yang dapat diakses <strong>gratis</strong>.</li>
   <li>Materi dan bank soal yang dapat dibuka <strong>tanpa internet</strong> (offline-first).</li>
   <li>Sesi konsultasi <strong>online</strong> dengan mentor, dari gratis hingga harga pelajar.</li>
   <li>Mentor <strong>terverifikasi ijazah</strong> yang dikurasi melalui 4 tahap: daftar dan unggah ijazah, verifikasi admin, tiga sesi gratis dan unggah materi, lalu klaim fee.</li>
  </ol>
 </div>
</section>
<section id="sesi" class="py-8">
 ${sessionPanel}
</section>
<section id="fasilitas" class="facilities-section py-8">
 <div class="facilities-inner">
  <header class="facilities-heading"><span class="facilities-eyebrow">Fasilitas Learnee</span><h2 class="text-2xl font-extrabold">Belajar lebih mudah, ditemani mentor</h2><p>Semua yang kamu butuhkan untuk mempersiapkan TKA dan SNBT, dalam satu tempat.</p></header>
  <div class="facilities-layout">
   <div class="facilities-list">
    <div class="facilities-consultations"><article class="facility-card"><span class="facility-icon" aria-hidden="true">⌁</span><div><b>Konsultasi Online</b><p>Ruang chat 45 menit, unggah foto soal, dan tautan video call.</p></div></article></div>
    <div class="facilities-benefits">${[['Konsultasi Privat Per Sesi','Satu mentor, satu siswa, fokus pada soalmu.'],['Mentor Terverifikasi Ijazah','Dokumen dicek Admin sebelum mengajar.'],['Sesi Gratis untuk Siswa','Coba dulu bersama mentor baru, tanpa biaya.'],['Akses Belajar Tanpa Internet','Materi tersimpan dan terbuka saat offline.']].map((f,i)=>`<article class="facility-card facility-benefit"><span class="facility-number">0${i+1}</span><div><b>${f[0]}</b><p>${f[1]}</p></div></article>`).join('')}</div>
   </div>
   <figure class="facilities-mascot"><img src="./assets/kak-denny-papan.png" alt="Kak Denny menjelaskan pelajaran di depan papan tulis" loading="lazy"><figcaption>Belajar bareng Kak Denny</figcaption></figure>
  </div>
 </div>
</section>
<section id="testimoni" class="testimonials-section py-8">
 <div class="testimonials-heading"><div><span class="facilities-eyebrow">Cerita Pejuang PTN</span><h2>Apa Kata Mereka</h2><p>Pengalaman belajar bersama Learnee dari para siswa.</p></div><div class="testimonial-controls"><button type="button" aria-label="Geser testimoni ke kiri" onclick="scrollTestimonials(-1)">←</button><button type="button" aria-label="Geser testimoni ke kanan" onclick="scrollTestimonials(1)">→</button></div></div>
 <div id="testimonial-track" class="testimonial-track" tabindex="0" aria-label="Daftar testimoni, geser ke samping">
 ${[['Aisyah R.','SMAN 5 Surabaya','Kedokteran UNAIR',5,'Sesi gratisnya bikin berani mulai. Penjelasan Kak Dimas runtut.'],['Bagas P.','SMKN 2 Malang','Teknik Informatika ITS',5,'Materinya tetap bisa dibuka waktu sinyal hilang. Sangat membantu.'],['Citra L.','MAN 1 Sidoarjo','Akuntansi UB',4,'Mentor online-nya ramah, penjelasannya mudah dipahami.'],...S.reviews.slice(-6).map(r=>[r.by,'Pengguna Learnee','Pejuang PTN',r.s,r.t||'Sesi yang membantu.'])].map(t=>`<article class="testimonial-card"><p class="testimonial-quote">“${t[4]}”</p><div class="testimonial-footer"><div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${t[0].trim().charAt(0).toUpperCase()}</span><div><b>${t[0]}</b><small>${t[1]} · ${t[2]}</small></div></div><span class="testimonial-stars" aria-label="${t[3]} dari 5 bintang">${stars(t[3])}</span></div></article>`).join('')}
 </div>
</section>
<section id="faq" class="faq-section py-8">
 <div class="faq-layout">
  <div class="faq-content"><header class="faq-heading"><span class="facilities-eyebrow">Kami siap membantu</span><h2>Tanya Jawab</h2><p>Temukan jawaban seputar belajar, mentor, dan fitur Learnee.</p></header>
   <div class="faq-categories" role="tablist" aria-label="Kategori pertanyaan">${[['siswa','Untuk Siswa'],['guru','Untuk Mentor']].map(t=>`<button role="tab" aria-selected="${S.faq===t[0]}" class="chip ${S.faq===t[0]?'on':''}" onclick="S.faq='${t[0]}';S.faqOpen=-1;render()">${t[1]}</button>`).join('')}</div>
   <div class="faq-list">${fq.map((f,i)=>`<article class="faq-item ${S.faqOpen===i?'is-open':''}"><button class="faq-question" aria-expanded="${S.faqOpen===i}" onclick="S.faqOpen=S.faqOpen===${i}?-1:${i};render()"><span>${f[0]}</span><span class="faq-toggle" aria-hidden="true">${S.faqOpen===i?'−':'+'}</span></button>${S.faqOpen===i?`<p class="faq-answer">${f[1]}</p>`:''}</article>`).join('')}</div>
  </div>
  <figure class="faq-mascot"><div class="faq-orbit"></div><img src="./assets/kak-denny-nunjuk-kiri.png" alt="Maskot Kak Denny menunjuk ke arah daftar pertanyaan" loading="lazy"><figcaption>Ada yang ingin ditanyakan?</figcaption></figure>
 </div>
</section>
<section id="gratis-efektif" class="free-effective-section">
 <div class="free-effective-inner">
  <div class="free-effective-copy"><span class="facilities-eyebrow">Belajar bareng Learnee</span><h2>gratis. efektif. fleksibel.</h2><p>Pelajari materi SNBT & TKA kapan pun dan di mana pun tanpa khawatir kehabisan kuota. Lengkapi belajarmu dengan latihan soal dan sesi konsultasi saat butuh bantuan mentor</p><a class="btn btn-p" href="#sesi" onclick="go('student','sesi')">Mulai Belajar Gratis</a></div>
  <div class="free-effective-visual mentor-scene" aria-label="Ilustrasi sesi konsultasi dengan mentor Learnee">
   <div class="consultation-card"><div class="consultation-header"><span class="consultant-avatar">KD</span><div><b>Kak Denny</b><small><i></i> Mentor · sedang online</small></div><span class="consultation-more">•••</span></div><div class="consultation-topic">Sesi konsultasi <span>45 menit</span></div><div class="consultation-message student-message">Kak, boleh bantu bahas soal ini?</div><div class="consultation-message mentor-message">Tentu! Kita pahami langkahnya bareng-bareng, ya.</div><div class="consultation-footer"><span class="call-wave"><i></i><i></i><i></i><i></i><i></i></span><b>Konsultasi berlangsung</b><span class="call-time">12:08</span></div></div>
   <span class="mentor-scene-badge">✦ Mentor siap membantu</span><span class="mentor-scene-spark" aria-hidden="true">✳</span>
  </div>
 </div>
</section>
`;
}
function ans(b,j,c,i){const ex=$('#ex'+i),ok=j===c;ex.classList.remove('hidden');b.classList.add(ok?'answer-correct':'answer-incorrect');ex.innerHTML=(ok?'<b>Benar!</b> ':'<b>Belum tepat.</b> ')+'Pembahasan: '+(S.activeQuiz?.[i]?.[3]||getBank(S.subj).q[i][3])}
function readM(){openM(`<div class="card p-6 max-w-lg w-full">${lee(S.tab==='SNBT'?'snbt':'tka',80)}<h3 class="font-extrabold text-lg">Ringkasan ${S.subj}</h3><p class="mu mt-2 leading-relaxed">${getBank(S.subj).s}</p><button class="btn btn-p mt-4" onclick="closeM()">Tutup</button></div>`)}

/* ---------- Konsultasi ---------- */
function openBook(id){
 const m=S.mentors.find(x=>x.id===id);
 if(!m)return toast('Data mentor tidak ditemukan.');
 const free=mentorCostsFree(m),rating=m.rc?`${stars(m.r)} <span class="mu">${m.r.toFixed(1)} (${m.rc} ulasan)</span>`:'<span class="mu">Belum ada rating</span>';
 const modeLabel=m.mode==='both'?'Online & Offline':m.mode==='online'?'Online':'Offline';
 const introFree=mentorIntroFree(m);
 const availability=introFree?'Mentor baru: sesi gratis untuk membangun rating.':m.free>0?`Tersedia ${m.free} sesi gratis, lalu harga pelajar.`:'Konsultasi dengan harga pelajar.';
 openM(`<div class="booking-dialog card w-full max-w-md"><div class="booking-profile"><div class="booking-avatar mentor-${m.id}">${mentorPhoto(m)||m.n.replace(/^(Kak|Bu|Pak) /,'')[0]}</div><div class="booking-profile-copy"><span class="booking-kicker">Profil Mentor Learnee</span><h3>${m.n}</h3><p>${m.city} <span aria-hidden="true">&middot;</span> ${modeLabel}</p></div><span class="booking-status"><i></i>Mentor tersedia</span></div><div class="booking-details"><div class="booking-detail-label">Mapel dan subtes</div><div class="booking-subjects">${m.sp.map(subject=>`<span>${subject}</span>`).join('')}</div><div class="booking-rating">${rating}</div><div class="booking-price"><div><strong>${free?'Rp 0':rp(m.price)}</strong><span>${free?'Sesi gratis': 'per sesi'} &middot; 45 menit</span></div><small>${availability}</small></div><div class="booking-mode-title">Pilih cara konsultasi</div><div class="booking-online-choice"><span aria-hidden="true">&#10003;</span><b>Konsultasi Online</b><small>45 menit bersama mentor</small></div><p class="booking-note">${availability} Durasi setiap sesi adalah 45 menit.</p><div class="booking-actions"><button class="btn btn-p flex-1" onclick="startS('${m.id}')">Mulai Sesi</button><button class="btn border bd" onclick="closeM()">Batal</button></div></div></div>`,{t:'book'});
}function startS(mid){
 const m=S.mentors.find(x=>x.id===mid),md=(document.querySelector('input[name=md]:checked')||{}).value||m.mode;
 const loc=md==='offline'?($('#loc').value.trim()):'';
 if(md==='offline'&&!loc)return toast('Isi titik temu terlebih dahulu.');
 const s={id:'s'+Date.now(),mid,md,loc,free:mentorCostsFree(m),msgs:[{f:'m',t:'Halo! Silakan ceritakan soal atau materi yang ingin dibahas.'}],st:'active'};
 S.sessions.push(s);save();openChat(s.id);
}
function openChat(id){
 const s=S.sessions.find(x=>x.id===id),m=S.mentors.find(x=>x.id===s.mid),off=isOff();
 openM(`<div class="chat-dialog card w-full max-w-lg flex flex-col"><div class="p-4 border-b bd flex items-center gap-3"><div class="flex-1 min-w-0"><b class="block truncate">${m.n}</b><span class="text-xs mu">${s.md==='online'?'Online · <a class="link-primary underline" href="#" onclick="event.preventDefault();toast(\'Simulasi: tautan video call dibuka\')">Tautan video call</a>':'Offline · '+s.loc} · ${s.free?'Rp 0 (Sesi Gratis)':rp(m.price)}</span></div><button class="btn btn-p" onclick="openRate('${id}')">Akhiri Sesi</button></div>
 <div id="msgs" class="flex-1 overflow-y-auto p-4 grid gap-2 content-start"></div>
 <div class="p-3 border-t bd">${off?'<p class="text-xs text-amber-700 mb-2">Kamu offline: kirim pesan baru dinonaktifkan sementara. Pesan lama tetap terbaca.</p>':''}<div class="flex gap-2"><label class="btn border bd ${off?'opacity-50':''}" title="Unggah foto soal">📎<input type="file" accept="image/*" class="hidden" ${off?'disabled':''} onchange="sendImg('${id}',this)"></label><input id="cin" class="inp" placeholder="Tulis pesan…" ${off?'disabled':''} onkeydown="if(event.key==='Enter')sendMsg('${id}')"><button class="btn btn-p" ${off?'disabled':''} onclick="sendMsg('${id}')">Kirim</button></div></div></div>`,{t:'chat',id});
 drawMsgs(s);
}
function drawMsgs(s){const b=$('#msgs');if(!b)return;b.innerHTML=s.msgs.map(m=>`<div class="chat-message max-w-[80%] p-3 rounded-2xl text-sm ${m.f==='u'?'message-user justify-self-end text-white':'message-mentor border bd'}">${m.img?`<img src="${m.img}" alt="Foto soal" class="rounded-lg max-h-48">`:m.t.replace(/</g,'&lt;')}</div>`).join('');b.scrollTop=b.scrollHeight}
const REP=['Oke, coba tuliskan langkah yang sudah kamu kerjakan.','Bagus! Fokus dulu pada konsep dasarnya, lalu kita hitung bersama.','Kuncinya ada di pola soalnya. Coba identifikasi yang diketahui dan ditanya.'];
function sendMsg(id){if(isOff())return toast('Kamu sedang offline. Pesan baru tidak bisa dikirim.');const i=$('#cin'),t=i.value.trim();if(!t)return;const s=S.sessions.find(x=>x.id===id);s.msgs.push({f:'u',t});i.value='';drawMsgs(s);save();setTimeout(()=>{s.msgs.push({f:'m',t:REP[s.msgs.length%3]});drawMsgs(s);save()},900)}
function sendImg(id,inp){if(isOff())return;const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const s=S.sessions.find(x=>x.id===id);s.msgs.push({f:'u',t:'[foto]',img:r.result});drawMsgs(s);setTimeout(()=>{s.msgs.push({f:'m',t:'Fotonya sudah kuterima. Kita bahas bareng ya!'});drawMsgs(s)},900)};r.readAsDataURL(f)}
let rate=0;
function openRate(id){
 rate=0;openM(`<div class="card p-6 max-w-sm w-full text-center"><h3 class="font-extrabold text-lg">Bagaimana sesimu?</h3><div class="text-3xl my-3" id="st">${[1,2,3,4,5].map(n=>`<button class="rating-star" aria-label="${n} bintang" onclick="setR(${n})">★</button>`).join('')}</div><textarea id="rv" class="inp" rows="3" placeholder="Tulis ulasan singkat…"></textarea><button class="btn btn-p w-full mt-4" onclick="submitR('${id}')">Kirim Ulasan</button></div>`,{t:'rate',id});
}
function setR(n){rate=n;[...$('#st').children].forEach((b,i)=>b.classList.toggle('rating-selected',i<n))}
function submitR(id){
 if(!rate)return toast('Pilih rating 1–5 bintang dulu.');
 const s=S.sessions.find(x=>x.id===id),m=S.mentors.find(x=>x.id===s.mid);
 s.st='done';m.r=(m.r*m.rc+rate)/(m.rc+1);m.rc++;
 S.reviews.push({mid:m.id,s:rate,t:$('#rv').value.trim(),by:'Kamu (Siswa)'});
 if(s.free){m.free=Math.max(0,m.free-1);if(m.demo&&rate>=4)S.T.free=Math.min(3,S.T.free+1)}
 closeM();render();toast('Terima kasih! Rating dan progres sesi gratis mentor diperbarui.');
}

/* ---------- Guru ---------- */
function progress(){const T=S.T,mats=S.materials.filter(x=>x.teacher===T.name&&x.ok).length;return{p:[T.doc==='verified',T.free>=3,mats>=1],pct:Math.round(((T.doc==='verified'?1:0)+Math.min(T.free,3)/3+Math.min(mats,1))/3*100),mats}}
function teacherView(){
 const T=S.T,off=isOff(),g=progress();
 if(!T.reg)return '<section class="py-10 max-w-3xl mx-auto"><div class="flex items-center gap-4">'+lee('hero',100)+'<div><span class="facilities-eyebrow">Ruang Guru</span><h2 class="text-2xl font-extrabold">Ajukan diri jadi pengajar</h2><p class="mu text-sm">Lengkapi identitas dan dokumen. Tim Learnee meninjau sebelum profil dan materi ditampilkan.</p></div></div><div class="card p-5 md:p-7 mt-4"><h3 class="font-bold">Profil pengajar</h3><p class="text-xs mu mt-1">Informasi bertanda * wajib diisi.</p><div class="grid md:grid-cols-2 gap-3 mt-4"><label>Nama lengkap *<input id="tn" class="inp mt-1" placeholder="Nama sesuai identitas"></label><label>Email aktif *<input id="te" class="inp mt-1" type="email" placeholder="nama@email.com"></label><label>Nomor identitas *<input id="ti" class="inp mt-1"></label><label>Unggah identitas *<input id="tif" type="file" accept="image/*,.pdf" class="inp mt-1" '+(off?'disabled':'')+'></label><label class="md:col-span-2">Bidang yang diajarkan *<select id="ts" multiple class="inp mt-1 min-h-28">'+[...SN,...TK].map(x=>'<option>'+escapeHTML(x)+'</option>').join('')+'</select><small>Pilih semua bidang yang dikuasai.</small></label><label>Ijazah / sertifikat *<input id="tqf" type="file" accept="image/*,.pdf" class="inp mt-1" '+(off?'disabled':'')+'></label><label>Jenis kualifikasi<input id="tq" class="inp mt-1" placeholder="Contoh: S1 Pendidikan Matematika"></label><label class="md:col-span-2">Pengalaman mengajar<textarea id="tx" class="inp mt-1" rows="3"></textarea></label></div><button class="btn btn-p mt-4" '+(off?'disabled':'')+' onclick="regT()">Kirim pengajuan untuk verifikasi</button></div></section>';
 const row=(ok,title,sub)=>'<div class="flex gap-3 items-start p-3 rounded-xl border bd"><div class="progress-check '+(ok?'is-complete':'')+' w-6 h-6 rounded-full">'+(ok?'&#10003;':'')+'</div><div><b class="text-sm">'+title+'</b><p class="text-xs mu">'+sub+'</p></div></div>';
 const done=g.pct===100;
 let html='<section class="py-8"><div class="flex items-center gap-4">'+lee(done?'trophy':'hero',110)+'<div><h2 class="text-2xl font-extrabold">Dashboard Mentor</h2><p class="mu">'+escapeHTML(T.name)+' - '+(done?'Verified Mentor':'Mentor dalam proses')+'</p></div></div>';
 if(T.doc==='rejected')html+='<div class="mentor-success card p-4 mt-4">Tim meminta perbaikan dokumen. Hubungi admin untuk memperbarui pengajuan.</div>';
 html+='<div class="card p-5 mt-4"><h3>Profil dan dokumen terkirim</h3><p>'+escapeHTML(T.email)+'</p><p class="text-xs mu">Identitas: '+escapeHTML(T.identityFile||'-')+' | Kualifikasi: '+escapeHTML(T.qualification||'Ijazah/sertifikat')+' ('+escapeHTML(T.qualificationFile||T.file||'-')+')</p><p class="text-xs mu">Pengalaman: '+escapeHTML(T.experience||'Belum dicantumkan')+' | Status: '+(T.doc==='verified'?'Terverifikasi':T.doc==='rejected'?'Perlu perbaikan':'Menunggu verifikasi tim')+'</p></div>';
 if(done)html+='<div class="mentor-success card p-4 mt-4"><b>Semua syarat terpenuhi. Fee bisa diklaim.</b></div>';
 html+='<div class="card p-5 mt-4"><div class="flex justify-between"><b>Progress Unlock Fee</b><b>'+g.pct+'%</b></div><div class="bar"><i id="feeProgress"></i></div><div class="grid gap-2 mt-4">'+row(T.doc==='verified','Dokumen akademik terverifikasi',T.doc==='verified'?'Verified':'Menunggu verifikasi')+row(T.free>=3,'3 sesi gratis',T.free+'/3 selesai')+row(g.mats>=1,'Kirim minimal 1 materi',Math.min(g.mats,1)+'/1')+'</div><div class="flex gap-3 mt-4"><button class="btn btn-p" '+(!done||off||T.claimed?'disabled':'')+' onclick="claim()">'+(T.claimed?'Fee Sudah Diklaim':'Klaim / Tarik Fee')+'</button><span>Saldo: <b>'+rp(T.bal)+'</b></span></div></div>';
 html+='<div class="card p-5 mt-4 teacher-content-manager"><div class="material-manager-heading"><div><span class="snbt-section-kicker">Kelola konten</span><h3>Unggah materi dan soal PDF</h3><p>Unggahan dikirim ke antrean admin. Maksimal 25 MB.</p></div></div><div class="material-upload-form"><label>Judul<input id="teacher-title" class="inp" placeholder="Judul materi atau soal"></label><label>Mapel atau subtes<select id="teacher-subject" class="inp">'+(T.subjects&&T.subjects.length?T.subjects:[...SN,...TK]).map(x=>'<option>'+escapeHTML(x)+'</option>').join('')+'</select></label><label>Jenis konten<select id="teacher-kind" class="inp"><option>Ringkasan materi</option><option>Bank soal</option></select></label><label>Deskripsi<textarea id="teacher-description" class="inp" rows="3"></textarea></label><label class="material-file-field">Pilih PDF<input id="teacher-pdf" class="inp" type="file" accept=".pdf,application/pdf"><small>Maksimal 25 MB.</small></label><button class="btn btn-p" type="button" onclick="addMat()">Unggah untuk ditinjau admin</button></div>';
 const mine=S.materials.filter(x=>x.teacher===T.name).map(x=>materialManageCard(x,false)).join('');
 html+='<div class="material-manage-section"><h3>Materi dan soal saya</h3><p class="mu text-sm">Edit atau hapus unggahan. Perubahan materi tayang perlu ditinjau ulang.</p><div class="material-manage-list">'+(mine||'<p class="mu text-sm">Belum ada materi atau soal yang diunggah.</p>')+'</div></div></div></section>';
 return html;
}function regT(){const n=$('#tn').value.trim(),e=$('#te').value.trim(),id=$('#ti').value.trim(),idf=$('#tif').files[0],qf=$('#tqf').files[0],subjects=[...$('#ts').selectedOptions].map(o=>o.value);if(!n||!e||!id||!idf||!qf||!subjects.length)return toast('Lengkapi identitas, bidang, dan dokumen wajib.');Object.assign(S.T,{reg:true,name:n,email:e,identity:id,identityFile:idf.name,qualification:$('#tq').value.trim(),qualificationFile:qf.name,experience:$('#tx').value.trim(),subjects,file:qf.name,doc:'pending'});render();toast('Pengajuan tersimpan dan menunggu pemeriksaan tim verifikasi.')}
function claim(){if(isOff())return toast('Klaim fee butuh koneksi internet.');S.T.bal=150000;S.T.claimed=true;render();toast('Fee berhasil diklaim. Badge Verified Mentor aktif!')}

/* ---------- Admin ---------- */
function adminView(){
 const T=S.T,all=S.materials,pending=all.filter(x=>!x.ok&&!x.rejected).length,subjects=[...new Set([...SN,...TK])];
 let html='<section class="py-8 admin-dashboard"><div class="admin-welcome"><div><span class="facilities-eyebrow">Learnee Workspace</span><h2 class="text-3xl font-extrabold">Dashboard Admin</h2><p class="mu mt-1">Unggah PDF, moderasi materi, dan kelola konten tanpa mengubah kode.</p></div>'+lee('help',68)+'</div>';
 html+='<div class="admin-stats"><article class="card"><span>Pengajuan guru</span><b>'+(T.reg?1:0)+'</b><small>'+(T.doc==='pending'?'Menunggu verifikasi':'Total pengajar')+'</small></article><article class="card"><span>Antrean review</span><b>'+pending+'</b><small>Materi dan soal PDF</small></article><article class="card"><span>Konten tayang</span><b>'+all.filter(x=>x.ok).length+'</b><small>Tersedia di katalog belajar</small></article><article class="card"><span>Status guru</span><b class="admin-status '+(T.doc==='verified'?'good':'')+'">'+(T.doc==='verified'?'Terverifikasi':T.reg?'Menunggu':'Belum ada')+'</b><small>'+escapeHTML(T.reg?T.name:'Pengajuan baru muncul di sini')+'</small></article></div>';
 html+='<div class="admin-columns"><div class="card p-5"><div class="flex justify-between items-center gap-2"><div><h3 class="font-bold">Verifikasi pengajar</h3><p class="text-xs mu mt-1">Periksa identitas dan kualifikasi pengajar.</p></div><span class="admin-count">'+(T.reg&&T.doc==='pending'?1:0)+' baru</span></div>';
 if(T.reg){html+='<article class="admin-review mt-4"><div class="admin-person"><span class="admin-avatar">'+escapeHTML(T.name.charAt(0).toUpperCase())+'</span><div><b>'+escapeHTML(T.name)+'</b><p class="text-xs mu">'+escapeHTML(T.email)+' ? '+escapeHTML(T.subjects?.join(', ')||'Bidang belum diisi')+'</p></div><span class="admin-pill '+T.doc+'">'+(T.doc==='verified'?'Terverifikasi':T.doc==='rejected'?'Perlu perbaikan':'Menunggu')+'</span></div><div class="admin-doc-grid"><div><small>Identitas</small><b>'+escapeHTML(T.identity||'Belum tersedia')+'</b><span>'+escapeHTML(T.identityFile||'Belum tersedia')+'</span></div><div><small>Ijazah / sertifikat</small><b>'+escapeHTML(T.qualification||'Belum dicantumkan')+'</b><span>'+escapeHTML(T.qualificationFile||T.file||'Belum tersedia')+'</span></div></div><div class="admin-experience"><small>Pengalaman mengajar</small><p>'+escapeHTML(T.experience||'Belum dicantumkan')+'</p></div>';
 if(T.doc==='pending')html+='<div class="flex flex-wrap gap-2 mt-4"><button class="btn btn-p" onclick="verifyTeacher()">Verifikasi pengajar</button><button class="btn btn-o" onclick="adminRejectTeacher()">Minta perbaikan</button></div>';
 html+='</article>'}else html+='<p class="mu text-sm mt-5">Belum ada pengajuan guru.</p>';
 html+='</div><div class="card p-5 admin-pdf-upload"><div class="material-manager-heading"><div><span class="snbt-section-kicker">Upload admin</span><h3>Tambah materi atau soal PDF</h3><p>Unggahan admin langsung tayang setelah disimpan.</p></div></div><div class="material-upload-form"><label>Judul<input id="admin-title" class="inp" placeholder="Nama materi atau paket soal"></label><label>Mapel atau subtes<select id="admin-subject" class="inp">'+subjects.map(s=>'<option>'+escapeHTML(s)+'</option>').join('')+'</select></label><label>Jenis konten<select id="admin-kind" class="inp"><option>Ringkasan materi</option><option>Bank soal</option></select></label><label>Deskripsi<textarea id="admin-description" class="inp" rows="3" placeholder="Deskripsi singkat (opsional)"></textarea></label><label class="material-file-field">Pilih file PDF<input id="admin-pdf" class="inp" type="file" accept=".pdf,application/pdf"><small>PDF maksimal 25 MB.</small></label><button class="btn btn-p" type="button" onclick="addAdminMat()">Simpan dan tayangkan</button></div></div></div>';
 html+='<div class="card p-5 mt-4"><div class="material-manager-heading"><div><span class="snbt-section-kicker">CRUD konten</span><h3>Semua materi dan soal</h3><p>Edit, tayangkan/tarik, atau hapus PDF dari katalog.</p></div><span class="admin-count">'+all.length+' konten</span></div><div class="material-manage-list">'+(all.map(x=>materialManageCard(x,true)).join('')||'<p class="mu text-sm">Belum ada unggahan. Gunakan formulir di atas untuk menambahkan PDF.</p>')+'</div></div></section>';
 return html;
}
function verifyTeacher(){S.T.doc='verified';save();render();toast('Profil pengajar terverifikasi.')}function adminRejectTeacher(){S.T.doc='rejected';save();render();toast('Pengajuan ditandai perlu perbaikan')}document.documentElement.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.modal&&S.modal.t!=='rate')closeM()});
/* Static page controls */
document.querySelector('[data-action="home"]')?.addEventListener('click',()=>go('student'));
document.querySelector('[data-action="start-learning"]')?.addEventListener('click',()=>go('student','sesi'));

$('#role')?.addEventListener('change',e=>go(e.currentTarget.value));
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'&&S.modal&&S.modal.t!=='rate')closeM()});
try{navigator.serviceWorker&&navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}
render();
