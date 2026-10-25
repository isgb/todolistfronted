# Guía de pruebas

El proyecto tiene tres niveles de comprobación. Las dos primeras no tocan ninguna base de datos.

| Tipo | Comando | Qué usa | ¿Escribe datos? |
|---|---|---|---|
| Lint | `npm run lint` | ESLint | No |
| End-to-end con datos simulados | `npm run test:e2e` | App con `VITE_USE_MOCKS=true` | No |
| Con backend y MongoDB reales | `npx playwright test --config playwright.realdb.config.js` | App, backend y MongoDB | **Sí**, datos temporales |

Todas las pruebas de Playwright usan el Microsoft Edge instalado en el sistema.

## Pruebas con datos simulados

Configuración: `playwright.config.js`. Levanta la app en el puerto 5199 con la API simulada de `src/mocks`, así que no hay peticiones reales.

Verifican en la interfaz:

- `tests/e2e/app.spec.js`:
  - Muestra la lista de tarjetas.
  - Marca una tarea y el porcentaje se actualiza.
  - Agrega y edita una tarea.
  - Borra una tarea.
  - Edita el título y la descripción de una tarjeta.
  - Crea y borra tarjetas, con la confirmación.
  - En vista móvil, abre una tarjeta y muestra sus tareas.
  - Muestra el mensaje de error cuando falla la carga.
  - En los casos con datos válidos, no aparecen errores en la consola.
- `tests/e2e/responsive.spec.js`, en anchos de 320 px a 1920 px:
  - No hay scroll horizontal.
  - Las tarjetas quedan dentro del contenedor.
  - Los botones no tapan texto.
  - Los textos miden al menos 12 px.
  - Los botones táctiles miden al menos 32 px.

Las capturas se guardan en `tests/e2e/screenshots/`, que está versionada, con el prefijo `after-` por defecto. Para generar capturas de referencia con el prefijo `before-`:

```powershell
$env:PHASE = "before"; npx playwright test; Remove-Item Env:PHASE
```

## Pruebas con backend y MongoDB reales

Configuración: `playwright.realdb.config.js`. Se ejecutan en dos perfiles: escritorio (`edge`) y móvil (`edge-mobile`).

### Qué verifican

Cada prueba actúa en la interfaz, espera la respuesta real de la API y comprueba el resultado **consultando MongoDB directamente**, no a través de la API.

- `tests/realdb/realdb.spec.js`. Recorre este flujo y verifica en la base cada paso:
  1. Crear una tarjeta.
  2. Editar su título y descripción.
  3. Agregar una tarea y editar su texto.
  4. Completar la tarea.
  5. Borrar la tarjeta.

  Al final comprueba que no queden tareas de esa tarjeta. Guarda capturas con la app junto al documento leído de MongoDB.
- `tests/realdb/optimistic.spec.js`. Comprueba las actualizaciones optimistas:
  - **Respuestas retrasadas:** Playwright retrasa 2 s las respuestas. La pantalla debe cambiar en menos de 500 ms, un doble clic debe enviar una sola petición y la base debe terminar igual que la pantalla.
  - **Errores simulados:** Playwright responde 500 sin llamar al servidor. El cambio debe revertirse, mostrar un mensaje y la base no debe cambiar.
  - **Carga de la lista:** crear una tarjeta mientras la lista carga no la pierde, y una respuesta vieja de la lista no la borra.
  - **Tiempos reales:** registra en consola cuánto tarda la pantalla y cuánto el servidor.

### Datos que crean

Las pruebas crean tarjetas y tareas temporales y las borran al terminar, aunque fallen. `optimistic.spec.js` inserta su tarjeta inicial directamente en MongoDB.

Las capturas se guardan en `tests/realdb/screenshots/<destino>/`, que está ignorada por git porque puede contener datos de la base.

### Requisitos

- El repositorio del backend clonado en la carpeta vecina `../todolistbackend`, con `npm install` hecho. Las pruebas toman `mongoose` de ahí.
- Para el destino `local`: MongoDB corriendo en `127.0.0.1:27017`.

### Destino local (por defecto)

```powershell
npx playwright test --config playwright.realdb.config.js
```

Sin `DB_TARGET`, el destino es `local`:
- Levanta el backend de `../todolistbackend` en el puerto 3973, conectado a `mongodb://127.0.0.1:27017/app_todolist`.
- Levanta la app en el puerto 5198, apuntando a ese backend.

> **Pendiente:** la base `app_todolist` es la misma que se usa para desarrollar en local. Lo recomendable es una base exclusiva para pruebas, pero hoy el nombre está fijo en `playwright.realdb.config.js` y en los archivos de `tests/realdb/`.

### Destinos que modifican producción

> **Advertencia:** estos destinos escriben datos temporales en la base de producción. Ejecútalos solo de forma deliberada y en una terminal nueva.

`DB_TARGET` acepta dos valores más:

| Valor | Backend | Base de datos |
|---|---|---|
| `atlas` | El de `../todolistbackend`, levantado en local | La de `MONGO_URI` en `../todolistbackend/.env` |
| `prod` | El desplegado en Vercel | La de `MONGO_URI` en `../todolistbackend/.env`, que debe ser la de producción |

Con `atlas` solo corre `realdb.spec.js`; `optimistic.spec.js` se omite. Con `prod`, Playwright espera hasta 15 s por cada comprobación, para tolerar la latencia de la red.

En PowerShell, la variable sigue activa en la sesión hasta que la borres. Hazlo siempre al terminar, para que la siguiente ejecución no vaya a producción por accidente:

```powershell
$env:DB_TARGET = "prod"
npx playwright test --config playwright.realdb.config.js
Remove-Item Env:DB_TARGET
```
