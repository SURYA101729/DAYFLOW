const { Client } = require('pg');

async function checkDatabase() {
    console.log("Checking connection to PostgreSQL...");
    
    // Connect to the default 'postgres' database first to check if server is up
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'admin@123',
        port: 5432,
    });

    try {
        await client.connect();
        console.log("✅ Successfully connected to PostgreSQL server on localhost:5432");

        // Check if dayflow_db exists
        const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'dayflow_db'");
        if (res.rows.length === 0) {
            console.log("⚠️ Database 'dayflow_db' does not exist. Attempting to create it...");
            await client.query("CREATE DATABASE dayflow_db");
            console.log("✅ Database 'dayflow_db' created successfully.");
        } else {
            console.log("✅ Database 'dayflow_db' already exists.");
        }
        
    } catch (err) {
        console.error("❌ Failed to connect or execute query:");
        console.error(err.message);
    } finally {
        await client.end();
    }
}

checkDatabase();
