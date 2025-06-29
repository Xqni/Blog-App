const loginWith = async (page, username, password) => {
  console.log('logging in as', username)
  await page.getByRole('button', { name: 'Login' }).click()
  await page.getByTestId('form-username').fill(username)
  await page.getByTestId('form-password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create Blog' }).click()
  await page.getByTestId('blog-title').fill(title)
  await page.getByTestId('blog-author').fill(author)
  await page.getByTestId('blog-url').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}

export {
  loginWith,
  createBlog
}