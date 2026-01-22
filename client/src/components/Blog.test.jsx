import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Frontend testing',
    author: 'Tom John',
    url: 'https://frontend-test.com',
    likes: 20,
    user: { username: 'tester', name: 'Tester Name' }
  }

  test('shows title and author but hides URL and likes by default', () => {
    render(<Blog blog={blog} />)

    expect(screen.getByText('Frontend testing by Tom John')).toBeInTheDocument()
    expect(screen.queryByText('https://frontend-test.com')).toBeNull()
    expect(screen.queryByText('likes: 20')).toBeNull()
  })

  test('shows URL and likes after the view button is clicked', async () => {
    render(<Blog blog={blog} />)
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://frontend-test.com')).toBeInTheDocument()
    expect(screen.getByText(/likes\s*20/)).toBeInTheDocument()
  })

  test('triggers the like handler twice when like button is clicked twice', async () => {
    const user = userEvent.setup()
    const mockLikeHandler = vi.fn()

    render(<Blog blog={blog} updateLike={mockLikeHandler} />)

    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })
})