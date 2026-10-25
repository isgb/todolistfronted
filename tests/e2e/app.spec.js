import { test, expect } from "@playwright/test";

// Las pruebas corren con VITE_USE_MOCKS=true (ver playwright.config.js).
// PHASE=before|after define el prefijo de las capturas.
const PHASE = process.env.PHASE || "after";
const SCREENSHOTS_DIR = "tests/e2e/screenshots";

const takeScreenshot = (page, name) =>
  page.screenshot({ path: `${SCREENSHOTS_DIR}/${PHASE}-${name}.png`, fullPage: true });

const getCard = (page, title) =>
  page.locator(".container-card-tasks").filter({ hasText: title });

const expandCard = async (card) => {
  await card.locator(".icon-anglesdown").click();
};

let consoleErrors = [];

test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
});

test.describe("with working API (mocks)", () => {
  test.afterEach(() => {
    expect(consoleErrors, "console errors").toEqual([]);
  });

  test("shows the list of cards", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator(".container-card-tasks")).toHaveCount(3);
    await expect(getCard(page, "Sprint planning")).toContainText("50%");
    await takeScreenshot(page, "01-home");
  });

  test("expands a card and toggles a task", async ({ page }) => {
    await page.goto("./");
    const card = getCard(page, "Sprint planning");
    await expandCard(card);
    await expect(card.locator(".card-task")).toHaveCount(4);

    const task = card.locator(".card-task").filter({ hasText: "Define sprint goal" });
    await task.locator(".icon-checkbox").click();
    await expect(task.locator(".icon-checkbox")).toHaveClass(/color-check-change/);
    await expect(task.locator("h4")).toHaveClass(/text-decoration-line-through/);
    await expect(card).toContainText("75%");
    await takeScreenshot(page, "02-toggle-task");
  });

  test("adds a task and edits its description", async ({ page }) => {
    await page.goto("./");
    const card = getCard(page, "Portfolio website");
    await expandCard(card);
    await card.locator(".icon-trash").click(); // con la card abierta el botón es "+"
    await expect(card.locator(".card-task")).toHaveCount(1);
    // La tarea aparece al instante pero acepta acciones cuando el servidor confirma su id
    await expect(card.locator(".card-task")).toHaveAttribute("aria-busy", "false");

    await card.locator(".card-task h4").click();
    await card.locator(".card-task input").fill("Upload project screenshots");
    await card.locator(".card-task input").press("Enter");
    await expect(card.locator(".card-task h4")).toHaveText("Upload project screenshots");
    await takeScreenshot(page, "03-add-edit-task");
  });

  test("deletes a task", async ({ page }) => {
    await page.goto("./");
    const card = getCard(page, "Groceries");
    await expandCard(card);
    await card.locator(".card-task").filter({ hasText: "Oat milk" }).locator(".icon-trash-task").click();
    await expect(card.locator(".card-task")).toHaveCount(2);
    await expect(card).not.toContainText("Oat milk");
    await expect(card).toContainText("0%");
  });

  test("edits a card title and description", async ({ page }) => {
    await page.goto("./");
    const card = page.locator(".container-card-tasks").first(); // el título cambia durante la prueba
    await card.locator(".card-title").click();
    await card.locator(".card-information input").fill("Sprint 12 planning");
    await card.locator(".card-information input").press("Enter");
    await card.locator(".card-description").click();
    await card.locator(".card-information textarea").fill("Updated description");
    await card.locator(".card-information textarea").blur();

    await expect(page.locator(".card-title").first()).toHaveText("Sprint 12 planning");
    await expect(page.locator(".card-description").first()).toHaveText("Updated description");
    await takeScreenshot(page, "04-edit-card");
  });

  test("creates and deletes cards", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "Create a new task list" }).click();
    await expect(page.locator(".container-card-tasks")).toHaveCount(4);
    await expect(page.locator(".card-title").first()).toHaveText("New Tasks List");

    const cardToDelete = getCard(page, "Portfolio website");
    await cardToDelete.locator(".icon-trash").click();
    await cardToDelete.getByRole("button", { name: "Cancel" }).click();
    await expect(page.locator(".container-card-tasks")).toHaveCount(4);

    await cardToDelete.locator(".icon-trash").click();
    await expect(cardToDelete.locator(".card-delete-confirm")).toBeVisible();
    await takeScreenshot(page, "05-delete-confirm");
    await cardToDelete.getByRole("button", { name: "Delete list" }).click();
    await expect(page.locator(".container-card-tasks")).toHaveCount(3);
    await takeScreenshot(page, "05-create-delete-card");
  });

  test("mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("./");
    await expandCard(getCard(page, "Sprint planning"));
    await expect(page.locator(".card-task")).toHaveCount(4);
    await takeScreenshot(page, "06-mobile");
  });
});

test("shows an error message when the API fails", async ({ page }) => {
  await page.goto("./?mockError=1");
  await expect(page.getByText(/could not load/i)).toBeVisible();
  await takeScreenshot(page, "07-api-error");
});
