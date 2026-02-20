// helper.js
const { expect, request } = require("@playwright/test");

const backendURL = process.env.TEST_BACKEND_URL || "http://localhost:3004";
const frontendURL = process.env.TEST_FRONTEND_URL || "http://localhost:5173";

const resetDatabase = async () => {
  const api = await request.newContext({ baseURL: backendURL });

  let success = false;
  for (let i = 0; i < 5; i++) {
    try {
      await api.post("/api/testing/reset");
      success = true;
      break;
    } catch (err) {
      await new Promise((res) => setTimeout(res, 300));
    }
  }

  await api.dispose();

  if (!success)
    throw new Error("Could not connect to test backend on port 3004");
};

const createUser = async ({ request, username, name, password }) => {
  await request.post(`${backendURL}/api/users`, {
    data: { username, name, password },
  });
};

const login = async ({ page, username, password }) => {
  const loginRes = await page.request.post(`${backendURL}/api/login`, {
    data: { username, password },
  });

  if (!loginRes.ok()) {
    const text = await loginRes.text();
    throw new Error(`Login failed: ${text}`);
  }

  const user = await loginRes.json();

  await page.addInitScript((value) => {
    window.localStorage.setItem("loggedBlogappUser", value);
  }, JSON.stringify(user));

  for (let i = 0; i < 20; i++) {
    try {
      await page.goto(frontendURL);
      break;
    } catch {
      await page.waitForTimeout(1000);
    }
  }
};

const createBlog = async ({ page, title, author, url }) => {
  await page.getByRole("button", { name: /new blog/i }).click();

  await page.getByPlaceholder("title").fill(title);
  await page.getByPlaceholder("author").fill(author);
  await page.getByPlaceholder("url").fill(url);

  await page.getByRole("button", { name: /create/i }).click();

  const show = page.getByRole("button", { name: /show blogs/i });
  if (await show.isVisible()) {
    await show.click();
  }

  const blogText = `${title} by ${author}`;
  const blog = page.locator(".blog", { hasText: blogText }).first();

  for (let i = 0; i < 8; i++) {
    if (page.isClosed()) throw new Error("Page closed unexpectedly in CI");
    try {
      await blog.waitFor({ state: "visible", timeout: 5000 });
      break;
    } catch (err) {
      await page.waitForTimeout(3000);
    }
  }

  const view = blog.getByRole("button", { name: /view/i });
  if (await view.isVisible()) {
    await view.click();
  }

  return blog;
};

module.exports = {
  backendURL,
  frontendURL,
  resetDatabase,
  createUser,
  login,
  createBlog,
};
