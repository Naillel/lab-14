import * as albumes from "../../data/albumes.js";

export const getAll = (req, res) => {
  const data = albumes.getAll();
  res.json(data);
};