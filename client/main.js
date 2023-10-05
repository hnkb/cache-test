
{
	const cached = await(await caches.open('v1')).keys();
	console.log(`${cached.length} items already in cache.`, cached.map(r => new URL(r.url).pathname));
}


async function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		try {
			const reg = await navigator.serviceWorker.register('/svcWorker.js', {
				scope: '/',
				type: 'module',
			});

			if (reg.installing) {
				console.log('Service worker installing');
			} else if (reg.waiting) {
				console.log('Service worker installed');
			} else if (reg.active) {
				console.log('Service worker active');
			}
		} catch (error) {
			console.error(`Service Worker registration failed with ${error}`);
		}
	}
	else {
		console.error('Service Worker is not supported on this browser.');
	}
}

registerServiceWorker();

///////////////



const count = (new URL(location.href).searchParams.get('count')) || 300;

const start = performance.now();
performance.setResourceTimingBufferSize(count + 100);


const container = document.querySelector('.gallery');
const promises = [];

for (var i = 0; i < count; i++) {
	const img = document.createElement('img');
	img.src = `/img/${i}`;
	container.appendChild(img);

	promises.push(new Promise(resolve => img.onload = () => resolve()));
}

await Promise.all(promises);


const images = performance.getEntriesByType('resource').filter(r => r.initiatorType == 'img');

const totalSize = images.reduce((sum, r) => sum += r.transferSize, 0);
const totalDuration = images.reduce((sum, r) => sum += r.duration, 0);
const toMegabytes = size => Math.round(10 * size / 1024 / 1024) / 10;

document.querySelector('.img-count').innerHTML = images.length;
document.querySelector('.img-duration').innerHTML = Math.round(performance.now() - start) + ' ms';
document.querySelector('.img-size').innerHTML =
	`transferred <strong>${toMegabytes(totalSize)} MB</strong>
      from a total of <strong>${toMegabytes(1171927 * count)} MB</strong>`;

console.log(images);
