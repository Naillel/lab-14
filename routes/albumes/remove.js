import * as albumes from "../../data/albumes.js";

export const remove = (req, res) => {
  const existing = albumes.getBySlug(req.params.slug);
  if (!existing) {
    return res.status(404).json({ error: "Album no encontrado" });
  }

  albumes.remove(req.params.slug);
  res.status(204).send();
};