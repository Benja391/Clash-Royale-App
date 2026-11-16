# 👑 Clash Royale App

Aplicación web para explorar las cartas de Clash Royale, buscar jugadores y armar tu propio mazo. El backend en **Node.js + Express** funciona como intermediario con la **API oficial de Supercell**, así el token nunca queda expuesto en el navegador.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)

---

## ✨ Funcionalidades

- **Cartas:** listado completo con filtros y modal con el detalle de cada carta.
- **Buscador de jugadores:** perfil por tag (nivel, trofeos, clan, arena, victorias y carta favorita).
- **Historial de batallas:** las últimas 5 partidas del jugador.
- **Mazo propio:** armalo y se guarda en el navegador (`localStorage`).
- **Tema claro/oscuro** y diseño adaptable.

## 🔌 API propia (Express)

| Método | Ruta | Devuelve |
|---|---|---|
| GET | `/api/player/:tag` | Datos resumidos del jugador |
| GET | `/api/player/:tag/battlelog` | Últimas 5 batallas |
| GET | `/api/cards` | Todas las cartas |
| GET | `/api/card/:name` | Detalle de una carta |

El servidor llama a `api.clashroyale.com` con el token guardado en `.env` y le devuelve al frontend solo los datos que necesita.

## 🗂️ Estructura

```
├── app.js              Servidor Express y endpoints de la API
├── public/
│   ├── index.html      Interfaz
│   ├── js/             Módulos ES: cartas, mazo, jugador, modal, tema
│   └── styles/         Estilos en Sass (parciales) compilados a main.css
└── .env.example        Variables de entorno necesarias
```

## ⚙️ Cómo correrlo

1. Creá un token gratuito en https://developer.clashroyale.com. Supercell pide la **IP pública** desde donde vas a hacer las consultas.
2. Copiá `.env.example` como `.env` y pegá tu token.
3. Instalá y levantá el servidor:

```bash
npm install
npm start
```

Abrí http://localhost:3000. Requiere Node.js 18 o superior, por el `fetch` nativo.

Para editar los estilos: `npm run sass`.

## 🚀 Deploy en Vercel

El proyecto funciona en Vercel sin configuración extra: `app.js` exporta la app de Express y los archivos de `public/` se sirven como estáticos.

La API de Supercell solo acepta tokens asociados a una **IP fija**, y Vercel usa IPs dinámicas. Para resolverlo se usa el proxy de RoyaleAPI:

1. Creá un token en https://developer.clashroyale.com con la IP `45.79.218.79`.
2. En Vercel, cargá estas variables de entorno:
   - `CLASH_API_TOKEN`: el token nuevo.
   - `CLASH_API_URL`: `https://proxy.royaleapi.dev/v1`
3. Hacé un redeploy.

---

## 👤 Autor

**Benjamín Bosch**, desarrollador Full Stack · [GitHub](https://github.com/Benja391) · [LinkedIn](https://www.linkedin.com/in/benjamin-bosch-/)
