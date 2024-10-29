const { Pool } = require('pg');

/* const pool = new Pool({
  user: 'trave',
  host: '45.183.140.104',
  database: 'whatrave',
  password: 'Travejsj@2024',
  port: 5432,
}); */

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'whatrave_local',
  password: 'Admin1post+',
  port: 5432,
});

module.exports = pool;