import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
            title: <input value={newTitle}
            placeholder="title"
            onChange={({ target }) => setNewTitle(target.value)} />
        </div>
        <div>
            author: <input value={newAuthor}
            placeholder="author"
            onChange={({ target }) => setNewAuthor(target.value)} />
        </div>
        <div>
            url: <input value={newUrl}
            placeholder="url"
            onChange={({ target }) => setNewUrl(target.value)} />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm

