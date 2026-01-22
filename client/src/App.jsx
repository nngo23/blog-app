import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const blogFormRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: null });
  const sortBlogs = (blogs) => [...blogs].sort((c, d) => d.likes - c.likes);

  const fetchBlogs = async () => {
    try {
      const data = await blogService.getAll();
      setBlogs(data);
    } catch (error) {
      console.error("Fetch blogs failed:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showNotification = ({ type, message }) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: null }), 4000);
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification({ type: "success", message: `Welcome ${user.name}` });
    } catch {
      showNotification({
        type: "error",
        message: "wrong username or password",
      });
    }
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const addedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(addedBlog));
      showNotification({
        type: "success",
        message: `a new blog ${addedBlog.title} by ${addedBlog.author} added`,
      });
    } catch (error) {
      console.error("Error adding blog:", error);
      showNotification({ type: "error", message: "error adding blog" });
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    blogService.setToken(null);
  };

  const updateLike = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, {
        ...blogObject,
        likes: blogObject.likes + 1,
      });
      const displayedBlog = { ...updatedBlog, user: blogObject.user };
      setBlogs(blogs.map((b) => (b.id === blogObject.id ? displayedBlog : b)));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        showNotification({
          type: "success",
          message: `Blog ${blog.title} removed successfully`,
        });
      } catch (error) {
        console.error("Error removing blog:", error);
        showNotification({ type: "error", message: "Error removing blog" });
      }
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      {notification.message && (
        <Notification type={notification.type} message={notification.message} />
      )}
      {!user && (
        <Togglable buttonLabel="login">
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            handleUsername={({ target }) => setUsername(target.value)}
            handlePassword={({ target }) => setPassword(target.value)}
          />
        </Togglable>
      )}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      <Togglable buttonLabel="show blogs">
        {sortBlogs(blogs).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            updateLike={updateLike}
            removeBlog={removeBlog}
          />
        ))}
      </Togglable>
    </div>
  );
};

export default App;
