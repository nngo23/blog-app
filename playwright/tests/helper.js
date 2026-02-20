// helper.js
const { expect, request } = require("@playwright/test");

const backendURL = process.env.TEST_BACKEND_URL || "http://localhost:3004";
const frontendURL = process.env.TEST_FRONTEND_URL || "http://localhost:5173";

// Reset the backend database
const resetDatabase = async () => {
  const api = await request.newContext({ baseURL: backendURL });

  let success = false;
  for (let i = 0; i < 5; i++) {
    try {
      await api.post("/api/testing/reset");
      success = true;
      break;
    } catch {
      await new Promise((res) => setTimeout(res, 300));
    }
  }

  await api.dispose();

  if (!success)
    throw new Error("Could not connect to test backend on port 3004");
};

// Create a user
const createUser = async ({ request, username, name, password }) => {
  await request.post(`${backendURL}/api/users`, {
    data: { username, name, password },
  });
};

// Login user and set localStorage
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

  // Retry navigating to frontend for flaky CI
  for (let i = 0; i < 20; i++) {
    try {
      await page.goto(frontendURL);
      break;
    } catch {
      await page.waitForTimeout(1000);
    }
  }
};

// Create a blog with robust waits
const createBlog = async ({ page, title, author, url }) => {
  await page.getByRole("button", { name: /new blog/i }).click();

  // Fill blog form
  await page.getByPlaceholder("title").fill(title);
  await page.getByPlaceholder("author").fill(author);
  await page.getByPlaceholder("url").fill(url);

  // Submit
  await page.getByRole("button", { name: /create/i }).click();

  // Show blogs if needed
  const show = page.getByRole("button", { name: /show blogs/i });
  if (await show.isVisible({ timeout: 3000 }).catch(() => false)) {
    await show.click();
  }

  const blogText = `${title} by ${author}`;
  const blog = page.locator(".blog", { hasText: blogText }).first();

  // Wait for the blog to appear
  await expect(blog).toHaveCount(1, { timeout: 30000 });

  // Wait for the "view" button and click
  const viewButton = blog.getByRole("button", { name: /view/i });
  if ((await viewButton.count()) > 0) {
    await expect(viewButton.first()).toBeVisible({ timeout: 10000 });
    await viewButton.first().click();
  }

  // Wait for likes counter
  const likes = blog.getByText(/likes \d+/i);
  await expect(likes).toBeVisible({ timeout: 15000 });

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
