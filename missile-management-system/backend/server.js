const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection details
const dbConfig = {
    host: 'localhost',
    user: 'admin',
    password: 'admin1234',
    database: 'missile_db'
};

// Database connection
let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
            setTimeout(handleDisconnect, 2000); // Try to reconnect every 2 seconds
        } else {
            console.log('Connected to the MySQL database.');
            initializeDatabase();
        }
    });

    db.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

// Initialize database
function initializeDatabase() {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS MISSILE (
        missile_id INT AUTO_INCREMENT PRIMARY KEY,
        missile_name VARCHAR(255) NOT NULL,
        missile_type VARCHAR(255) NOT NULL,
        manufacturer VARCHAR(255) NOT NULL,
        manufacture_date VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL
    )`;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('MISSILE table ready.');
        }
    });
}

// Routes (CRUD)

// Create
app.post('/api/missiles', (req, res) => {
    const { missile_name, missile_type, manufacturer, manufacture_date, status } = req.body;
    const sql = `INSERT INTO MISSILE (missile_name, missile_type, manufacturer, manufacture_date, status) VALUES (?, ?, ?, ?, ?)`;
    const params = [missile_name, missile_type, manufacturer, manufacture_date, status];
    
    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ missile_id: results.insertId });
    });
});

// Read all
app.get('/api/missiles', (req, res) => {
    const sql = "SELECT * FROM MISSILE";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(results);
    });
});

// Read one
app.get('/api/missiles/:id', (req, res) => {
    const sql = "SELECT * FROM MISSILE WHERE missile_id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(results[0]);
    });
});

// Update
app.put('/api/missiles/:id', (req, res) => {
    const { missile_name, missile_type, manufacturer, manufacture_date, status } = req.body;
    const sql = `UPDATE MISSILE SET missile_name = ?, missile_type = ?, manufacturer = ?, manufacture_date = ?, status = ? WHERE missile_id = ?`;
    const params = [missile_name, missile_type, manufacturer, manufacture_date, status, req.params.id];
    
    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Missile updated successfully', changes: results.affectedRows });
    });
});

// Delete
app.delete('/api/missiles/:id', (req, res) => {
    const sql = "DELETE FROM MISSILE WHERE missile_id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Missile deleted successfully', changes: results.affectedRows });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
