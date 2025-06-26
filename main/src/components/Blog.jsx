import { useState } from 'react'

const Blog = ({ blog, likeBlog }) => {

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = (event) => {
        event.preventDefault()
        likeBlog({ ...blog, likes: blog.likes + 1 })
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
            </div>
        </div>
    )
}

export default Blog