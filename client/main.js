
const count = 300;

performance.setResourceTimingBufferSize(count + 100);


const container = document.querySelector('.gallery');
const promises = [];

for (var i = 0; i < count; i++) {
	const img = document.createElement('img');
	img.src = 'img.jpg';
	container.appendChild(img);

	promises.push(new Promise(resolve => img.onload = () => resolve()));
}

await Promise.all(promises);


const images = performance.getEntriesByType('resource').filter(r => r.initiatorType == 'img');

const totalSize = images.reduce((sum, r) => sum += r.transferSize, 0);
const totalDuration = images.reduce((sum, r) => sum += r.duration, 0);
const toMegabytes = size => Math.round(10 * size / 1024 / 1024) / 10;

document.querySelector('.img-count').innerHTML = images.length;
document.querySelector('.img-duration').innerHTML = Math.round(10 * totalDuration) / 10 + ' ms';
document.querySelector('.img-size').innerHTML =
	`<strong>${toMegabytes(totalSize)} MB</strong>
      (from a total of <strong>${toMegabytes(1171927 * images.length)} MB</strong>)`;

console.log(images);
