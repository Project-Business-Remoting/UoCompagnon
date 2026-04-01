import { test, expect } from '@playwright/test';

// Fonction utilitaire pour la connexion Admin
async function loginAsAdmin(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@uottawa.ca');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*dashboard/);
}

test.describe('Admin Portal Flow', () => {

  test('should login as an admin and see the dashboard stats', async ({ page }) => {
    await page.goto('/login');
    await page.context().clearCookies();

    await page.fill('input[type="email"]', 'admin@uottawa.ca');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    // Attendre que le dashboard soit chargé (Stats cards)
    const statsCards = page.locator('.admin-stat-card');
    await expect(statsCards.first()).toBeVisible({ timeout: 10000 });
    await expect(statsCards).toHaveCount(2); // Le dashboard Admin a actuellement 2 cartes
  });

  test.describe('Authenticated Admin Actions', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('questions management view switches to cards on mobile', async ({ page, isMobile }) => {
      await page.goto('/questions');
      
      // Attendre que la table ou les cartes soient là
      await page.waitForLoadState('networkidle');

      if (isMobile) {
        // En mode mobile, la table Desktop doit être cachée
        const table = page.locator('.questions-desktop');
        await expect(table).not.toBeVisible();

        // Les cartes mobiles doivent être présentes
        const cards = page.locator('.questions-mobile');
        await expect(cards).toBeVisible();
      } else {
        // Desktop: Table visible
        const table = page.locator('.questions-desktop');
        await expect(table).toBeVisible();
      }
    });
  });

});
