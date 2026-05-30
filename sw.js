const CACHE='fccprep-v2';
const ASSETS=['./','./index.html','./study.html','./manifest.webmanifest','./js/app_v10.js','./js/questionLoader.js','./css/style.css','./data/manifest.json','./data/element1.json','./data/element3.json','./data/element8.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});