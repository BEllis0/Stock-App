const proxy = require('http-proxy-middleware');

module.exports = function(app) {

  //FINNHUB
  app.use(proxy( '/api/stocks/timeseries', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  
  //USERS
  app.use(proxy( '/users/', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users/*', {
      target: 'http://localhost:5000',
      changeOrigin: true,
  })
  );
  
  app.use(proxy( '/users/saved-stocks/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );

  app.use(proxy( '/users/newuser', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users/new-stock/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users/update-username/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users/update-email/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users/update-password/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users/login/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/users/newuser', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );

  //stock search
  app.use(proxy( '/stock-search/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );

  //stock time series
  app.use(proxy( '/stock-timeseries-intra/**/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/stock-timeseries/**/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/stock-current/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );

  //INDICATORS
  app.use(proxy( '/stock-rsi/**/**/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/stock-sma/**/**/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );
  app.use(proxy( '/stock-ema/**/**/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
  })
  );

  // earnings calendar


  //news 
  app.use(proxy( '/top-news/*', {
    target: 'http://localhost:5000',
    changeOrigin: true,
    })
  );
};