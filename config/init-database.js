const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    // Create connection without database
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password"
    });

    try {
        // Create database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS fundraising_platform');
        await connection.query('USE fundraising_platform');

        // Read and execute schema file
        const schema = fs.readFileSync(path.join(__dirname, '../database-setup.sql'), 'utf8');
        const statements = schema.split(';').filter(statement => statement.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await connection.end();
    }
}

initializeDatabase(); 