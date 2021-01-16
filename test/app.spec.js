const app = require('../src/app');

describe('App', () => {
  it('GET / should return 200', () => {
    return supertest(app).get('/').expect(200);
  });
});
