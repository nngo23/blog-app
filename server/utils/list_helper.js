const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  } 

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    return favorite.likes > blog.likes ? favorite : blog
  } 

  return blogs.length === 0
    ? null
    : blogs.reduce(reducer)

}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const num = _.countBy(blogs, 'author')

  const topAuthor = _.maxBy(Object.keys(num), (author) => num[author])

  return {
    author: topAuthor,
    blogs: num[topAuthor],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return _(blogs)
    .groupBy('author')
    .map((blog, author) => ({
      author,
      likes: _.sumBy(blog, 'likes'),
    }))
    .maxBy('likes')
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}



