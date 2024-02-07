const { test, expect } = require("@playwright/test");
const { user, password, incorrectPassword } = require("../user");

test("success login", async ({ page }) => {
  await page.goto("https://netology.ru/?modal=sign_in");
  await expect(page).toHaveURL("https://netology.ru/?modal=sign_in");

  // Fill in email and password fields using page.type
  await page.type('input[placeholder="Email"]', user);
  await page.type('input[placeholder="Пароль"]', password);

  // Checking the input has been completed succesfully
  const emailInput = await page.$('input[placeholder="Email"]');
  const passwordInput = await page.$('input[placeholder="Пароль"]');

  expect(await emailInput.inputValue()).toBe(user);
  expect(await passwordInput.inputValue()).toBe(password);

  // Click on the Login button
  await page.click('button:has-text("Войти")');

  // Wait for navigation to a URL containing "/profile/"
  await page.waitForNavigation({ url: /\/profile\// });

  // Wait for the profile page to load
  await page.waitForSelector('h2:has-text("Моё обучение")');

  // Assertion: Verify the profile page is open
  const pageTitle = await page.innerText('h2');
  expect(pageTitle).toBe('Моё обучение');
});

test("error login", async ({ page }) => {
  await page.goto("https://netology.ru/?modal=sign_in");
  await expect(page).toHaveURL("https://netology.ru/?modal=sign_in");

  // Fill in email and password fields using page.type
  await page.type('input[placeholder="Email"]', user);
  await page.type('input[placeholder="Пароль"]', incorrectPassword);

  // Checking the input has been completed succesfully
  const emailInput = await page.$('input[placeholder="Email"]');
  const passwordInput = await page.$('input[placeholder="Пароль"]');

  expect(await emailInput.inputValue()).toBe(user);
  expect(await passwordInput.inputValue()).toBe(incorrectPassword);

  // Click on the Login button
  await page.click('button:has-text("Войти")');

  // Wait for error message 
  await page.waitForSelector('[data-testid="login-error-hint"]');

  expect(await page.textContent('[data-testid="login-error-hint"]')).toBe('Вы ввели неправильно логин или пароль')
});
