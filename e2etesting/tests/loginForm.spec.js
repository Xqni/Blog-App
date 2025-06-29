const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login Form')).toBeVisible()
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByTestId('form-username')).toBeVisible()
    await expect(page.getByTestId('form-password')).toBeVisible()
  })
})