import { test, expect } from '@playwright/test'

const DEMO_PAUSE_MS = Number(process.env.DEMO_PAUSE_MS ?? 600)

const ANSWERS = [
  'When she asked how my week really was—not the polite version—I felt my throat close and almost said fine.',
  'I admitted I am scared people only like me when I am competent. That surprised me.',
  'Same loop: overcommit, resent, crash, then shame—for work and at home.',
  'She asked me to name once a day when I am performing versus just being. No fixing, just naming.',
  'We never got to guilt about rest; I want that first next session.',
]

async function pause(page: import('@playwright/test').Page) {
  if (DEMO_PAUSE_MS > 0) await page.waitForTimeout(DEMO_PAUSE_MS)
}

test.describe('Recorded demo: Discovery → Pulse', () => {
  test('full journey with video capture', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      try {
        localStorage.removeItem('mend-storage')
      } catch {
        /* ignore */
      }
    })
    await page.goto('/')
    await pause(page)

    await expect(page.getByRole('heading', { name: /YourDOST/i })).toBeVisible()
    await page.getByRole('button', { name: /Try Mend free/i }).click()
    await expect(page.getByText('Only listens when you ask it to.')).toBeVisible()
    await pause(page)

    await page.getByRole('button', { name: /Continue onboarding/i }).click()
    await expect(page.getByText("Let's get you set up")).toBeVisible()
    await pause(page)

    await page.getByRole('button', { name: /Continue to consent/i }).click()
    await expect(page.getByText("You're always in control.")).toBeVisible()
    await pause(page)

    await page.getByRole('button', { name: /Continue to finish/i }).click()
    await expect(page.getByText('Had any therapy recently?')).toBeVisible()
    await pause(page)

    await page.getByRole('button', { name: /Remind me after my next session/i }).click()
    await expect(page.getByText(/Good evening, Priya/)).toBeVisible({ timeout: 20_000 })
    await pause(page)

    const mainNav = page.getByRole('navigation', { name: 'Main navigation' })
    await mainNav.getByRole('button', { name: 'Debrief', exact: true }).click()
    await expect(page.getByText('Capture before it fades')).toBeVisible()
    await pause(page)

    await page
      .getByRole('button', { name: /Begin the five questions/i })
      .click()
    await expect(page.getByText('Question 1 of 5')).toBeVisible()

    for (let i = 0; i < 5; i += 1) {
      await page.getByText('Prefer to type?').click()
      await page.getByRole('textbox', { name: /Type your answer/i }).fill(ANSWERS[i])
      await pause(page)
      await page.getByTestId('debrief-next').click()
      if (i < 4) {
        await expect(page.getByText(`Question ${i + 2} of 5`)).toBeVisible()
      }
      await pause(page)
    }

    await expect(page.getByText('Saved. ✓')).toBeVisible({ timeout: 120_000 })
    await pause(page)

    await mainNav.getByRole('button', { name: 'Home', exact: true }).click()
    await expect(page.getByText(/Good evening, Priya/)).toBeVisible()
    await pause(page)

    await mainNav.getByRole('button', { name: 'Brief', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Your Brief' })).toBeVisible()
    await expect(page.getByText(/insights/i).first()).toBeVisible()
    await pause(page)

    await mainNav.getByRole('button', { name: 'Pulse', exact: true }).click()
    await expect(page.getByText('Weekly Pulse')).toBeVisible()
    await pause(page)
  })
})
