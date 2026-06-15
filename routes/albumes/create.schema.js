import { z } from "zod";

const schema = z.object({
  titulo:      z.string().trim().min(1, "El titulo es requerido"),
  artista:     z.string().trim().min(1, "El artista es requerido"),
  genero:      z.string().trim().min(1, "El genero es requerido"),
  anio:        z.number().int().min(1900).max(2100),
  sello:       z.string().trim().optional(),
  pistas:      z.number().int().min(1).optional(),
  imagen:      z.string().trim().optional(),
  slug:        z.string().trim().min(1, "El slug es requerido"),
  resumen:     z.string().trim().optional(),
  descripcion: z.string().trim().optional(),
});

export default schema;