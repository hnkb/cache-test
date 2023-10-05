
const putInCache = async (request, response) => {
	const cache = await caches.open('v1');
	await cache.put(request, response);
};

const cacheFirst = async (request) => {
	const responseFromCache = await caches.match(request);
	if (responseFromCache) {
		return responseFromCache;
	}
	const responseFromNetwork = await fetch(request);
	putInCache(request, responseFromNetwork.clone());
	return responseFromNetwork;
};


self.addEventListener('install', ev => {
	self.skipWaiting();
	console.log('Install handler', ev);
});

self.addEventListener('activate', ev => {
	ev.waitUntil(clients.claim());
	console.log('Activate handler claiming all clients', ev);
});

self.addEventListener('fetch', ev => {
	const url = new URL(ev.request.url);
	const shouldUseCache = url.pathname.startsWith('/img/') || url.hostname == 'hnkb.de';

	if (shouldUseCache) {
		console.log(`Fetch event handler ${url}`);
		ev.respondWith(cacheFirst(ev.request));
	}
});
