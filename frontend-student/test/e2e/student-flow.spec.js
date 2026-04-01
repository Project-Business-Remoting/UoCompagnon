import { test, expect } from '@playwright/test';

// Fonction utilitaire pour la connexion (utilisée dans beforeEach)
async function loginAsStudent(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'amara@uottawa.ca');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
}

test.describe('Student Portal Flow', () => {

  test('should login as a student and see the dashboard content', async ({ page }) => {
    // On teste le login ici explicitement
    await page.goto('/welcome');
    await page.context().clearCookies();
    await page.click('.lp-nav-cta');
    
    await page.fill('input[type="email"]', 'amara@uottawa.ca');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    
    // Attendre que le réseau soit calme pour que les contenus soient chargés
    await page.waitForLoadState('networkidle');

    // Vérifier la présence du stepper et des éléments de liste
    await expect(page.locator('.stepper')).toBeVisible();
    const listItems = page.locator('.dashboard-list-item');
    // On s'attend à avoir au moins un élément puisqu'on a seedé la base
    await expect(listItems.first()).toBeVisible({ timeout: 10000 });
  });

  test.describe('Authenticated Student Actions', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsStudent(page);
    });

    test('should show responsive hamburger menu on mobile', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip(); // Ce test n'a de sens que sur Mobile
        return;
      }

      await page.goto('/dashboard');
      
      // Le header mobile doit être visible
      const mobileHeader = page.locator('.layout-mobile-header');
      await expect(mobileHeader).toBeVisible();

      // Le bouton hamburger doit être cliquable
      const hamburger = page.locator('.layout-hamburger');
      await expect(hamburger).toBeVisible();

      // Cliquer pour ouvrir la sidebar
      await hamburger.click();
      await expect(page.locator('.sidebar.sidebar--open')).toBeVisible();
    });
  });

});
