const CACHE_NAME = 'vkontent_cache';
const CACHE_PATHS = [
  '/',
  '/index.js',
  '/index.html',
  '/components/Login/login.js',
  '/components/Login/login.css',
  '/components/Login/login-prec.js',
  '/components/Login/login.handlebars',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_PATHS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Возвращаем копию из кэша, если нашли
      if (response) {
        return response;
      }

      // В противном случае делаем запрос в сеть
      return fetch(event.request).then(function(response) {
        // Клонируем ответ, чтобы сохранить его в кэше
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      });
    }).catch(function() {
      // Обработка ошибок, если запрос в сеть не удалось выполнить и в кэше нет соответствующего ответа
      // Здесь вы можете вернуть стандартную страницу для отсутствия интернета, если нужно
      return new Response('Page not available offline', {
        status: 200,
        statusText: 'Page not available offline'
      });
    })
  );
});

/*

const CACHE_NAME = 'vkontent_cache';
const CACHE_PATHS = [
    '/',
    '/index.js',
    '/index.html',
    '/components/Login/login.js',
    '/components/Login/login.css',
    '/components/Login/login-prec.js',
    '/components/Login/login.handlebars',
    '/configs/link_config.js',
    '/configs/rest_config.js',
    '/modules/api.js',
    '/modules/router.js',
    '/modules/requests.js',
];


* Добавление файлов в кэш
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_PATHS);
    })
  );
});

this.addEventListener('fetch', (event) =>{

});

this.addEventListener('activate', event => {
  // Do activate stuff: This will come later on.
});

*/