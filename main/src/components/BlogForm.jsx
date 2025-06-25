const BlogForm = ({ onSubmit, value, onChange }) => (
    <>
        <h3>Create New</h3>
        <form onSubmit={onSubmit}>
            <div>
                title
                <input type="text" name="Title" value={value[0]} onChange={onChange[0]} />
            </div>
            <div>
                author
                <input type="text" name="Author" value={value[1]} onChange={onChange[1]} />
            </div>
            <div>
                url
                <input type="text" name="URL" value={value[2]} onChange={onChange[2]} />
            </div>
            <button type="submit">create</button>
        </form>
    </>
)

export default BlogForm