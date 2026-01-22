const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token = null

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await helper.hashPassword('pass')
  const adminUser = new User({ username: 'root', passwordHash })
  await adminUser.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'pass' })

  token = loginResponse.body.token

})

beforeEach(async () => {
  await Blog.deleteMany({})
  const user = await User.findOne({ username: 'root' })

  const initialBlogsWithUsers = helper.initialBlogs.map(b => ({
    ...b,
    user: user._id
  }))
  await Blog.insertMany(initialBlogsWithUsers)
})


describe('when there are some blogs initially', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog).toHaveProperty('id')
      expect(blog).not.toHaveProperty('_id')
    })
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAfter.map(b => b.title)
    expect(titles).toContain('First class tests')
  })

  test('fails with status 401 if token missing', async () => {
      const newBlog = { 
        title: "Travel blog",
        author: "Anna Hathaway",
        url: "http://travelblog.com",
        likes: 50
      }

      await api.post('/api/blogs').send(newBlog).expect(401)
    })

  test('sets likes to 0 if the property is not provided', async () => {
    const newBlog = {
      title: 'Food blog',
      author: 'Mary',
      url: 'http://foodblog.com'
    }

    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)
    expect(response.body.likes).toBe(0)
  })

  test('fails with status 400 if title or url missing', async () => {
    const newBlog = { author: 'Alice' }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status 204 if id is valid', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1)
    const titles = blogsAfter.map(b => b.title)
    expect(titles).not.toHaveProperty(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('succeeds in updating likes', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToUpdate = blogsBefore[0]

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 10 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(blogToUpdate.likes + 10)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

