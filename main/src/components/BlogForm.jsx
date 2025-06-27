import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setURL] = useState('')

    const handleBlogCreate = (event) => {
        event.preventDefault()
        addBlog({
            title: title,
            author: author,
            url: url
        })
        setTitle('')
        setAuthor('')
        setURL('')
    }

    const handleTitleChange = ({ target }) => {
        setTitle(target.value)
    }

    const handleAuthorChange = ({ target }) => {
        setAuthor(target.value)
    }

    const handleURLChange = ({ target }) => {
        setURL(target.value)
    }


    return (
        <div>
            <h2>Create New</h2>
            <form onSubmit={handleBlogCreate} className='BlogForm'>
                <div>
                    Title
                    <input
                        type="text"
                        name="Title"
                        value={title}
                        placeholder='Enter title...'
                        onChange={handleTitleChange}
                    />
                </div>
                <div>
                    Author
                    <input
                        type="text"
                        name="Author"
                        value={author}
                        placeholder='Enter author...'
                        onChange={handleAuthorChange}
                    />
                </div>
                <div>
                    URL
                    <input
                        type="text"
                        name="URL"
                        value={url}
                        placeholder='Enter url...'
                        onChange={handleURLChange}
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default BlogForm