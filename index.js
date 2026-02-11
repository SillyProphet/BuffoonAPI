// Variables and Dependencies.
require('dotenv').config(); // Dont forget to have a ".env".
const express = require('express'); // API Dependency
const app = express(); // API Dependency
const API_KEY = process.env.API_KEY; // Set an API key in ".env".
const PORT = process.env.PORT; // Set a Port in ".env".
const pool = require('./dbpool'); // Uses "dbpool.js".
const upload = require('./upload'); // Uses "upload.js".
const bodyParser = require('body-parser'); // More stuff to make the API work.

// Runs before anything to make sure user has correct API key.
function APIKeyCheck(req, res, next) {
    const apiKey = req.headers['api-key'];
    if (apiKey == API_KEY) { // Checks provided API Key against the one set in the server ".env".
        next();
    }   
    else {
        res.status(403).send('Invalid API Key');
    }
}

// API Middleware
app.use(APIKeyCheck); // So the API uses the API Key Checker.
app.use(bodyParser.json()); // Handle JSON in API.
app.use("/uploads", express.static("uploads")); // Use directory of image as link.
app.use(express.urlencoded({ extended: true })); // Makes it so images can be uploaded.

// Starts API on chosen port.
app.listen(PORT, () => {
    console.log('Server active on port ' + PORT);
});

// Handles submission for users island.
app.post('/api/upload', upload.single('image'), async (req, res) => {
    // Data submitted by user.
    const Image = "uploads/" + req.file.filename; // File path for users image.
    const Username = req.body.username;
    const Posts = req.body.post;

    // Attempts to make new entry in database for data.
    try {
        await pool.query('insert into islands (username, post, imageurl) values (?, ?, ?)', 
        [Username, Posts, Image]);
        res.send('Upload Completed');
    } 
    catch (err) {
        console.log(err);
        res.status(500).send('Failed to upload Island!');
    }
})

// Game engine will be using this to sort and create pages for islands.
app.get('/api/ocean', async (req, res) => {
    const Sort = req.query.sort;

    // Attempts to sort islands from oldest -> newest.
    if(Sort == "oldest") {
        try {
            const Page = req.query.page * 10 - 11 + 1 || 0; // Allows for paging up.
            const [rows] = await pool.query('SELECT * FROM islands WHERE id > ' + Page + " LIMIT 10");
            res.json(rows);
        } 
        catch (err) {
            console.error(err);
            res.status(500).send('Failed to fetch islands');
        }
    }
    // Attempts to sort islands from newest -> oldest. 
    else if(Sort == "newest") {
        try {
            const Page = (req.query.page - 1) * 10; // Pagination using an offset.
            const [rows] = await pool.query('SELECT * FROM islands ORDER BY id DESC LIMIT 10 OFFSET ' + Page);
            res.json(rows);
        } 
        catch (err) {
            console.error(err);
            res.status(500).send('Failed to fetch islands');
        }
    }
    // If NO valid sorting parameter is passed. 
    else {
        res.status(500).send('Failed to fetch islands');
    }

});

// Gets number of available pages
app.get('/api/maxpages', async (req, res) => {
    try {
        const [Pages] = await pool.query('SELECT COUNT(*) AS total FROM islands');
        const PageCnt = Math.ceil((Pages[0].total) / 10); // Uses rounding and division to find page amount.
        res.send(PageCnt);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to get max pages');
    }
})

// Completely wipes ALL island data in your database.
app.get('/api/self-destruct', async (req, res) => {
    try {
        await pool.query('TRUNCATE TABLE islands'); // Tells MySQL to clear Table.
        res.send('Island data has been cleared.')
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to wipe island data!');
    }
})