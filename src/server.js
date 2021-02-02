const app = require('./app');
const pg = (require('pg').defaults.ssl = 'require';
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}`);
});
