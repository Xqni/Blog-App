import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'

// well, this is, container, to be used later
let container

// test blog
const blog = {
    title: 'Adobe is horrible. So I tried the alternative',
    author: 'Damian',
    url: 'https://youtu.be/zabpcOP7H3U?si=RycNVmn3r3cMiI6R',
    likes: 40,
    user: '685a99bd70a59d47ebfde704'
}

// mock functions
const likeBlog = vi.fn()
const addBlog = vi.fn()

// mock user
const user = userEvent.setup()

describe('Blog tests', () => {

    beforeEach(() => {
        container = render(
            <Blog blog={blog} likeBlog={likeBlog} />
        ).container
    })

    // Test 1
    test('renders a breif blog', () => {
        const element = container.querySelector('.blog-brief')
        // console.log(element)
        expect(element).toBeDefined()
        expect(element.textContent).toContain('Adobe is horrible. So I tried the alternative')
        expect(element.textContent).toContain('Damian')
        expect(element.textContent).not.toContain('40')
        expect(element.textContent).not.toContain('https://youtu.be/zabpcOP7H3U?si=RycNVmn3r3cMiI6R')
    })

    // Test 2
    test('view button click', () => {

        const viewButton = screen.getByText('view')

        user.click(viewButton)
        const element = container.querySelector('.blog-detailed')

        expect(element).toBeDefined()
        expect(element.textContent).toContain('Adobe is horrible. So I tried the alternative')
        expect(element.textContent).toContain('Damian')
        expect(element.textContent).toContain('40')
        expect(element.textContent).toContain('https://youtu.be/zabpcOP7H3U?si=RycNVmn3r3cMiI6R')
    })

    // Test 3
    test('liking blog twice', async () => {

        const viewButton = screen.getByText('view')
        user.click(viewButton)

        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(likeBlog.mock.calls).toHaveLength(2)
    })

    // Test 4
    test('creating a blog', async () => {

        const blogFormContainer = render(
            <BlogForm addBlog={addBlog} />
        ).container
        const blogForm = blogFormContainer.querySelector('.BlogFrom')

        expect(blogForm).toBeDefined()

        const titleInput = screen.getByPlaceholderText('Enter title...')
        const authorInput = screen.getByPlaceholderText('Enter author...')
        const urlInput = screen.getByPlaceholderText('Enter url...')

        const createButton = screen.getByText('Create')

        await user.type(titleInput, 'Test admin title')
        await user.type(authorInput, 'Admin')
        await user.type(urlInput, 'https://fullstackopen.com/')

        await user.click(createButton)

        expect(addBlog.mock.calls[0][0].title).toBe('Test admin title')
        expect(addBlog.mock.calls[0][0].author).toBe('Admin')
        expect(addBlog.mock.calls[0][0].url).toBe('https://fullstackopen.com/')
    })
})