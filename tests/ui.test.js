const { test, expect } = require('@playwright/test');

const url = 'http://localhost:3000';
const userEmail = 'john@abv.bg';
const secondUserEmail = 'peter@abv.bg';

async function loginUser(page, user = userEmail) {
  await page.goto(url + '/login');
  await page.fill('input[name="email"]', user);
  await page.fill('input[name="password"]', '123456');
  await Promise.all([
    page.click('input[type="submit"]'),
    page.waitForURL(url + '/catalog')
  ]);
}

//To Do functions for creating and deleting books

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


//Test "All Books" Page

test('Verify That All Books Are Displayed', async ({ page }) => {
  await loginUser(page);
  await page.waitForSelector('.dashboard');

  const bookElements = await page.$$('.other-books-list li');

  expect(bookElements.length).toBeGreaterThan(0);
});

test('Verify That No Books Are Displayed', async ({ page }) => {
  await loginUser(page);
  await page.waitForSelector('.dashboard');

  const noBookMessage = await page.textContent('.no-books');

  expect(noBookMessage).toBe('No books in database!');
});

//Test "Details" Page

test('Verify That Logged-In User Sees Details Button and Button Works Correctly', async ({ page }) => {
  await loginUser(page);
  await page.waitForSelector('.otherBooks');

  const bookTitle = await page.locator('.otherBooks h3').first().textContent();

  await page.click('.otherBooks a.button');

  await page.waitForSelector('.book-information');

  const detailsPageTitle = await page.textContent('.book-information h3');
  expect(detailsPageTitle).toBe(bookTitle);
});

test('Verify That Guest User Sees Details Button and Button Works Correctly', async ({ page }) => {
  await page.goto(url + '/catalog');
  await page.waitForSelector('.otherBooks');
  await page.click('.otherBooks a.button');

  await page.waitForSelector('.book-information');

  const bookInformation = await page.$('.book-information');
  const isBookInformationVisible = await bookInformation.isVisible();

  expect(isBookInformationVisible).toBe(true);
});

test('Verify That All Info Is Displayed Correctly', async ({ page }) => {
  await page.goto(url + '/catalog');
  await page.waitForSelector('.otherBooks');

  const bookTitle = await page.locator('.otherBooks h3').first().textContent();

  await page.click('.otherBooks a.button');

  await page.waitForSelector('#details-page');

  const [
    bookTitleDetails,
    bookType,
    bookImageUrl,
    bookDescription,
    bookAction
  ] = await Promise.all([
    page.textContent('.book-information h3'),
    page.$('p.type'),
    page.$('p.img'),
    page.$('div.book-description'),
    page.$('div.actions')
  ]);

  expect(bookTitleDetails).toBe(bookTitle);
  expect(bookType).not.toBeNull();
  expect(bookImageUrl).not.toBeNull();
  expect(bookDescription).not.toBeNull();
  expect(bookAction).not.toBeNull();

});

test('Verify If Edit and Delete Buttons Are Visible for Creator', async ({ page }) => {
  await loginUser(page);
  await page.waitForSelector('.otherBooks');
  await page.click('.otherBooks a.button');

  await page.waitForSelector('.book-information');

  const editBtn = await page.$('.actions > a:nth-child(1)');
  const isEditBtnVisible = await editBtn.isVisible();

  const deleteBtn = await page.$('.actions > a:nth-child(2)');
  const isDeleteBtnVisible = await deleteBtn.isVisible();

  expect(isEditBtnVisible).toBe(true);
  expect(isDeleteBtnVisible).toBe(true);
});

test('Verify If Edit and Delete Buttons Are Not Visible for Non-Creator', async ({ page }) => {
  await loginUser(page, secondUserEmail);
  await page.waitForSelector('.otherBooks');
  await page.click('.otherBooks a.button');

  await page.waitForSelector('.book-information');

  const editBtn = await page.$$('.actions.button');


  expect(editBtn.length).not.toBe(2);
});

test('Verify If Like Button Is Not Visible for Creator', async ({ page }) => {
  await loginUser(page);
  await page.waitForSelector('.otherBooks');
  await page.click('.otherBooks a.button');

  await page.waitForSelector('.book-information');

  const likeBtn = await page.textContent('.actions a.button');


  expect(likeBtn).not.toBe('Like');
});

test('Verify If Like Button Is Visible for Non-Creator', async ({ page }) => {
  await loginUser(page, secondUserEmail);
  await page.waitForSelector('.otherBooks');
  await page.click('.otherBooks > a.button');

  await page.waitForSelector('.book-information');

  const likeBtn = await page.textContent('.actions > a.button');


  expect(likeBtn).toBe('Like');
});

//Test "Logout" Functionality

test('Verify That the "Logout" Button Is Visible', async ({ page }) => {
  await loginUser(page);
  await page.waitForSelector('nav.navbar');

  const loginBtn = await page.$('#logoutBtn');
  const isLoginBtnVisible = await loginBtn.isVisible();

  expect(isLoginBtnVisible).toBe(true);
});

test('Verify That the "Logout" Button Redirects Correctly', async ({ page }) => {
  await loginUser(page);
  await page.waitForSelector('nav.navbar');

  await page.click('#logoutBtn');

  await page.waitForURL(url + '/catalog');

  expect(page.url()).toBe(url + '/catalog');
});