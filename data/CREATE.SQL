DROP TABLE IF EXISTS albumes;

CREATE TABLE albumes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo      TEXT NOT NULL,
  artista     TEXT NOT NULL,
  genero      TEXT NOT NULL,
  anio        INTEGER NOT NULL,
  sello       TEXT,
  pistas      INTEGER,
  imagen      TEXT,
  slug        TEXT UNIQUE NOT NULL,
  resumen     TEXT,
  descripcion TEXT
);