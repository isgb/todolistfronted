import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

// Corre con playwright.realdb.config.js contra local o prod (escribe datos de prueba y los borra)
const DB_TARGET = process.env.DB_TARGET || "local";
const BACKEND_DIR = path.resolve("../todolistbackend");
const SCREENSHOTS_ROOT = `tests/realdb/screenshots/${DB_TARGET}`;
let SCREENSHOTS_DIR = SCREENSHOTS_ROOT;
const requireFromBackend = createRequire(path.join(BACKEND_DIR, "index.js"));
const mongoose = requireFromBackend("mongoose");
const dotenv = requireFromBackend("dotenv");

const getMongoUri = () => {
  if (DB_TARGET === "local") return "mongodb://127.0.0.1:27017/app_todolist";
  return dotenv.parse(fs.readFileSync(path.join(BACKEND_DIR, ".env"))).MONGO_URI;
};

const SERVER_DELAY_MS = 2000;
const INSTANT_MS = 500;

let database;
let cardId;
let cardTitle;

test.skip(!["local", "prod"].includes(DB_TARGET), "Solo se ejecuta contra local o prod");

test.beforeAll(async () => {
  database = await mongoose.createConnection(getMongoUri()).asPromise();
});

test.afterAll(async () => {
  await database?.close();
});

test.beforeEach(async ({ page }, testInfo) => {
  SCREENSHOTS_DIR = testInfo.project.name === "edge" ? SCREENSHOTS_ROOT : `${SCREENSHOTS_ROOT}/${testInfo.project.name}`;
  cardTitle = `Optimista ${Date.now()}`;
  const { insertedId } = await database.collection("cardtasks").insertOne({
    title: cardTitle,
    description: "Prueba de velocidad",
    created_at: new Date(),
  });
  cardId = insertedId;
  await database.collection("task").insertOne({
    cardTasksId: cardId,
    description: "Tarea original",
    isCompleted: false,
    created_at: new Date(),
  });

  await page.goto("./");
  await getCard(page).locator(".icon-anglesdown").click();
  await expect(getCard(page).locator(".card-task")).toHaveCount(1);
});

// Cards creadas desde la app durante una prueba, para borrarlas al final
let createdCardIds = [];

test.afterEach(async () => {
  const cardIdsToDelete = [cardId, ...createdCardIds.map((id) => new mongoose.Types.ObjectId(id))];
  await database.collection("cardtasks").deleteMany({ _id: { $in: cardIdsToDelete } });
  await database.collection("task").deleteMany({ cardTasksId: { $in: cardIdsToDelete } });
  createdCardIds = [];
});

const getCard = (page) => page.locator(".container-card-tasks").filter({ hasText: cardTitle });
const getOriginalTask = (page) => getCard(page).locator(".card-task").filter({ hasText: "Tarea original" });
const readTasksFromDatabase = () => database.collection("task").find({ cardTasksId: cardId }).toArray();

const countRequests = (page, method, urlPart) => {
  const counter = { total: 0 };
  page.on("request", (request) => {
    if (request.method() === method && request.url().includes(urlPart)) counter.total += 1;
  });
  return counter;
};

test("con el servidor lento, la pantalla se actualiza al instante y sin duplicados", async ({ page }) => {
  await page.route("**/api/tasks/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, SERVER_DELAY_MS));
    await route.continue();
  });
  const updateRequests = countRequests(page, "PUT", "/tasks/update/");
  const deleteRequests = countRequests(page, "DELETE", "/tasks/remove/");
  const card = getCard(page);

  // Crear tarea
  const taskSaved = page.waitForResponse((response) => response.url().includes("/tasks/save"));
  await card.locator(".icon-trash").click();
  await expect(card.locator(".card-task")).toHaveCount(2, { timeout: INSTANT_MS });
  await taskSaved;
  await expect.poll(async () => (await readTasksFromDatabase()).length).toBe(2);

  // Marcar con doble clic rápido: una sola petición y estado final marcado
  const checkbox = getOriginalTask(page).locator(".icon-checkbox");
  await checkbox.click();
  await checkbox.click();
  await expect(checkbox).toHaveClass(/color-check-change/, { timeout: INSTANT_MS });
  await expect(card).toContainText("50%", { timeout: INSTANT_MS });
  await expect.poll(async () => (await readTasksFromDatabase()).find((task) => task.description === "Tarea original")?.isCompleted).toBe(true);
  expect(updateRequests.total).toBe(1);

  // Desmarcar
  await checkbox.click();
  await expect(checkbox).toHaveClass(/color-check-principal/, { timeout: INSTANT_MS });
  await expect.poll(async () => (await readTasksFromDatabase()).find((task) => task.description === "Tarea original")?.isCompleted).toBe(false);

  // Borrar: desaparece al instante y una sola petición
  const deleteButton = getOriginalTask(page).locator(".icon-trash-task");
  await deleteButton.click();
  await expect(getOriginalTask(page)).toHaveCount(0, { timeout: INSTANT_MS });
  await expect.poll(async () => (await readTasksFromDatabase()).length).toBe(1);
  expect(deleteRequests.total).toBe(1);

  await page.screenshot({ path: `${SCREENSHOTS_DIR}/optimista-ok.png` });
});

// Mide el tiempo hasta que cambia la pantalla y hasta que responde el servidor
const measureAction = async (page, urlPart, action, screenUpdated) => {
  const serverResponse = page.waitForResponse((response) => response.url().includes(urlPart));
  const startTime = Date.now();
  await action();
  await screenUpdated();
  const screenMs = Date.now() - startTime;
  await serverResponse;
  return { screenMs, serverMs: Date.now() - startTime };
};

test("tiempos reales sin retraso artificial: pantalla vs servidor", async ({ page }) => {
  const card = getCard(page);
  const checkbox = getOriginalTask(page).locator(".icon-checkbox");

  const results = {
    crear: await measureAction(
      page,
      "/tasks/save",
      () => card.locator(".icon-trash").click(),
      () => expect(card.locator(".card-task")).toHaveCount(2)
    ),
    marcar: await measureAction(
      page,
      "/tasks/update/",
      () => checkbox.click(),
      () => expect(checkbox).toHaveClass(/color-check-change/)
    ),
    borrar: await measureAction(
      page,
      "/tasks/remove/",
      () => getOriginalTask(page).locator(".icon-trash-task").click(),
      () => expect(getOriginalTask(page)).toHaveCount(0)
    ),
  };

  for (const [flow, { screenMs, serverMs }] of Object.entries(results)) {
    console.log(`[${DB_TARGET}] ${flow}: pantalla ${screenMs} ms · servidor ${serverMs} ms`);
  }
  await expect.poll(async () => (await readTasksFromDatabase()).length).toBe(1);
});

test("si el servidor falla, se revierte el cambio y se muestra un mensaje", async ({ page }) => {
  await page.route("**/api/tasks/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({ status: 500, contentType: "application/json", body: '{"status":"error"}' });
  });
  const card = getCard(page);
  const errorMessage = card.locator(".tasks-error");

  // Marcar falla: vuelve a desmarcada
  const checkbox = getOriginalTask(page).locator(".icon-checkbox");
  await checkbox.click();
  await expect(checkbox).toHaveClass(/color-check-principal/);
  await expect(errorMessage).toHaveText(/could not update/i);

  // Borrar falla: la tarea vuelve a aparecer
  await getOriginalTask(page).locator(".icon-trash-task").click();
  await expect(getOriginalTask(page)).toHaveCount(1);
  await expect(errorMessage).toHaveText(/could not delete/i);

  // Crear falla: la tarea temporal desaparece
  await card.locator(".icon-trash").click();
  await expect(errorMessage).toHaveText(/could not create/i);
  await expect(card.locator(".card-task")).toHaveCount(1);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/optimista-error.png` });

  // La base no cambió
  const tasks = await readTasksFromDatabase();
  expect(tasks).toHaveLength(1);
  expect(tasks[0].isCompleted).toBe(false);
});

const delayServer = (page, urlPattern) =>
  page.route(urlPattern, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, SERVER_DELAY_MS));
    await route.continue();
  });

const failServer = (page, urlPattern) =>
  page.route(urlPattern, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({ status: 500, contentType: "application/json", body: '{"status":"error"}' });
  });

const editOriginalTaskText = async (page, newText) => {
  await getOriginalTask(page).locator("h4").click();
  await getCard(page).locator(".card-task input").fill(newText);
  await getCard(page).locator(".card-task input").press("Enter");
};

test("editar el texto de una tarea: instantáneo con servidor lento", async ({ page }) => {
  await delayServer(page, "**/api/tasks/**");
  await editOriginalTaskText(page, "Texto editado");
  await expect(getCard(page).locator(".card-task h4")).toHaveText("Texto editado", { timeout: INSTANT_MS });
  await expect.poll(async () => (await readTasksFromDatabase())[0]?.description).toBe("Texto editado");
});

test("editar el texto de una tarea: si falla, vuelve al texto anterior con mensaje", async ({ page }) => {
  await failServer(page, "**/api/tasks/**");
  await editOriginalTaskText(page, "Texto que no se guarda");
  await expect(getCard(page).locator(".tasks-error")).toHaveText(/could not update/i);
  await expect(getCard(page).locator(".card-task h4")).toHaveText("Tarea original");
  expect((await readTasksFromDatabase())[0].description).toBe("Tarea original");
});

const cardsCount = (page) => page.locator(".container-card-tasks");

test("crear y borrar tarjetas: instantáneo con servidor lento", async ({ page }) => {
  await delayServer(page, "**/api/cardtasks/save");
  await delayServer(page, "**/api/cardtasks/remove/**");
  const initialCount = await cardsCount(page).count();

  const cardSaved = page.waitForResponse((response) => response.url().includes("/cardtasks/save"));
  await page.getByRole("button", { name: "Create a new task list" }).click();
  await expect(cardsCount(page)).toHaveCount(initialCount + 1, { timeout: INSTANT_MS });
  const newCardId = (await (await cardSaved).json()).cardtasks._id;
  createdCardIds.push(newCardId);
  await expect(cardsCount(page)).toHaveCount(initialCount + 1);

  const card = getCard(page);
  await card.locator(".icon-anglesdown").click();
  await card.locator(".icon-trash").click();
  await card.getByRole("button", { name: "Delete list" }).click();
  await expect(card).toHaveCount(0, { timeout: INSTANT_MS });
  await expect.poll(() => database.collection("cardtasks").countDocuments({ _id: cardId })).toBe(0);
});

test("crear una tarjeta mientras carga la lista no la pierde", async ({ page }) => {
  await delayServer(page, "**/api/cardtasks/list");
  await page.reload();
  const newButton = page.getByRole("button", { name: "Create a new task list" });
  await expect(newButton).toBeDisabled();

  const cardSaved = page.waitForResponse((response) => response.url().includes("/cardtasks/save"));
  await newButton.click();
  createdCardIds.push((await (await cardSaved).json()).cardtasks._id);

  await expect(page.locator(".card-title").first()).toHaveText("New Tasks List");
  await expect(cardsCount(page)).toHaveCount(await database.collection("cardtasks").countDocuments());
});

// En desarrollo StrictMode carga la lista dos veces. La primera se pide al servidor
// de inmediato (sin la card nueva) pero su respuesta se entrega tarde a propósito.
test("una respuesta vieja de la lista no borra una tarjeta recién creada", async ({ page }) => {
  let listRequests = 0;
  await page.route("**/api/cardtasks/list", async (route) => {
    listRequests += 1;
    const isFirstRequest = listRequests === 1;
    const response = await route.fetch();
    if (isFirstRequest) await new Promise((resolve) => setTimeout(resolve, SERVER_DELAY_MS));
    await route.fulfill({ response });
  });
  let listResponses = 0;
  const bothListsLoaded = page.waitForResponse(
    (response) => response.url().includes("/cardtasks/list") && ++listResponses === 2
  );
  await page.reload();

  const cardSaved = page.waitForResponse((response) => response.url().includes("/cardtasks/save"));
  await page.getByRole("button", { name: "Create a new task list" }).click();
  createdCardIds.push((await (await cardSaved).json()).cardtasks._id);
  await bothListsLoaded;
  await page.waitForLoadState("networkidle");

  expect(listRequests).toBe(2);
  await expect(page.locator(".card-title").first()).toHaveText("New Tasks List");
  await expect(cardsCount(page)).toHaveCount(await database.collection("cardtasks").countDocuments());
});

test("crear y borrar tarjetas: si falla, se revierte con mensaje", async ({ page }) => {
  await failServer(page, "**/api/cardtasks/save");
  await failServer(page, "**/api/cardtasks/remove/**");
  const initialCount = await cardsCount(page).count();
  const cardsError = page.locator(".cards-error");

  await page.getByRole("button", { name: "Create a new task list" }).click();
  await expect(cardsError).toHaveText(/could not create/i);
  await expect(cardsCount(page)).toHaveCount(initialCount);

  const card = getCard(page);
  await card.locator(".icon-anglesdown").click();
  await card.locator(".icon-trash").click();
  await card.getByRole("button", { name: "Delete list" }).click();
  await expect(cardsError).toHaveText(/could not delete/i);
  await expect(card).toHaveCount(1);
  expect(await database.collection("cardtasks").countDocuments({ _id: cardId })).toBe(1);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/optimista-cards-error.png` });
});
