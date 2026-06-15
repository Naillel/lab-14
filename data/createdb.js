import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { cwd } from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const data = require("./albumes.json");

const db = new DatabaseSync(`${cwd()}/data/albumes.db`);

const sql = readFileSync(`${cwd()}/data/CREATE.SQL`, "utf-8");
db.exec(sql);

const stmt = db.prepare(`
  INSERT INTO albumes
    (titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
  VALUES
    (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen, :slug, :resumen, :descripcion)
`);

for (const album of data) {
  stmt.run(album);
}

console.log("Base de datos creada y poblada con exito.");