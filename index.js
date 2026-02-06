require('dotenv').config();
const express = require('express');
const app = express();

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;
const pool = require('./dbpool');
const bodyParser = require('body-parser');

function APIKeyCheck(req, res, next) {
    const apiKey = req.headers['api-key'];
    if (apiKey == API_KEY) {
        next();
    }   
    else {
        res.status(403).send('Invalid API Key');
    }
}

app.use(bodyParser.json());
app.use(APIKeyCheck);

app.get('/', (req, res) => {
    res.send("Congrats you are in!");
});

app.listen(PORT, () => {
    console.log('Server active on port ' + PORT);
});

app.get('/api/ocean', async (req, res) => {
    const Page = req.query.page * 10 - 11 + 1 || 0;
    try {
        const [rows] = await pool.query('SELECT * FROM islands where id > ' + Page + " limit 10");
        res.json(rows);
    } catch (err) {
        console.error('User fetch failed: ', err);
        res.status(500).send('Failed to fetch users');
    }
});