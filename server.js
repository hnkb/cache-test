
import Express from 'express';
import { fileURLToPath } from 'url';


const app = Express();

app.disable('x-powered-by')
app.use(Express.static('client'));

app.get('/img/:id', (req, res) => {
	res.header('Cache-Control', 'public, max-age=31560000, immutable');
	res.sendFile(fileURLToPath(new URL('./client/img.jpg', import.meta.url)));
});

app.get('*', (req, res) => { res.status(404); });


const port = 5667;
app.listen(port, () => console.log(`Listening on port ${port}...`));
