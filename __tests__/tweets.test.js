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
});
