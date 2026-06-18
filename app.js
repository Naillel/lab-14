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

app.get("/", (req, res) => {
  res.json({
    nombre: "DiscoStore API",
    version: "1.0.0",
    rutas: ["/albumes", "/album/:slug", "/genero/:genero", "/search/:text"],
  });
});

app.get("/albumes",        getAll);
app.get("/album/:slug",    getBySlug);
app.get("/genero/:genero", getByGenero);
app.get("/search/:text",   search);

app.post("/albumes",       create);
app.put("/album/:slug",    update);
app.delete("/album/:slug", remove);

app.use("/imagenes", express.static(`${cwd()}/imagenes`));

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;