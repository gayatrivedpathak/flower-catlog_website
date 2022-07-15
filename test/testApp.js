const request = require('supertest');
const { createApp } = require('../src/app');

const config = {
  serveFrom: './public',
  dataPath: './test/testData.json',
  guestBookTemplatePath: 'resources/guest-book.html'
};

describe('GET /wrongUrl', () => {
  it('Should give the 404 for wrong url', (done) => {
    const sessions = {};
    const users = [];
    request(createApp(config, users, sessions))
      .get('/wrongUrl')
      .expect(/html/)
      .expect(404, done);
  });
});

describe('GET /', () => {
  it('Should serve index.html from public directory', (done) => {
    const sessions = {};
    const users = [];
    request(createApp(config, users, sessions))
      .get('/')
      .expect('Content-type', 'text/html; charset=UTF-8')
      .expect(/html/)
      .expect(200, done);
  });
});

describe('GET /guest-book', () => {
  it('Should redirect to the login page if cookie is not set', (done) => {
    const sessions = {};
    const users = [];
    request(createApp(config, users, sessions))
      .get('/guest-book')
      .expect('location', '/login')
      .expect(302, done);
  });

  it('Should serve the guest book if cookie is set', (done) => {
    const sessions = {
      '123': { id: '123', username: 'gayatri', password: 'a' }
    };
    const users = [
      { username: 'gayatri', password: '123' }
    ];

    request(createApp(config, users, sessions))
      .get('/guest-book')
      .set('cookie', 'id=123')
      .expect('Content-type', 'text/html')
      .expect('content-length', /\d+/)
      .expect(200, done);
  });
});

describe('POST /guest-book/add-comment', () => {
  let myApp;

  beforeEach(() => {
    const sessions = {
      '123': { id: '123', username: 'gayatri', password: '123' }
    };
    const users = [
      { username: 'gayatri', password: '123' }
    ];
    myApp = createApp(config, users, sessions);
  });

  it('Should add comment and give 201 status code', (done) => {
    request(myApp)
      .post('/guest-book/add-comment')
      .set('cookie', 'id=123')
      .send('comment=hello')
      .expect('Content-type', 'text/plain')
      .expect('Comment saved')
      .expect(201, done);
  });

  it('Should get 400 status code if comment is empty', (done) => {
    request(myApp)
      .post('/guest-book/add-comment')
      .set('cookie', 'id=123')
      .send('comment=')
      .expect(400, done);
  });
});

describe('POST /login', () => {
  let myApp;
  beforeEach(() => {
    const sessions = {
      '123': { id: '123', username: 'gayatri', password: 'a' }
    };
    const users = [
      { username: 'gayatri', password: 'a' }
    ];
    myApp = createApp(config, users, sessions);
  });

  it('Should redirect to the guest-book for successful login', (done) => {
    request(myApp)
      .post('/login')
      .set('cookie', 'id=123')
      .send('username=gayatri&password=a')
      .expect(302, done);
  });

  it('Should give 401 for the invalid login credentials', (done) => {
    request(myApp)
      .post('/login')
      .set('cookie', 'id=123')
      .send('username=gayatri&password=123')
      .expect(401, done);
  });
});

describe('GET /login', () => {
  it('Should give the login page', (done) => {
    const sessions = {};
    const users = [];

    request(createApp(config, users, sessions))
      .get('/login')
      .expect('content-type', 'text/html')
      .expect(200, done);
  });
});

describe('GET /signup', () => {
  it('Should give the signup page', (done) => {
    const sessions = {};
    const users = [];

    request(createApp(config, users, sessions))
      .get('/signup')
      .expect('content-type', 'text/html')
      .expect(200, done);
  });
});

describe('POST /signup', () => {
  it('Should give 200 for successful registration', (done) => {
    const sessions = {};
    const users = [];

    request(createApp(config, users, sessions))
      .post('/signup')
      .send('username=sham&password=123')
      .expect(200, done);
  });

  it('Should give 409 if username already exist', (done) => {
    const sessions = {};
    const users = [{ username: 'sham', password: '123' }];

    request(createApp(config, users, sessions))
      .post('/signup')
      .send('username=sham&password=123')
      .expect(409, done);
  });
});

describe('GET /logout', () => {
  it('Should redirect to the homepage ', (done) => {
    const sessions = {};
    const users = [{ username: 'sham', password: '123' }];

    request(createApp(config, users, sessions))
      .get('/logout')
      .set('cookie', 'id=123')
      .expect('location', '/')
      .expect(302, done);
  });
});
