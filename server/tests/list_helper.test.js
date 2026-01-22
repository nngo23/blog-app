const listHelper = require('../utils/list_helper')
const assert = require('assert')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithSomeBlogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
    },
    {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
    },
    {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs is calculated right', () => {
    const result = listHelper.totalLikes(listWithSomeBlogs)
    assert.strictEqual(result, 24)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
    },
    {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
    },
    {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
    }
  ]

  test('when list has only one blog, equals to that blog', () => {
    const one = [blogs[2]]
    const result = listHelper.favoriteBlog(one)
    assert.deepStrictEqual(result, blogs[2])
  })

  test('when list has multiple blogs is the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

})

describe('most blogs', () => {
  const blogs = [
    { title: 'React patterns', author: 'Michael Chan', likes: 7 },
    { title: 'TDD harms architecture', author: 'Robert C. Martin', likes: 0 },
    { title: 'Type wars', author: 'Robert C. Martin', likes: 2 },
    { title: 'Clean code', author: 'Robert C. Martin', likes: 10 },
    { title: 'Go To Statement', author: 'Edsger W. Dijkstra', likes: 5 },
    { title: 'Canonical string', author: 'Edsger W. Dijkstra', likes: 12 },
  ]

  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(null)
  })
  
})

describe('most likes', () => {
  const blogs = [
    { title: 'React patterns', author: 'Michael Chan', likes: 7 },
    { title: 'TDD harms architecture', author: 'Robert C. Martin', likes: 0 },
    { title: 'Type wars', author: 'Robert C. Martin', likes: 2 },
    { title: 'Clean code', author: 'Robert C. Martin', likes: 10 },
    { title: 'Go To Statement', author: 'Edsger W. Dijkstra', likes: 5 },
    { title: 'Canonical string', author: 'Edsger W. Dijkstra', likes: 12 },
  ]

  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(null)
  })

})
