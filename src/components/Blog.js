const DeleteBlog = ({ deleteBlog, blog, user }) => {
  if (blog.user === user.id) {
    return (
      <div>
        <form onSubmit={deleteBlog}>
          <input type='hidden' value={blog._id} />
          <input type='hidden' value={blog.title} />
          <button type='submit'>delete</button>
        </form>
      </div>
    )
  }
}

const Blog = ({ blog, handleLike, deleteBlog, user }) => (
  <div id="blog-div">
    {blog.title} {blog.author} likes:{blog.likes}
    <form onSubmit={handleLike}>
      <input type='hidden' value={blog._id} />
      <button id={blog.title} type='submit'>like</button>
    </form>
    <DeleteBlog deleteBlog={deleteBlog} blog={blog} user={user} />
  </div>
)

export default Blog