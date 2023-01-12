import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import PropTypes from 'prop-types'
import BlogForm from './components/BlogForm'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
            placeholder='write username here'
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
            placeholder='write password here'
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  handleBlogFormVisibleChange: PropTypes.func.isRequired,
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll()
      .then(blogs =>
        blogs.sort((a, b) => {
          return b.likes - a.likes
        })
      )
      .then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.resetToken()
      setUser(null)
    } catch (exception) {
      setErrorMessage('unable to logout')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = (event) => {
    event.preventDefault()

    const id = event.target[0].value
    const blog = blogs.find(n => n._id === id)
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes+1,
      userId: blog.userId
    }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        setErrorMessage(
          `${error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 4000)
        setBlogs(blogs.filter(n => n.id !== id))
      })
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    const index = blogs.indexOf(event.target[0].value)
    if (window.confirm(`Delete ${event.target[1].value}?`)) {
      blogService
        .deleteBlog(event.target[0].value)
        .then(() => {
          const newBlogs = [...blogs]
          newBlogs.splice(index, 1)
          setBlogs(newBlogs)
          setErrorMessage(
            `Deleted ${event.target[1].value}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 4000)
        })
    }
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(response => {
        setBlogs(blogs.concat(response))
        setErrorMessage(
          `Added ${response.title}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 4000)
      })
      .catch(error => {
        setErrorMessage(
          `${error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 4000)
      })
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            createBlog={addBlog}
            handleBlogFormVisibleChange={() => setBlogFormVisible(false)}
            user={user}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogView = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <form onSubmit={handleLogout}>
        <button type="submit">logout</button>
      </form>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog._id} blog={blog} handleLike={handleLike} user={user} deleteBlog={deleteBlog} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={errorMessage} />
      {user === null && loginForm()}
      {user !== null && blogView()}
    </div>
  )
}

export default App
