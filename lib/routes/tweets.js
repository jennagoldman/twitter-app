const { Router } = require('express');
const Tweet = require('../models/Tweet');
const Comment = require('../models/Comment');
const getQuote = require('../services/quotes');

module.exports = Router()
  .post('/', async(req, res, next) => {
    req.body.text
      ? req.body.text
      : req.body.text = await getQuote();

    Tweet
      .create(req.body)
      .then(tweet => res.send(tweet))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Tweet
        .findById(req.params.id),
      Comment
        .find({ tweetId: req.params.id })
    ])
      .then(([tweet, comments]) => {
        res.send({ ...tweet.toJSON(), comments });
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Tweet
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(tweet => res.send(tweet))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params.id)
      .then(tweet => res.send(tweet))
      .catch(next);
  });
