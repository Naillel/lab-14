import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";
import app from "./app.js";

const SLUG_SEMBRADO = "thriller";
const SLUG_NUEVO    = "test-album-vitest";

beforeAll(() => {
  const db = new DatabaseSync(`${cwd()}/data/albumes.db`);
  const tabla = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='albumes'"
  ).get();
  if (!tabla) throw new Error("Ejecuta 'node data/createdb.js' antes de correr las pruebas");
});

afterAll(() => {
  const db = new DatabaseSync(`${cwd()}/data/albumes.db`);
  db.prepare("DELETE FROM albumes WHERE slug = ?").run(SLUG_NUEVO);
});

describe("GET /albumes", () => {
  it("Listar slugs", async () => {
    const res = await request(app).get("/albumes");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((item) => item.slug === SLUG_SEMBRADO)).toBe(true);
  });
});

describe("GET /album/:slug", () => {
  it("Slug existente", async () => {
    const res = await request(app).get(`/album/${SLUG_SEMBRADO}`);

    expect(res.status).toBe(200);
    expect(res.body.slug).toBe(SLUG_SEMBRADO);
    expect(res.body).toHaveProperty("titulo");
    expect(res.body).toHaveProperty("artista");
  });

  it("Slug inexistente", async () => {
    const res = await request(app).get("/album/no-existe-este-slug");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /search/:text", () => {
  it("Texto < 3 caracteres", async () => {
    const res = await request(app).get("/search/ab");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("POST /albumes", () => {
  it("Cuerpo válido", async () => {
    const body = {
      titulo:      "Album de Prueba Vitest",
      artista:     "Artista Test",
      genero:      "Jazz",
      anio:        2024,
      sello:       "Sello Test",
      pistas:      8,
      imagen:      "https://example.com/imagen.jpg",
      slug:        SLUG_NUEVO,
      resumen:     "Resumen del album de prueba",
      descripcion: "Descripcion larga del album de prueba creado por vitest",
    };

    const res = await request(app).post("/albumes").send(body);

    expect(res.status).toBe(201);
    expect(res.headers["location"]).toBe(`/album/${SLUG_NUEVO}`);
    expect(res.body.slug).toBe(SLUG_NUEVO);
  });

  it("Cuerpo inválido", async () => {
    const res = await request(app).post("/albumes").send({ titulo: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("Slug duplicado", async () => {
    const body = {
      titulo:      "Thriller Duplicado",
      artista:     "Michael Jackson",
      genero:      "Pop",
      anio:        1982,
      sello:       "Epic",
      pistas:      9,
      imagen:      "https://example.com/thriller.jpg",
      slug:        SLUG_SEMBRADO,
      resumen:     "Duplicado",
      descripcion: "Este slug ya existe",
    };

    const res = await request(app).post("/albumes").send(body);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });
});

describe("PUT /album/:slug", () => {
  it("Existente y válido", async () => {
    const body = {
      titulo:      "Album de Prueba Actualizado",
      artista:     "Artista Test",
      genero:      "Jazz",
      anio:        2025,
      sello:       "Sello Nuevo",
      pistas:      10,
      imagen:      "https://example.com/nueva.jpg",
      slug:        SLUG_NUEVO,
      resumen:     "Resumen actualizado",
      descripcion: "Descripcion actualizada por vitest",
    };

    const res = await request(app).put(`/album/${SLUG_NUEVO}`).send(body);

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("Album de Prueba Actualizado");
    expect(res.body.anio).toBe(2025);
  });

  it("Inexistente", async () => {
    const body = {
      titulo:      "No Existe",
      artista:     "X",
      genero:      "X",
      anio:        2000,
      slug:        "no-existe-este-slug",
      resumen:     "X",
      descripcion: "X",
    };

    const res = await request(app).put("/album/no-existe-este-slug").send(body);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

// ─── DELETE /album/:slug ─────────────────────────────────────────────────────
describe("DELETE /album/:slug", () => {
  it("Existente", async () => {
    const res = await request(app).delete(`/album/${SLUG_NUEVO}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it("Inexistente", async () => {
    const res = await request(app).delete("/album/no-existe-este-slug");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});