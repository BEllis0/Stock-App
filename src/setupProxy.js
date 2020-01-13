const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy( '/users', {
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
  app.use(proxy( '/top-news/stocks', {
    target: 'http://localhost:5000',
    changeOrigin: true,
    })
  );
  app.use(proxy( '/users/saved-stocks/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/earnings-calendar/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
};