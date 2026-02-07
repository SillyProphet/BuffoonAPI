require('dotenv').config();
const express = require('express');
const app = express();

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;
const pool = require('./dbpool');
const upload = require('./upload');
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

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(APIKeyCheck);
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log('Server active on port ' + PORT);
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
    const Image = req.file.path;
    const Username = req.body.username;
    const Posts = req.body.post;

    try {
        await pool.query('insert into islands (username, post, imageurl) values (?, ?, ?)', 
        [Username, Posts, Image]);
        res.send('Upload Completed')
    } 
    catch (err) {
        console.log(err);
        res.status(500).send('Failed to upload Island!')
    }
})

app.get('/api/ocean', async (req, res) => {
    const Sort = req.query.sort;

    if(Sort == "oldest") {
        try {
            const Page = req.query.page * 10 - 11 + 1 || 0;
            const [rows] = await pool.query('SELECT * FROM islands WHERE id > ' + Page + " LIMIT 10");
            res.json(rows);
        } 
        catch (err) {
            console.error(err);
            res.status(500).send('Failed to fetch islands');
        }
    } 
    else if(Sort == "newest") {
        try {
            const Page = (req.query.page - 1) * 10;
            const [rows] = await pool.query('SELECT * FROM islands ORDER BY id DESC LIMIT 10 OFFSET ' + Page);
            res.json(rows);
        } 
        catch (err) {
            console.error(err);
            res.status(500).send('Failed to fetch islands');
        }
    } 
    else {
        res.status(500).send('Failed to fetch islands');
    }

});