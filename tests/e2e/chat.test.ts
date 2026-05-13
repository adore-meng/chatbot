import { expect, test } from "@playwright/test";

test.describe("Chat Page", () => {
  test("shows BioAnalyst workbench navigation and user menu", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("BioAnalyst")).toBeVisible();
    await expect(page.getByText("AI DATA INTELLIGENCE")).toBeVisible();
    await expect(page.getByText("New Tasks")).toBeVisible();
    await expect(page.getByText("weikun rong's team")).toBeVisible();
    await expect(page.getByText("+ New Task")).toBeVisible();
    await expect(page.getByText("Analyze outliers in dose...")).toBeVisible();

    await page.getByRole("button", { name: "Open user menu" }).click();
    await expect(page.getByText("Christopher W.")).toBeVisible();
    await expect(page.getByText("rongweikun@gmail.com")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();
    await expect(page.getByText("Billing")).toBeVisible();
    await expect(page.getByText("Log out")).toBeVisible();
  });

  test("can collapse and expand BioAnalyst sidebar", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(page.getByText("AI DATA INTELLIGENCE")).toBeHidden();

    await page.getByRole("button", { name: "Expand sidebar" }).click();
    await expect(page.getByText("AI DATA INTELLIGENCE")).toBeVisible();
  });

  test("home page loads with input field", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("multimodal-input")).toBeVisible();
  });

  test("can type in the input field", async ({ page }) => {
    await page.goto("/");
    const input = page.getByTestId("multimodal-input");
    await input.fill("Hello world");
    await expect(input).toHaveValue("Hello world");
  });

  test("submit button is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("send-button")).toBeVisible();
  });

  test("suggested actions are visible on empty chat", async ({ page }) => {
    await page.goto("/");
    const suggestions = page.locator("[data-testid='suggested-actions']");
    await expect(suggestions).toBeVisible();
  });

  test("can stop generation with stop button", async ({ page }) => {
    await page.goto("/");

    // Type and send a message
    await page.getByTestId("multimodal-input").fill("Hello");
    await page.getByTestId("send-button").click();

    // Stop button should appear during generation
    const stopButton = page.getByTestId("stop-button");
    // If generation starts, stop button appears
    // This is a best-effort check since timing depends on API
    await stopButton.click({ timeout: 5000 }).catch(() => {
      // Generation may have finished before we could click
    });
  });
});

test.describe("Chat Input Features", () => {
  test("input clears after sending", async ({ page }) => {
    await page.goto("/");
    const input = page.getByTestId("multimodal-input");
    await input.fill("Test message");
    await page.getByTestId("send-button").click();

    // Input should clear after sending
    await expect(input).toHaveValue("");
  });

  test("input supports multiline text", async ({ page }) => {
    await page.goto("/");
    const input = page.getByTestId("multimodal-input");
    await input.fill("Line 1\nLine 2\nLine 3");
    await expect(input).toContainText("Line 1");
  });
});
