const { test, expect } = require('@playwright/test');

const url = 'http://localhost:3000';
const userEmail = 'peter@abv.bg';
async function loginUser(page) {
  await page.goto(url + '/login');
  await page.fill('input[name="email"]', userEmail);
  await page.fill('input[name="password"]', '123456');
  await page.click('input[type="submit"]');
}

//Test visability before Login

test('Verify "All books" link is visible', async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('nav.navbar');

  const allBookLink = await page.$('a[href="/catalog"]');
  const isLinkVisible = await allBookLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify "Login" button is visible', async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('nav.navbar');

  const btnLogin = await page.$('a[href="/login"]');
  const isBtnLoginVisible = await btnLogin.isVisible();

  expect(isBtnLoginVisible).toBe(true);
});

test('Verify that "Register" buttom is visible', async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('nav.navbar');

  const registerBtn = await page.$('a[href="/register"]');
  const isRegisterBtnVisilbe = await registerBtn.isVisible();

  expect(isRegisterBtnVisilbe).toBe(true);
});

//Test visability after Login

test('Verify "All Books" link is visible after user login', async ({ page }) => {
  await loginUser(page);

  const allBookLink = await page.$('a[href="/catalog"]');
  const isLinkVisible = await allBookLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify that "Login" button is not visible after userr login', async ({ page }) => {
  await loginUser(page);

  const loginBtn = await page.$('a[href="/login"]');
  const isLoginBtnVisible = await loginBtn.isVisible();

  expect(isLoginBtnVisible).toBe(false);
});

test('Verify that "Register" button is not visible after userr login', async ({ page }) => {
  await loginUser(page);

  const registerBtn = await page.$('a[href="/register"]');
  const isRegisterBtnVisible = await registerBtn.isVisible();

  expect(isRegisterBtnVisible).toBe(false);
});

test('Verify "My Books" button is visible after user login', async ({ page }) => {
  await loginUser(page);

  const myBooksBtn = await page.$('a[href="/profile"]');
  const isMyBooksBtnVisible = await myBooksBtn.isVisible();

  expect(isMyBooksBtnVisible).toBe(true);
});

test('Verify "Add Book" button is visible after user login', async ({ page }) => {
  await loginUser(page);

  const addBookBtn = await page.$('a[href="/create"]');
  const isAddBookBtnVisible = await addBookBtn.isVisible();

  expect(isAddBookBtnVisible).toBe(true);
});

test("Verify That the User's Email Address Is Visible", async ({ page }) => {
  await loginUser(page);

  const userGreeting = await page.$('#user > span:nth-child(1)');
  const userGreetingContent = await userGreeting.textContent();
  const isUserEmailVisible = userGreetingContent.includes(userEmail);

  expect(isUserEmailVisible).toBe(true);
});