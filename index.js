import app from "./app.js";

const HOST = process.env.HOST ?? "localhost";
const PORT = Number(process.env.PORT ?? 4321);

app.listen(PORT, HOST, () => {
  console.log(`Servidor en http://${HOST}:${PORT}/`);
});