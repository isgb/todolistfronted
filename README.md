# Todo List App — Frontend

Aplicación web de tareas organizada en **tarjetas**. Cada tarjeta es una lista con título, descripción, indicador circular de progreso y tareas que se marcan como completadas.

- App publicada: https://isgb.github.io/todolistfronted/
- Backend (API REST con Express y MongoDB): [isgb/todolistbackend](https://github.com/isgb/todolistbackend)

## Funcionalidades

- Crear, editar (título y descripción) y borrar tarjetas, con confirmación antes de borrar.
- Agregar, editar, marcar/desmarcar y borrar tareas dentro de cada tarjeta.
- Progreso de cada tarjeta en porcentaje.
- Actualizaciones optimistas: los cambios se muestran al instante. Si la petición al servidor falla, el cambio se revierte y aparece un mensaje.
- Estados de carga, error con botón de reintento y lista vacía.
- Edición desde teclado y diseño adaptable de 320 px a 1920 px de ancho.

## Tecnologías

React 19, Vite 6, Axios, Bootstrap 5, Font Awesome, react-circular-progressbar y Playwright para pruebas end-to-end.

## Requisitos

- Node.js y npm (el proyecto se probó con Node.js 20.19).
- Microsoft Edge, solo para las pruebas: Playwright usa el Edge instalado en el sistema.

## Instalación

```bash
git clone https://github.com/isgb/todolistfronted.git
cd todolistfronted
npm install
```

## Configuración

> **Importante:** sin configuración, la app usa la **API de producción**, también con `npm run dev`. Todo lo que crees, edites o borres en local cambiará los datos reales.

Para desarrollar, crea un archivo `.env.development.local` en la raíz del proyecto. Este archivo solo se aplica a `npm run dev` y está ignorado por git. Elige una de estas opciones:

```bash
# Opción 1 (recomendada): datos simulados, sin backend
VITE_USE_MOCKS=true
```

```bash
# Opción 2: backend en local (ver el README del backend)
VITE_USE_MOCKS=false
VITE_API_URL=http://localhost:3000/api
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_USE_MOCKS` | `true` usa la API simulada de `src/mocks` | `false` |
| `VITE_API_URL` | URL base de la API. Usa el puerto definido en `PORT` del backend | API de producción |

Con los datos simulados:
- Los cambios viven en memoria y se reinician al recargar la página.
- Cada respuesta tiene unos 300 ms de retraso.
- Agregar `?mockError=1` a la URL simula un error al cargar la lista.

`.env.example` sugiere usar `.env.local`. Ese archivo también lo lee `npm run build`, así que afectaría el sitio publicado. Para desarrollar, usa `.env.development.local`.

## Uso

```bash
npm run dev
```

Abre http://localhost:5173/todolistfronted/

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila la app en `dist/` |
| `npm run preview` | Sirve `dist/` en local (ver [Pendientes](#pendientes)) |
| `npm run lint` | Revisa el código con ESLint |
| `npm run test:e2e` | Pruebas end-to-end con datos simulados |
| `npm run test:e2e:ui` | Las mismas pruebas en la interfaz visual de Playwright |
| `npm run deploy` | Compila y publica en GitHub Pages |

## Pruebas

```bash
npm run lint
npm run test:e2e
```

`npm run test:e2e` no necesita backend ni base de datos: levanta la app con datos simulados. Verifica en la interfaz los flujos de tarjetas y tareas, el mensaje de error de carga, la vista móvil y que el diseño no se rompa entre 320 px y 1920 px.

Estas pruebas sobrescriben las capturas versionadas de `tests/e2e/screenshots/`.

Las pruebas con backend y MongoDB reales se describen en [docs/testing.md](docs/testing.md).

## Despliegue

La app se publica en GitHub Pages, en la rama `gh-pages`:

```bash
npm run deploy
```

El comando compila la app y sube `dist/` a la rama `gh-pages`. GitHub Pages tarda uno o dos minutos en actualizarse.

Antes de publicar, comprueba que no exista un `.env.local` ni un `.env.production.local` con `VITE_USE_MOCKS=true` o con una `VITE_API_URL` local: `npm run build` los aplicaría al sitio publicado.

## Pendientes

- **`npm run preview` no prueba el build local.** `base` en `vite.config.js` es la URL completa de GitHub Pages, así que `dist/index.html` carga los scripts y estilos del sitio ya publicado. Para que funcione en local, `base` debería ser la ruta relativa `/todolistfronted/`.
- **Las pruebas con backend real en local usan la base de desarrollo** `app_todolist`, no una base exclusiva de pruebas. Ver [docs/testing.md](docs/testing.md).

## Estructura

```
src/
├── api/          # Cliente Axios y llamadas a la API
├── components/   # Encabezado, lista de tarjetas, tarjeta y tareas
├── context/      # Estado de las tarjetas
├── helpers/      # Utilidades
├── hooks/        # Hooks propios
├── mocks/        # API simulada
└── styles/       # Estilos
tests/
├── e2e/          # Pruebas con datos simulados
└── realdb/       # Pruebas con backend y MongoDB reales
docs/
└── testing.md    # Guía de pruebas avanzadas
```
