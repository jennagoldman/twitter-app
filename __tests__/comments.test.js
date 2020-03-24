require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Comment = require('../lib/models/Comment');
const Tweet = require('../lib/models/Tweet');

describe('comment routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a comment', () => {
    return Tweet.create({
      handle: 'jennagoldman',
      text: 'this is a test tweet'
    })
      .then(tweet => {
        return request(app)
          .post('/api/v1/comments')
          .send({
            tweetId: tweet.id,
            handle: 'chelseaspangler',
            text: 'butts'
          });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: expect.any(String),
          handle: 'chelseaspangler',
          text: 'butts',
          __v: 0
        });
      });
  });

  it('gets a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'jennagoldman',
      text: 'test tweet'
    });

    const comment = await Comment.create({
      tweetId: tweet.id,
      handle: 'chelseaspangler',
      text: 'teehee'
    });

    return request(app)
      .get(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'chelseaspangler',
          text: 'teehee',
          __v: 0,
          tweetId: {
            _id: tweet.id,
            __v: 0,
            handle: 'jennagoldman',
            text: 'test tweet'
          }

        });
      });
  });
});
