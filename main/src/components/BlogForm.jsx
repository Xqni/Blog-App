const BlogForm = ({ onSubmit, value, onChange }) => (
    <>
        <h2>Create New</h2>
        <form onSubmit={onSubmit}>
            <div>
                Title
                <input type="text" name="Title" value={value[0]} onChange={onChange[0]} />
            </div>
            <div>
                Author
                <input type="text" name="Author" value={value[1]} onChange={onChange[1]} />
            </div>
            <div>
                URL
                <input type="text" name="URL" value={value[2]} onChange={onChange[2]} />
            </div>
            <button type="submit">Create</button>
        </form>
    </>
)

export default BlogForm