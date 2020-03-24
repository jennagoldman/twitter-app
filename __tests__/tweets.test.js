require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const Comment = require('../lib/models/Comment');

describe('tweet routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a tweet', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: 'jennagoldman',
        text: 'this is a tweet'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'jennagoldman',
          text: 'this is a tweet',
          __v: 0
        });
      });
  });

  it('creates a tweet with a random quote', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: 'jennagoldman',
        text: ''
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'jennagoldman',
          text: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets all tweets', async() => {
    const tweets = await Tweet.create([
      { handle: 'jennagoldman', text: 'this is a tweet' },
      { handle: 'jennagoldman', text: 'this is also a tweet' },
      { handle: 'jennagoldman', text: 'this is yet another tweet' },
    ]);

    return request(app)
      .get('/api/v1/tweets')
      .then(res => {
        tweets.forEach(tweet => {
          expect(res.body).toContainEqual({
            _id: tweet._id.toString(),
            handle: tweet.handle,
            text: tweet.text,
            __v: 0
          });
        });
      });
  });

  it('gets a tweet by id', async() => {
    const tweet = await Tweet.create({
      handle: 'jennagoldman',
      text: 'this is a tweet'
    });

    const comment = await Comment.create({
      tweetId: tweet.id,
      handle: 'chelseaspangler',
      text: 'hi'
    });

    return request(app)
      .get(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'jennagoldman',
          text: 'this is a tweet',
          comments: expect.any(Array),
          __v: 0
        });
      });
  });

  it('updates a tweet by id', async() => {
    const tweet = await Tweet.create({
      handle: 'jennagoldman',
      text: 'this is a new tweet'
    });

    return request(app)
      .patch(`/api/v1/tweets/${tweet._id}`)
      .send({ text: 'this tweet has been updated' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'jennagoldman',
          text: 'this tweet has been updated',
          __v: 0
        });
      });
  });

  it('deletes a tweet by id', async() => {
    const tweet = await Tweet.create({
      handle: 'jennagoldman',
      text: 'this tweet will be deleted'
    });

    return request(app)
      .delete(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'jennagoldman',
          text: 'this tweet will be deleted',
          __v: 0
        });
      });
  });
});
