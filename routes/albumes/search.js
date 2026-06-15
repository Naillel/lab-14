import * as albumes from "../../data/albumes.js";
import schema from "./search.schema.js";

export const search = (req, res) => {
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? "Busqueda invalida";
    return res.status(400).json({ error });
  }

  const results = albumes.search(parsed.data.text);
  res.json(results);
};