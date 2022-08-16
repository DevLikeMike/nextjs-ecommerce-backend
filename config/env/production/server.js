// Heroku deploy server

module.exports = ({ env }) => ({
  url: env("MY_HEROKU_URL"),
});
