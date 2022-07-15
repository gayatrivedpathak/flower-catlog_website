const { createApp } = require("./src/app");

const config = {
  serveFrom: 'public',
  dataPath: 'data/comments.json',
  guestBookTemplatePath: 'resources/guest-book.html'
};

const sessions = {};
const users = [
  { username: 'gayatri', password: '12345' },
  { username: 'ram', password: 'ram' }
];

const app = createApp(config, users, sessions);
app.listen(4444, () => console.log('Listening on 4444'));
