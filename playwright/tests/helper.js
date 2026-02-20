import { request } from "@playwright/test";

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
  if (await show.isVisible({ timeout: 3000 }).catch(() => false))
    await show.click();

  const blogText = `${title} by ${author}`;
  const blog = page.locator(".blog", { hasText: blogText }).first();

  // Wait for the blog element to be visible
  await expect(blog).toHaveCount(1, { timeout: 30000 });

  const viewButton = blog.getByRole("button", { name: /view/i });
  if ((await viewButton.count()) > 0) {
    await viewButton.click();
  }

  // Wait for likes counter
  const likes = blog.locator("text=/likes \\d+/i");
  await expect
    .poll(async () => await likes.textContent().catch(() => ""), {
      timeout: 15000,
    })
    .toMatch(/likes 0/);

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
