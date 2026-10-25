import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

// Corre con playwright.realdb.config.js. DB_TARGET=local|atlas
const DB_TARGET = process.env.DB_TARGET || "local";
const BACKEND_DIR = path.resolve("../todolistbackend");
const SCREENSHOTS_ROOT = `tests/realdb/screenshots/${DB_TARGET}`;

const getScreenshotsDir = () => {
  const projectName = test.info().project.name;
  return projectName === "edge" ? SCREENSHOTS_ROOT : `${SCREENSHOTS_ROOT}/${projectName}`;
};

// mongoose y dotenv se toman del backend para no agregarlos al frontend
const requireFromBackend = createRequire(path.join(BACKEND_DIR, "index.js"));
const mongoose = requireFromBackend("mongoose");
const dotenv = requireFromBackend("dotenv");

const getMongoUri = () => {
  if (DB_TARGET === "local") return "mongodb://127.0.0.1:27017/app_todolist";
  return dotenv.parse(fs.readFileSync(path.join(BACKEND_DIR, ".env"))).MONGO_URI;
};

let database;
let createdCardId;

test.beforeAll(async () => {
  database = await mongoose.createConnection(getMongoUri()).asPromise();
});

// Borra lo que haya creado la prueba, incluso si falló a la mitad
test.afterAll(async () => {
  if (createdCardId) {
    const cardObjectId = new mongoose.Types.ObjectId(createdCardId);
    await database.collection("cardtasks").deleteOne({ _id: cardObjectId });
    await database.collection("task").deleteMany({ cardTasksId: cardObjectId });
  }
  await database?.close();
});

const readCardFromDatabase = async (cardId) => {
  const cardObjectId = new mongoose.Types.ObjectId(cardId);
  const card = await database
    .collection("cardtasks")
    .findOne({ _id: cardObjectId }, { projection: { __v: 0 } });
  const tasks = await database
    .collection("task")
    .find({ cardTasksId: cardObjectId }, { projection: { __v: 0, cardTasksId: 0 } })
    .toArray();
  return { cardtasks: card, task: tasks };
};

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Captura con la app a la izquierda y el documento de Mongo a la derecha
const saveStepScreenshot = async (page, fileName, stepTitle, databaseState) => {
  const appImage = (await page.screenshot()).toString("base64");
  const reportPage = await page.context().newPage();
  await reportPage.setViewportSize({ width: 1600, height: 800 });
  await reportPage.setContent(`
    <body style="margin:0;font-family:Segoe UI,sans-serif;background:#1e1e1e;color:#eee">
      <h2 style="margin:12px 16px">${escapeHtml(stepTitle)} · Mongo ${DB_TARGET}</h2>
      <div style="display:flex;gap:16px;padding:0 16px 16px">
        <img src="data:image/png;base64,${appImage}" style="width:58%;border:1px solid #444;align-self:flex-start">
        <pre style="flex:1;margin:0;padding:12px;background:#111;border:1px solid #444;font-size:13px;white-space:pre-wrap">${escapeHtml(JSON.stringify(databaseState, null, 2))}</pre>
      </div>
    </body>`);
  await reportPage.screenshot({ path: `${getScreenshotsDir()}/${fileName}.png`, fullPage: true });
  await reportPage.close();
};

test("lo que se hace en la app queda guardado en Mongo", async ({ page }) => {
  const uniqueTitle = `Prueba Playwright ${DB_TARGET} ${Date.now()}`;
  const newDescription = "Descripción guardada por Playwright";

  await page.goto("./");
  await expect(page.locator(".container-card-tasks").first()).toBeVisible();

  // 1. Crear card
  const cardSaved = page.waitForResponse((response) => response.url().includes("/cardtasks/save"));
  await page.getByRole("button", { name: "Create a new task list" }).click();
  createdCardId = (await (await cardSaved).json()).cardtasks._id;
  const newCard = page.locator(".container-card-tasks").first();
  await expect(newCard.locator(".card-title")).toHaveText("New Tasks List");
  await saveStepScreenshot(page, "01-card-creada", "1. Card creada", await readCardFromDatabase(createdCardId));

  // 2. Editar título y descripción
  await newCard.locator(".card-title").click();
  await newCard.locator(".card-information input").fill(uniqueTitle);
  await newCard.locator(".card-information input").press("Enter");
  const card = page.locator(".container-card-tasks").filter({ hasText: uniqueTitle });
  await card.locator(".card-description").click();
  await card.locator(".card-information textarea").fill(newDescription);
  await card.locator(".card-information textarea").blur();
  await expect.poll(async () => (await readCardFromDatabase(createdCardId)).cardtasks?.description).toBe(newDescription);
  await expect.poll(async () => (await readCardFromDatabase(createdCardId)).cardtasks?.title).toBe(uniqueTitle);
  await saveStepScreenshot(page, "02-card-editada", "2. Título y descripción editados", await readCardFromDatabase(createdCardId));

  // 3. Agregar una tarea y editar su texto (con la card abierta el botón es "+")
  await card.locator(".icon-anglesdown").click();
  const taskSaved = page.waitForResponse((response) => response.url().includes("/tasks/save"));
  await card.locator(".icon-trash").click();
  await taskSaved;
  await card.locator(".card-task h4").click();
  await card.locator(".card-task input").fill("Comprar café");
  await card.locator(".card-task input").press("Enter");
  await expect.poll(async () => (await readCardFromDatabase(createdCardId)).task[0]?.description).toBe("Comprar café");
  await saveStepScreenshot(page, "03-tarea-creada", "3. Tarea agregada y editada", await readCardFromDatabase(createdCardId));

  // 4. Marcar la tarea como completada
  await card.locator(".card-task .icon-checkbox").click();
  await expect.poll(async () => (await readCardFromDatabase(createdCardId)).task[0]?.isCompleted).toBe(true);
  await saveStepScreenshot(page, "04-tarea-completada", "4. Tarea completada", await readCardFromDatabase(createdCardId));

  // 5. Borrar la card (cerrada, el botón es "borrar")
  await card.locator(".icon-anglesdown").click();
  await card.locator(".icon-trash").click();
  await card.getByRole("button", { name: "Delete list" }).click();
  await expect.poll(async () => (await readCardFromDatabase(createdCardId)).cardtasks).toBeNull();
  await expect(card).toHaveCount(0);
  const stateAfterDelete = await readCardFromDatabase(createdCardId);
  await saveStepScreenshot(page, "05-card-eliminada", "5. Card eliminada", stateAfterDelete);
  expect(stateAfterDelete.task, "tareas huérfanas tras borrar la card").toHaveLength(0);
});
