const getQuote = require('./quotes');

describe('get quote function', () => {
  it('gets a quote', () => {
    return getQuote()
      .then(() => {
        expect.any(String);
      });
  });
});

