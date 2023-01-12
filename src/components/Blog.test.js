import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 1,
    user: {
      _id: "63bef69d161e0bd04e26f7db",
      username: "test",
      name: "Real Name",
      passwordHash: "$2b$10$gP5El7dY4O9RoFtrI7e2meZNXrxUshMLI7bJAHz.IgYtEs38cFGfa",
      blogs: [
        "63bef6ae161e0bd04e26f7de",
        "63bef6bb161e0bd04e26f7e2",
        "63befc88942768fd3d884f90",
        "63befd8bbfcfb5c7c3d43d54",
        "63bfeecd8e89e7b595f4d8d9",
        "63bff0ed8e89e7b595f4d8e8",
        "63bff10c8e89e7b595f4d8ec",
        "63bffbd18e89e7b595f4d903",
        "63bffc078e89e7b595f4d908",
        "63bffcc88e89e7b595f4d912",
        "63c00ade8e89e7b595f4d920",
        "63c00b7e8e89e7b595f4d924",
        "63c01b5b90f4b0a767c648c5"
      ],
      "__v": 13
    }
  }

  const user = {
    id: '1'
  }

  render(<Blog blog={blog} user={user} />)

  const element = screen.findByText('title')
  expect(element).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 1,
    user: {
      _id: "63bef69d161e0bd04e26f7db",
      username: "test",
      name: "Real Name",
      passwordHash: "$2b$10$gP5El7dY4O9RoFtrI7e2meZNXrxUshMLI7bJAHz.IgYtEs38cFGfa",
      blogs: [
        "63bef6ae161e0bd04e26f7de",
        "63bef6bb161e0bd04e26f7e2",
        "63befc88942768fd3d884f90",
        "63befd8bbfcfb5c7c3d43d54",
        "63bfeecd8e89e7b595f4d8d9",
        "63bff0ed8e89e7b595f4d8e8",
        "63bff10c8e89e7b595f4d8ec",
        "63bffbd18e89e7b595f4d903",
        "63bffc078e89e7b595f4d908",
        "63bffcc88e89e7b595f4d912",
        "63c00ade8e89e7b595f4d920",
        "63c00b7e8e89e7b595f4d924",
        "63c01b5b90f4b0a767c648c5"
      ],
      "__v": 13
    }
  }

  const testuser = {
    id: '1'
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} user={testuser} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()
  const handleBlogFormVisibleChange = jest.fn()

  render(<BlogForm createBlog={createBlog} handleBlogFormVisibleChange={handleBlogFormVisibleChange}/>)

  const title = screen.getByPlaceholderText('write blog title here')
  const author = screen.getByPlaceholderText('write blog author here')
  const url = screen.getByPlaceholderText('write blog url here')
  const sendButton = screen.getByText('create')
  await user.type(title, 'testing title')
  await user.type(author, 'testing author')
  await user.type(url, 'testing url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing url')
})