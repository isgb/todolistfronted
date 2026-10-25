import { test, expect } from "@playwright/test";

// Revisa la app en distintos anchos: desbordamientos, superposiciones y tamaños mínimos.
const PHASE = process.env.PHASE || "after";
const SCREENSHOTS_DIR = "tests/e2e/screenshots/responsive";
const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

const MIN_FONT_SIZE_PX = 12;
const MIN_TAP_TARGET_PX = 32;

const rectsOverlap = (first, second) =>
  first.left < second.right - 1 &&
  first.right > second.left + 1 &&
  first.top < second.bottom - 1 &&
  first.bottom > second.top + 1;

// Recolecta medidas de la UI en el navegador
const measureLayout = (page) =>
  page.evaluate(() => {
    const toRect = (element) => {
      const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
      return { left, right, top, bottom, width, height };
    };
    const all = (selector) => [...document.querySelectorAll(selector)];
    const container = document.querySelector(".task-container");

    return {
      viewportWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      container: toRect(container),
      blocks: all(".card-tasks, .card-task").map(toRect),
      expandButtons: all(".icon-anglesdown").map(toRect),
      cardTexts: all(".card-title, .card-description, .card-task h4").map(toRect),
      tapTargets: all(".icon-anglesdown, .icon-trash, .icon-checkbox, .icon-trash-task, header button").map(toRect),
      fontSizes: all(".card-title, .card-description, .card-task h4, .app-title").map((element) => ({
        text: element.textContent.slice(0, 20),
        size: parseFloat(getComputedStyle(element).fontSize),
      })),
    };
  });

for (const viewport of VIEWPORTS) {
  test(`layout at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("./");
    await expect(page.locator(".container-card-tasks")).toHaveCount(3);

    // Abrir la primera card para revisar también la lista de tareas
    await page.locator(".icon-anglesdown").first().click();
    await expect(page.locator(".card-task")).toHaveCount(4);

    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/${PHASE}-${viewport.width}.png`,
      fullPage: true,
    });

    const layout = await measureLayout(page);

    expect.soft(layout.scrollWidth, "no horizontal page scroll").toBeLessThanOrEqual(layout.viewportWidth);

    const expectedMinWidth = Math.min(layout.viewportWidth - 32, 360);
    expect.soft(layout.container.width, "app container wide enough").toBeGreaterThanOrEqual(expectedMinWidth);

    const blocksOutside = layout.blocks.filter(
      (block) => block.left < layout.container.left - 1 || block.right > layout.container.right + 1
    );
    expect.soft(blocksOutside.length, "cards inside the container").toBe(0);

    const overlappingButtons = layout.expandButtons.filter((button) =>
      layout.cardTexts.some((text) => rectsOverlap(button, text))
    );
    expect.soft(overlappingButtons.length, "expand buttons do not cover text").toBe(0);

    const smallTexts = layout.fontSizes.filter((item) => item.size < MIN_FONT_SIZE_PX);
    expect.soft(smallTexts, "readable font sizes").toEqual([]);

    const smallTargets = layout.tapTargets.filter(
      (target) => target.width < MIN_TAP_TARGET_PX || target.height < MIN_TAP_TARGET_PX
    );
    expect.soft(smallTargets.length, "tap targets >= 32px").toBe(0);
  });
}
