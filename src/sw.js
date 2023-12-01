const CACHE_NAME = 'kopilka-cache'
// const CACHE_PATHS = [
//     '/index_bundle.js',
// ];
//
//
// self.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(function(cache) {
//             return cache.addAll(CACHE_PATHS);
//         })
//     );
// });
//
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             if (response) {
//                 return response;
//             }
//             return fetch(event.request).then(function(response) {
//                 const responseClone = response.clone();
//
//                 caches.open(CACHE_NAME).then(function(cache) {
//                     cache.put(event.request, responseClone);
//                 });
//
//                 return response;
//             });
//         }).catch(function() {
//             return new Response('Page not available offline', {
//                 status: 521,
//                 statusText: 'Page not available offline'
//             });
//         })
//     );
// });
