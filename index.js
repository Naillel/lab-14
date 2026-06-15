import express from "express";
import { cwd } from "node:process";

import { getAll }      from "./routes/albumes/getAll.js";
import { getBySlug }   from "./routes/albumes/getBySlug.js";
import { getByGenero } from "./routes/albumes/getByGenero.js";
import { search }      from "./routes/albumes/search.js";
import { create }      from "./routes/albumes/create.js";
import { update }      from "./routes/albumes/update.js";
import { remove }      from "./routes/albumes/remove.js";

const app = express();

app.enable("strict routing");
app.use(express.json());

const HOST = process.env.HOST ?? "localhost";
const PORT = Number(process.env.PORT ?? 4321);

// Info
app.get("/", (req, res) => {
  res.json({
    nombre: "DiscoStore API",
    version: "1.0.0",
    rutas: ["/albumes", "/album/:slug", "/genero/:genero", "/search/:text"],
  });
});

// Lectura
app.get("/albumes",          getAll);
app.get("/album/:slug",      getBySlug);
app.get("/genero/:genero",   getByGenero);
app.get("/search/:text",     search);

// Escritura
app.post("/albumes",         create);
app.put("/album/:slug",      update);
app.delete("/album/:slug",   remove);

// Imagenes estaticas
app.use("/imagenes", express.static(`${cwd()}/imagenes`));

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor en http://${HOST}:${PORT}/`);
});