const { Pool } = require('pg');
require('dotenv').config();

const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/**
 * Converts MySQL-style ? placeholders to PostgreSQL $1, $2, ...
 */
function convertPlaceholders(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

/**
 * Temporary compatibility wrapper.
 * This allows existing code such as:
 * const [rows] = await pool.query(...)
 * to continue working while we migrate the routes.
 */
const pool = {
  async query(sql, params = []) {
    const convertedSql = convertPlaceholders(sql);
    const result = await pgPool.query(convertedSql, params);

    if (/^\s*select/i.test(convertedSql)) {
      return [result.rows, result.fields];
    }

    return [
      {
        affectedRows: result.rowCount,
        rows: result.rows,
      },
      result.fields,
    ];
  },

  async getConnection() {
    const client = await pgPool.connect();

    return {
      query: async (sql, params = []) => {
        const result = await client.query(
          convertPlaceholders(sql),
          params
        );

        return [result.rows, result.fields];
      },

      release: () => client.release(),
    };
  },
};

async function testConnection() {
  let client;

  try {
    client = await pgPool.connect();

    const result = await client.query(
      'SELECT NOW() AS current_time'
    );

    console.log(
      '[DB] PostgreSQL connected successfully:',
      result.rows[0].current_time
    );
  } catch (err) {
    console.error(
      '[DB] PostgreSQL connection failed:',
      err.message
    );

    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
  }
}
module.exports = { pool, testConnection, pgPool };