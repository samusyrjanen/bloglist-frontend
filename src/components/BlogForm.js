import { useState } from 'react'

const BlogForm = ({
  createBlog,
  handleBlogFormVisibleChange,
  user
}) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      userId: user.id
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <p>
          title:
          <input
            id='title'
            value={newTitle}
            onChange={handleTitleChange}
            placeholder='write blog title here'
          />
        </p>
        <p>
          author:
          <input
            id='author'
            value={newAuthor}
            onChange={handleAuthorChange}
            placeholder='write blog author here'
          />
        </p>
        <p>
          url:
          <input
            id='url'
            value={newUrl}
            onChange={handleUrlChange}
            placeholder='write blog url here'
          />
        </p>
        <p><button id='create-button' type="submit" onClick={handleBlogFormVisibleChange}>create</button></p>
      </form>
    </div>
  )
}

export default BlogForm