const CACHE='fccprep-v3';
const ASSETS=['./','./index.html','./study.html','./manifest.webmanifest','./js/app_v10.js','./js/questionLoader.js','./css/style.css','./data/manifest.json','./data/element1.json','./data/element3.json','./data/element8.json'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const clone=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,clone));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
