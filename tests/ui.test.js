const { test, expect } = require('@playwright/test');

const url = 'http://localhost:3000';
const userEmail = 'peter@abv.bg';

async function loginUser(page) {
  await page.goto(url + '/login');
  await page.fill('input[name="email"]', userEmail);
  await page.fill('input[name="password"]', '123456');
  await Promise.all([
    page.click('input[type="submit"]'),
    page.waitForURL(url + '/catalog')
  ]);
}

//Test page '/' visability before Login

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

//Test  page '/' visability after Login

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

//Test login form 

test("Submit the Form with Valid Credentials", async ({ page }) => {
  await loginUser(page);

  await page.$('a[href="/catalog"]');
  expect(page.url()).toBe(url + '/catalog');
});

test("Submit the Form with Empty Input Fields", async ({ page }) => {
  await page.goto(url + '/login');
  await page.click('input[type="submit"]');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toContain('alert');
    expect(dialog.message()).toContain('All fields are required!');
    await dialog.accept();
  });

  // await page.$('a[href="/login"]');
  expect(page.url()).toBe(url + '/login');
});

test("Submit the Form with Empty Email Input Field", async ({ page }) => {
  await page.goto(url + '/login');
  await page.fill('input[name="password"]', '123456');
  await page.click('input[type="submit"]');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toContain('alert');
    expect(dialog.message()).toContain('All fields are required!');
    await dialog.accept();
  });

  // await page.$('a[href="/login"]');
  expect(page.url()).toBe(url + '/login');
});

test("Submit the Form with Empty Password Input Field", async ({ page }) => {
  await page.goto(url + '/login');
  await page.fill('input[name="email"]', userEmail);
  await page.click('input[type="submit"]');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toContain('alert');
    expect(dialog.message()).toContain('All fields are required!');
    await dialog.accept();
  });

  // await page.$('a[href="/login"]');
  expect(page.url()).toBe(url + '/login');
});

//Test register form

test("Submit the Form with Valid Values", async ({ page }) => {
  await page.goto(url + '/register');
  await page.fill('input[name="email"]', `peter${new Date().getTime()}@abv.bg`);
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirm-pass"]', '123456');
  await page.click('input.button');

  await page.$('a[href="/catalog"]');
  expect(page.url()).toBe(url + '/catalog');
});

test("Submit the Form with Empty Values", async ({ page }) => {
  await page.goto(url + '/register');
  await page.click('input.button');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain('All fields are required!');
    await dialog.accept();
  });

  expect(page.url()).toBe(url + '/register');
});

test("Submit the Form with Empty Email", async ({ page }) => {
  await page.goto(url + '/register');
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirm-pass"]', '123456');
  await page.click('input.button');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain('All fields are required!');
    dialog.accept();
  });

  expect(page.url()).toBe(url + '/register');
});

test("Submit the Form with Empty Password", async ({ page }) => {
  await page.goto(url + '/register');
  await page.fill('input[name="email"]', `peter${new Date().getTime()}@abv.bg`);
  await page.fill('input[name="confirm-pass"]', '123456');
  await page.click('input.button');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain('All fields are required!');
  });

  expect(page.url()).toBe(url + '/register');
});

test("Submit the Form with Empty Confirm Password", async ({ page }) => {
  await page.goto(url + '/register');
  await page.fill('input[name="email"]', `peter${new Date().getTime()}@abv.bg`);
  await page.fill('input[name="password"]', '123456');
  await page.click('input.button');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain('All fields are required!');
    await dialog.accept();
  });

  expect(page.url()).toBe(url + '/register');
});

test("Submit the Form with Different Passwords", async ({ page }) => {
  await page.goto(url + '/register');
  await page.fill('input[name="email"]', `peter${new Date().getTime()}@abv.bg`);
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirm-pass"]', '654321');
  await page.click('input.button');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain("Passwords don't match!");
    await dialog.accept();
  });

  expect(page.url()).toBe(url + '/register');
});


//Test "Add Book" Page (with user, without user is not visible)

test('Submit the Form with Correct Data', async ({ page }) => {
  await loginUser(page);
  await page.goto(url + '/create');

  await page.waitForSelector('#create-form');

  await page.fill('input[name="title"]', `Orcs${new Date().getTime()}`);
  await page.fill('textarea[name="description"]', `There are some orks. ${new Date().getTime()}`);
  await page.fill('input[name="imageUrl"]', 'https://productimages.worldofbooks.com/0575074876.jpg');
  await page.selectOption('select[name="type"]', 'Fiction');
  await page.click('input[type="submit"]');

  await page.waitForURL(url + '/catalog');
  expect(page.url()).toBe(url + '/catalog');
});

test('Submit the Form with Empty Title Field', async ({ page }) => {
  await loginUser(page);
  page.goto(url + '/create');

  await page.waitForSelector('#create-form');

  await page.fill('textarea[name="description"]', `There are some orks. ${new Date().getTime()}`);
  await page.fill('input[name="imageUrl"]', 'https://productimages.worldofbooks.com/0575074876.jpg');
  await page.selectOption('select[name="type"]', 'Fiction');
  await page.click('input[type="submit"]');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.textContent()).toContain('All fields are required!');
    await dialog.accept();
  });

  expect(page.url()).toBe(url + '/create');
});

test('Submit the Form with Empty Description Field', async ({ page }) => {
  await loginUser(page);
  page.goto(url + '/create');

  await page.waitForSelector('#create-form');

  await page.fill('input[name="title"]', `Orcs${new Date().getTime()}`);
  await page.fill('input[name="imageUrl"]', 'https://productimages.worldofbooks.com/0575074876.jpg');
  await page.selectOption('select[name="type"]', 'Fiction');
  await page.click('input[type="submit"]');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.textContent()).toContain('All fields are required!');
    await dialog.accept();
  });

  expect(page.url()).toBe(url + '/create');
});

test('Submit the Form with Empty Image URL Field', async ({ page }) => {
  await loginUser(page);
  page.goto(url + '/create');


  await page.waitForSelector('#create-form');

  await page.fill('input[name="title"]', `Orcs${new Date().getTime()}`);
  await page.fill('textarea[name="description"]', `There are some orks. ${new Date().getTime()}`);
  await page.selectOption('select[name="type"]', 'Fiction');
  await page.click('input[type="submit"]');

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.textContent()).toContain('All fields are required!');
    await dialog.accept();
  });

  expect(page.url()).toBe(url + '/create');
});


