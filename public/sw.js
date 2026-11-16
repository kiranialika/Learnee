const C='learnee-v27';
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./style.css','./script.js','./assets/maskot-bandeng.png?v=2','./assets/maskot-bandeng-standing.png?v=1','./assets/kak-denny-papan.png','./assets/kak-denny-nunjuk-kiri.png','./assets/kak%20dimas.jpg']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
