import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('submitting the form calls the handler with the right blog info', async () => {
  const user = userEvent.setup()
  const mockCreateBlog = vi.fn()

  render(<BlogForm createBlog={mockCreateBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  await user.type(titleInput, 'Testing')
  await user.type(authorInput, 'Yen Tan')
  await user.type(urlInput, 'https://www.example.fi')
  await user.click(screen.getByText('create'))

  expect(mockCreateBlog.mock.calls).toHaveLength(1)

  expect(mockCreateBlog.mock.calls[0][0]).toEqual({
    title: 'Testing',
    author: 'Yen Tan',
    url: 'https://www.example.fi',
  })

})