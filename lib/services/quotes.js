const request = require ('superagent');

module.exports = () => {
  return request
    .get('https://michael-scott-quotes-api.herokuapp.com/randomQuote')
    .then(res => res.body.quote);
};
