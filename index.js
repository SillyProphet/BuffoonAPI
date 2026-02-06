require('dotenv').config();
const express = require('express');
const app = express();

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

function APIKeyCheck(req, res, next) {
    const apiKey = req.headers['api-key'];
    if (apiKey == API_KEY) {
        next();
    }   
    else {
        res.status(403).send('Invalid API Key');
    }
}

app.use(APIKeyCheck);

app.get('/', (req, res) => {
    res.send("Congrats you are in!");
});

app.listen(PORT, () => {
    console.log('Server active on port ' + PORT);
});