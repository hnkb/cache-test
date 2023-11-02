
const CACHE_NAME = 'v2';


async function readCache()
{
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.keys();
    document.getElementById('cache-summary').innerHTML = `${cached.length} items already in cache.`;

    const list = document.getElementById('cache-list');
    list.innerHTML = '';
    for (const key of cached) {
        const item = document.createElement('li');
        item.innerHTML = key.url.normalize();
        item.onclick = itemClick;
        list.appendChild(item)
    }
}

async function queryFromCache(q) {
    document.querySelector('#selected .url').innerHTML = q;

    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(q);

    document.querySelector('#selected .status').innerHTML = match ? 'found' : 'not found';
    document.querySelector('#selected img').src = match ? URL.createObjectURL(await match.blob()) : '';
}

async function addToCache(key, url) {
    const responseFromNetwork = await fetch(url);

    const cache = await caches.open(CACHE_NAME);
    await cache.put(key, responseFromNetwork);

    await readCache();
    await queryFromCache(key);
}



async function itemClick(e) {
    const url = new URL(e.target.innerHTML);
    queryFromCache(url.pathname);
}

document.getElementById('query').addEventListener('keydown', async e => {
    if (e.code == 'Enter')
        await queryFromCache(e.target.value);
});

document.getElementById('add').addEventListener('submit', async e => {
    const key = document.querySelector('#add .key').value;
    const url = document.querySelector('#add .url').value;
    e.preventDefault();

    await addToCache(key, url);
});

readCache();
