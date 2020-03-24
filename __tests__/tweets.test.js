require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

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
        text: 'this is a test tweet'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'jennagoldman',
          text: 'this is a test tweet',
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

    return request(app)
      .get(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'jennagoldman',
          text: 'this is a tweet',
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
});
