import { test, expect } from '@playwright/test'

test('login → open submitted PO → approve → receive', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('admin@procuris.test')
  await page.getByLabel(/password/i).fill('secret')
  await page.getByRole('button', { name: /Masuk/i }).click()
  await page.waitForURL('**/hris/dashboard')

  await page.goto('/purchasing/purchase-orders')
  await expect(page.getByText('PO/BDG/2026/0001')).toBeVisible()

  await page.getByText('PO/BDG/2026/0001').click()
  await page.getByRole('button', { name: /Approve/i }).click()
  await expect(page.getByTestId('po-status')).toHaveText('approved')

  await page.getByRole('button', { name: /Receive/i }).click()
  await expect(page.getByTestId('po-status')).toHaveText('received')
})
