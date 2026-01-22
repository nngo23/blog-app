const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await helper.hashPassword('pass')
  const adminUser = new User({ username: 'root', passwordHash })
  await adminUser.save()
})

describe('addition of a new user', () => {
  test('fails with status code 400 if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'a',
      password: 'password'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('Username must be required and have at least 3 characters')

  })

  test('fails with status code 400 if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'user',
      password: 'pw'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('Password must be required and have at least 3 characters')

  })

  test('fails with status code 400 if username already taken', async () => {
    const newUser = {
      username: 'root',
      password: 'anotherpw'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('Username must be unique')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
