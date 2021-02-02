const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: {
    connectString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}`);
});
