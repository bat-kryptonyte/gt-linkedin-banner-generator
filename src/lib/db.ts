import sqlite3 from 'sqlite3';

const db = new (sqlite3.verbose().Database)('./downloads.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS download_count (count INT)');
});

export default db;
