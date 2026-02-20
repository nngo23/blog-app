// blog_app.spec.js
const { test, expect } = require("@playwright/test");
const {
  frontendURL,
  resetDatabase,
  createUser,
  login,
  createBlog,
} = require("./helper");

test.describe("Blog application", () => {
  test.beforeEach(async ({ page, request }) => {
    await resetDatabase({ request });
    await createUser({
      request,
      username: "helminguyen",
      name: "Helmi Nguyen",
      password: "password",
    });
    await page.addInitScript(() => {
      window.BACKEND_PORT = "3004";
    });
    await page.goto(frontendURL);
  });

  test("login with correct credentials", async ({ page }) => {
    await login({ page, username: "helminguyen", password: "password" });
    await expect(page.getByText("Helmi Nguyen")).toBeVisible();
  });

  test("login fails with wrong password", async ({ page }) => {
    await expect(async () => {
      await login({ page, username: "helminguyen", password: "xyzo" });
    }).rejects.toThrow(/invalid username or password/);
  });

  test("when logged in, can create a new blog", async ({ page }) => {
    await login({ page, username: "helminguyen", password: "password" });
    const blog = await createBlog({
      page,
      title: "Beauty blog",
      author: "Author A",
      url: "http://www.beautyblog.fi",
    });

    // Confirm blog is visible
    await expect(blog).toBeVisible();
    await expect(blog.getByText(/likes \d+/i)).toBeVisible();
  });

  test("when logged in, a blog can be liked", async ({ page }) => {
    await login({ page, username: "helminguyen", password: "password" });

    const blog = await createBlog({
      page,
      title: "Travel Blog",
      author: "Author XY",
      url: "http://www.travelblog.fi",
    });

    const likeButton = blog.getByRole("button", { name: /like/i });
    await expect(likeButton).toBeVisible({ timeout: 10000 });

    // Click like and check counter increments
    await likeButton.click();

    const likesCounter = blog.getByText(/likes 1/i);
    await expect(likesCounter).toBeVisible({ timeout: 10000 });
  });
});
