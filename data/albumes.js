import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";

const db = new DatabaseSync(`${cwd()}/data/albumes.db`);

export const getAll = () => {
  const query = db.prepare("SELECT slug FROM albumes");
  return query.all();
};

export const getBySlug = (slug) => {
  const query = db.prepare("SELECT * FROM albumes WHERE slug = ?");
  return query.get(slug);
};

export const getByGenero = (genero) => {
  const query = db.prepare("SELECT slug FROM albumes WHERE genero = ?");
  return query.all(genero);
};

export const search = (text) => {
  const like = `%${text}%`;
  const query = db.prepare(`
    SELECT slug FROM albumes
    WHERE titulo      LIKE ?
       OR artista     LIKE ?
       OR genero      LIKE ?
       OR sello       LIKE ?
       OR resumen     LIKE ?
       OR descripcion LIKE ?
  `);
  return query.all(like, like, like, like, like, like);
};

export const create = (album) => {
  const stmt = db.prepare(`
    INSERT INTO albumes
      (titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
    VALUES
      (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen, :slug, :resumen, :descripcion)
  `);
  return stmt.run(album);
};

export const update = (slug, album) => {
  const stmt = db.prepare(`
    UPDATE albumes SET
      titulo      = :titulo,
      artista     = :artista,
      genero      = :genero,
      anio        = :anio,
      sello       = :sello,
      pistas      = :pistas,
      imagen      = :imagen,
      resumen     = :resumen,
      descripcion = :descripcion
    WHERE slug = :slug
  `);
  return stmt.run({ ...album, slug });
};

export const remove = (slug) => {
  const stmt = db.prepare("DELETE FROM albumes WHERE slug = ?");
  return stmt.run(slug);
};