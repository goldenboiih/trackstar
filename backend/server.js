const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

// Create a PostgreSQL connection pool
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin',
    database: 'db',
});

// Endpoint to handle button clicks
app.post('/send-answer', async (req, res) => {
    try {
        // Destructuring request body
        const { id, answer } = req.body;
        await pool.query('UPDATE queries SET answer = ($1), answered = true WHERE id = ($2)', [answer, id]);

        res.status(200).json({ message: 'Answer saved succesfully' });
    } catch (error) {
        console.error('Error inserting button content:', error);
        res.status(500).json({ error: 'An error occurred while writing into db' });
    }
});

app.get('/queries', async (req, res) => {
    await pool.query('SELECT * FROM queries WHERE answered = false', (err, result) => {
        if (err) {
            console.error('Fehler bei der Abfrage:', err);
            res.json({ success: false, error: err });
        } else {
            console.log('Ergebnis:', result.rows);
            res.json({ success: true, queries: result.rows });
        }
    });
});

app.get('/test', async (req, res) => {
    res.json({ success: true, status: "ok" });
});

app.get('/data', (req, res) => {
    const data = ['Apple', 'Banana', 'Orange'];
    res.json(data);
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

pool.query('SELECT * FROM queries WHERE answered = false', (err, res) => {
    if (err) {
        console.error('Fehler bei der Abfrage:', err);
    } else {
        console.log('Ergebnis:', res.rows);
        return res.rows;
    }
});
