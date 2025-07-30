const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dbDir, 'profiles.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database tables synchronously
function initializeTables() {
  return new Promise((resolve, reject) => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Users table ready');

      // Profiles table
      db.run(`
        CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT,
          bio TEXT,
          location TEXT,
          interests TEXT,
          skills TEXT,
          experience TEXT,
          education TEXT,
          social_links TEXT,
          projects TEXT,
          profile_picture TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating profiles table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Profiles table ready');

        // Create indexes for better performance
        db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)', (err) => {
          if (err) console.error('Error creating username index:', err.message);
        });
        
        db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (err) => {
          if (err) console.error('Error creating email index:', err.message);
        });
        
        db.run('CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id)', (err) => {
          if (err) {
            console.error('Error creating user_id index:', err.message);
          } else {
            console.log('✅ Database indexes ready');
            resolve();
          }
        });
      });
    });
  });
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get multiple rows
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  runQuery,
  getRow,
  getAll,
  initializeTables
}; 