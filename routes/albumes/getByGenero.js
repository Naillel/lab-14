import * as albumes from "../../data/albumes.js";

export const getByGenero = (req, res) => {
  const items = albumes.getByGenero(req.params.genero);
  res.json(items);
};