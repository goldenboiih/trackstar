const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
const path = require('path');
const ejs = require('ejs');
const { sendPushQuery }  = require("./notification-handler");

const app = express();
app.use(cors());
app.use(express.json())
// Set up a route to handle POST requests
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// Create a PostgreSQL connection pool
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin',
    database: 'db',
});

app.get('/', async (req, res) => {
    try {
        // Retrieve column queries from the database
        const queriesResult = await pool.query('SELECT * FROM queries ORDER BY id');
        const queries = queriesResult.rows;

        const usersResult = await pool.query('SELECT * FROM users ORDER BY id');
        const users = usersResult.rows;

        res.render(path.join(__dirname, 'index.ejs'), { queries, users });
    } catch (error) {
        console.error('Error retrieving data', error);
        res.sendStatus(500);
    }
});

// Endpoint to handle button clicks
app.post('/send-answer', async (req, res) => {
    try {
        // Destructuring request body
        const {id, token, answer} = req.body;
        console.log(req.body)
        console.log('Received answer:', id, token, answer);
        // get today's date
        const date = new Date();
        // Insert answer into database
        const user_id = (await pool.query('SELECT id FROM users WHERE expo_token = ($1)', [token])).rows[0].id;
        await pool.query('INSERT INTO answers (query_id, user_id, answer, date) VALUES ($1, $2, $3, $4)', [id, user_id, answer, date]);
        res.status(200).json({message: 'Answer saved succesfully'});
        console.log('Answer saved succesfully')
    } catch (error) {
        console.error('Error inserting answer: ', error);
        res.status(500).json({error: 'An error occurred while writing into db'});
    }
});

app.get('/get-queries', async (req, res) => {
    await pool.query('SELECT * FROM queries', (err, result) => {
        if (err) {
            console.error('Error getting queries:', err);
            res.json({success: false, error: err});
        } else {
            res.json({success: true, queries: result.rows});
        }
    });
});

app.post('/notify', async (req, res) => {
    const {token, id} = req.body;
    if (!token || !id) return res.status(400).json({error: 'Missing parameters. You need to specify at least one token and a query id'});
    // console.log(req.body)
    // console.log('/notify', token, id)
    const query = (await pool.query('SELECT * FROM queries WHERE id = ($1)', [id])).rows[0];
    // console.log(query)
    try {
        // if multiple tokens are selected
        if (Array.isArray(token)) {
            for (let i = 0; i < token.length; i++) {
                await sendPushQuery(token[i], query)
            }
        }
        else await sendPushQuery(token, query)
    } catch (error) {
        console.error('Error sending push notification', error);
        res.status(500).json({error: 'An error occurred sending notification'});
    }
});


app.post('/add-query', async (req, res) => {
    const {query} = req.body;

    // Insert the data into the database
    await pool.query('INSERT INTO queries (question) VALUES ($1)',
        [query], (error, result) => {
            if (error) {
                console.error('Error inserting data', error);
                res.sendStatus(500);
            } else {
                res.redirect('/');
            }
        });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
