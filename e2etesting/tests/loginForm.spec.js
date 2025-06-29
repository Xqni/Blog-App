const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Blog app', () => {
  // resetting the state of the db
  beforeEach(async ({ page, request }) => {
    console.log('deleting test db')
    await request.post('http://localhost:5173/api/testing/reset')

    console.log('creating new user')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Damian',
        username: 'damianqt',
        password: 'qwerty'
      }
    })

    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Tarik',
        username: 'tarik',
        password: 'qwerty'
      }
    })

    await page.goto('http://localhost:5173')
  })

  // Test 1
  test('Login form is shown', async ({ page }) => {
    console.log('checking if login form can be seen...')
    await expect(page.getByText('Login Form')).toBeVisible()
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByTestId('form-username')).toBeVisible()
    await expect(page.getByTestId('form-password')).toBeVisible()
  })

  describe('Login', () => {
    // Test 2
    test('succeeds with correct credentials', async ({ page }) => {
      console.log('trying to login with correct creds...')

      await helper.loginWith(page, 'damianqt', 'qwerty')
      await expect(page.getByText('Damian logged in')).toBeVisible()
    })

    // Test 3
    test('fails with wrong credentials', async ({ page }) => {
      console.log('trying to login with wrong creds...')

      await helper.loginWith(page, 'damianqt', 'fgdfgdf')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(132, 32, 41)')
      await expect(page.getByText('Damian logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, 'damianqt', 'qwerty')
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('Blogs')).toBeVisible()
      await helper.createBlog(page, 'What Actually Matters in Your 20s', 'Productive Peter', 'https://youtu.be/q7K9SmJVfYo?si=Yme0JsCbxBtlKUw6')
      await helper.createBlog(page, 'this is another blog', 'Productive Peter', 'https://youtu.be/q7K9SmJVfYo?si=Yme0JsCbxBtlKUw6')

      await expect(page.getByText('\'What Actually Matters in Your 20s\' by Productive Peterview')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await helper.createBlog(page, 'test blog 3', 'damian', 'some url')
      const blog = page.locator('.blog').filter({ hasText: '\'test blog 3\' by Damian' })
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()
    })

    test('owner can delete blog', async ({ page }) => {
      await helper.createBlog(page, 'test blog 4', 'Damian', 'some url')
      const blog = page.locator('.blog').filter({ hasText: '\'test blog 4\' by Damian' })
      await blog.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'delete' }).click()
      await expect(page.locator('.blog').filter({ hasText: '\'test blog 4\' by Damian' })).not.toBeVisible()
    })

    test('only owner sees delete button', async ({ page }) => {
      await helper.createBlog(page, 'test blog 5', 'damian', 'some url')
      await page.getByRole('button', { name: 'Logout' }).click()
      await helper.loginWith(page, 'tarik', 'qwerty')
      const blog = page.locator('.blog').filter({ hasText: '\'test blog 5\' by damian' })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test.only('filtered list of blogs', async ({ page }) => {
      await helper.createBlog(page, 'test blog 6', 'damian', 'some url')
      await helper.createBlog(page, 'test blog 7', 'damian', 'some url')

      const blogs = page.locator('.blogs')
      await expect(blogs.locator('.blog')).toHaveCount(2)

      const blog1 = page.locator('.blog').filter({ hasText: '\'test blog 7\' by damian' })
      await blog1.getByRole('button', { name: 'view' }).click()
      await blog1.getByRole('button', { name: 'like' }).click()

      const blog2 = page.locator('.blog').filter({ hasText: '\'test blog 6\' by damian' })
      await blog2.getByRole('button', { name: 'view' }).click()

      await page.reload()

      const firstBlog = page.locator('.blog').nth(0)
      const firstBlogContent = await firstBlog.textContent()
      expect(firstBlogContent).toContain('test blog 7')

      const secondBlog = page.locator('.blog').nth(1)
      const secondBlogContent = await secondBlog.textContent()
      expect(secondBlogContent).toContain('test blog 6')
    })
  })
})