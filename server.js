
import Express from 'express';


const app = Express();

app.disable('x-powered-by')
app.use(Express.static('client'));

app.get('*', (req, res) => { res.status(404); });


const port = 5667;
app.listen(port, () => console.log(`Listening on port ${port}...`));
