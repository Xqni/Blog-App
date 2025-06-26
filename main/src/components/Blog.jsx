import { useState, useEffect } from 'react'

const Blog = ({ blog, likeBlog, user, deleteBlog }) => {

    const [visible, setVisible] = useState(false)
    const [blogOwner, setOwner] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    // inside the component
    useEffect(() => {
        if (user && blog && blog.user) {
            setOwner(user.id === blog.user.id)
        }
    }, [user, blog])

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = (event) => {
        event.preventDefault()
        likeBlog({ ...blog, likes: blog.likes + 1 })
    }

    const handleDelete = (event) => {
        event.preventDefault()
        if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            deleteBlog(blog.id)
        }
    }

    return (
        <div className='blog'>
            <div style={hideWhenVisible}>
                '{blog.title}' by {blog.author}
                <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible}>
                <div>
                    {blog.title}<button onClick={toggleVisibility}>hide</button>
                </div>
                <div>
                    {blog.url}
                </div>
                <div>
                    {blog.likes} <button onClick={handleLike}>like</button>
                </div>
                <div>
                    {blog.author}
                </div>
                {blogOwner && <button onClick={handleDelete}>Delete</button>}
            </div>
        </div>
    )
}

export default Blog