const CACHE='smartfield360-v10';
const ASSETS=['./','./index.html','./en.html','./ar.html','./manifest.json','./client-config.js','./icons/icon.svg'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(req,copy));
        return r;
      }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});