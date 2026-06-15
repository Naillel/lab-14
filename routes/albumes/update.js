import * as albumes from "../../data/albumes.js";
import schema from "./create.schema.js";

export const update = (req, res) => {
  const existing = albumes.getBySlug(req.params.slug);
  if (!existing) {
    return res.status(404).json({ error: "Album no encontrado" });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? "Datos invalidos";
    return res.status(400).json({ error });
  }

  albumes.update(req.params.slug, parsed.data);

  const updated = albumes.getBySlug(req.params.slug);
  res.json(updated);
};