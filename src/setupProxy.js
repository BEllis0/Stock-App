const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(['/top-news/:search'], { target: "http://localhost:5000" })
  );
};