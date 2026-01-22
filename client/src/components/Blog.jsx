import { useState } from 'react'

const Blog = ({ blog, user, updateLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blog title">
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div className="blog details">
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={() => updateLike(blog)}>like</button></p>
          <p>{blog.username || blog.user.name}</p>

          {( blog.user?.username === user?.username ) && (
            <button onClick={() => removeBlog(blog)}>remove</button>
          )}
        </div>
      )}

    </div>

  )}

export default Blog