const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Blog app', () => {

  // resetting the state of the db
  beforeEach(async ({ page, request }) => {
    console.log('deleting test db')
    await request.post('http://localhost:5173/api/testing/reset')
    // create a user for the backend here

    console.log('creating new user')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Damian',
        username: 'damianqt',
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
      const blogs = page.locator('.blogs')
      const blog = blogs.locator('.blog').filter({ hasText: '\'test blog 3\' by Damian' })
      await blog.getByRole('button', { name: 'view'}).click()
      await blog.getByRole('button', { name: 'like'}).click()
    })
  })
})