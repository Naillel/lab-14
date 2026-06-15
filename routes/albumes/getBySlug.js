import * as albumes from "../../data/albumes.js";

const notFound = (res) =>
  res.status(404).json({ error: "Album no encontrado" });

export const getBySlug = (req, res) => {
  const item = albumes.getBySlug(req.params.slug);
  if (!item) return notFound(res);
  res.json(item);
};