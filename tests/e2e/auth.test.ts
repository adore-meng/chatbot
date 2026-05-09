import { expect, test } from "@playwright/test";

test.describe("Authentication (SSO)", () => {
  test("login route redirects to home (no local login UI)", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/");
  });

  test("register route redirects to home (no local registration UI)", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(page).toHaveURL("/");
  });
});
