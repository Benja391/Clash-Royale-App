const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// URL base de la API de Supercell. En hosting con IP dinámica (Vercel, Render, etc.)
// se puede usar el proxy de RoyaleAPI: https://proxy.royaleapi.dev/v1
const API_URL = process.env.CLASH_API_URL || 'https://api.clashroyale.com/v1';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Llama a la API oficial con el token del servidor (el token nunca llega al navegador).
async function clashApi(ruta) {
  const response = await fetch(`${API_URL}${ruta}`, {
    headers: { Authorization: `Bearer ${process.env.CLASH_API_TOKEN}` },
  });
  if (!response.ok) {
    const error = new Error(`La API respondió ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function responderError(res, error, mensaje) {
  console.error(mensaje, error.message);
  res.status(error.status === 404 ? 404 : 502).json({ error: mensaje });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/player/:tag', async (req, res) => {
  try {
    const data = await clashApi(`/players/%23${encodeURIComponent(req.params.tag)}`);
    res.json({
      name: data.name,
      tag: data.tag,
      expLevel: data.expLevel,
      trophies: data.trophies,
      clan: data.clan?.name || 'Sin clan',
      arena: data.arena?.name || 'Desconocida',
      wins: data.wins,
      favoriteCard: data.currentFavouriteCard?.name || 'No definida',
    });
  } catch (error) {
    responderError(res, error, 'No se pudo obtener el jugador');
  }
});

app.get('/api/player/:tag/battlelog', async (req, res) => {
  try {
    const data = await clashApi(`/players/%23${encodeURIComponent(req.params.tag)}/battlelog`);
    res.json(data.slice(0, 5)); // Solo las últimas 5 batallas
  } catch (error) {
    responderError(res, error, 'No se pudo obtener el historial de batallas');
  }
});

app.get('/api/cards', async (req, res) => {
  try {
    const data = await clashApi('/cards');
    res.json(data.items);
  } catch (error) {
    responderError(res, error, 'No se pudieron obtener las cartas');
  }
});

app.get('/api/card/:name', async (req, res) => {
  try {
    const data = await clashApi('/cards');
    const card = data.items.find((c) => c.name.toLowerCase() === req.params.name.toLowerCase());
    if (!card) return res.status(404).json({ error: 'Carta no encontrada' });
    res.json(card);
  } catch (error) {
    responderError(res, error, 'No se pudo obtener la carta');
  }
});

// En Vercel la app se exporta y la plataforma la ejecuta; en local, levanta el servidor.
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports = app;
