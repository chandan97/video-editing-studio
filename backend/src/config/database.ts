import { Pool } from 'pg';

// Docker-compose me humne yahi URL set kiya tha
const connectionString = process.env.DATABASE_URL || 'postgres://admin:adminpassword@postgres:5432/videodb';

export const pool = new Pool({
  connectionString,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Database Connected Successfully!');
    client.release();
  } catch (err) {
    console.error('❌ Database Connection Error:', err);
    process.exit(1);
  }
};