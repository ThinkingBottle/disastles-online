const ConfigRequest = require('config-request/instance');

request = ConfigRequest();

request.configure({
  baseUrl: 'https://disastles.herokuapp.com/'
  json: true
});

export default request;

// probably never used?
