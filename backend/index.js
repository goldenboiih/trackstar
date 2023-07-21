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

app.get('/', (req, res) => {
    // Retrieve column queries from the database
    pool.query('SELECT * FROM queries WHERE answered = false', (error, result) => {
        if (error) {
            console.error('Error retrieving data', error);
            res.sendStatus(500);
        } else {
            const queries = result.rows;
            res.render(path.join(__dirname, 'index.ejs'), {queries});
        }
    });
});

// Endpoint to handle button clicks
app.post('/send-answer', async (req, res) => {
    try {
        // Destructuring request body
        const {id, answer} = req.body;
        await pool.query('UPDATE queries SET answer = ($1), answered = true WHERE id = ($2)', [answer, id]);

        res.status(200).json({message: 'Answer saved succesfully'});
    } catch (error) {
        console.error('Error inserting button content:', error);
        res.status(500).json({error: 'An error occurred while writing into db'});
    }
});

app.get('/get-queries', async (req, res) => {
    await pool.query('SELECT * FROM queries WHERE answered = false', (err, result) => {
        if (err) {
            console.error('Fehler bei der Abfrage:', err);
            res.json({success: false, error: err});
        } else {
            console.log('Ergebnis:', result.rows);
            res.json({success: true, queries: result.rows});
        }
    });
});

app.post('/notify', async (req, res) => {
    const {token, id} = req.body;
    console.log(req.body)
    console.log('/notify', token, id)
    const query = (await pool.query('SELECT * FROM queries WHERE id = ($1)', [id])).rows[0];
    console.log(query)
    try {
        await sendPushQuery(token, query)
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
                res.sendStatus(200);
            }
        });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
