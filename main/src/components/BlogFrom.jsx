const blogForm = ({ onSubmit, value, onchange }) => (
    <>
        <h2>Create New</h2>
        <form onSubmit={onSubmit}>
            <div>
                title
                <input type="text" value={value} name="Title" onchange={onchange} />
            </div>
            <div>
                title
                <input type="text" value={value} name="Title" onchange={onchange} />        </div>
            <div>
                title
                <input type="text" value={value} name="Title" onchange={onchange} />        </div>
            <button type="submit">create</button>
        </form>
    </>
)

export default blogForm