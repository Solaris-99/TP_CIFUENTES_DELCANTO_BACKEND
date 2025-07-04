import express from "express";
import type { NextFunction, Request, Response } from "express";
// Se define lo necesario para el servidor
const app = express();
const port = 3000;
// Se define un middleware, para que se puedan manejar peticiones y respuestas en formato json
app.use(express.json());
// Se define el endpoint raiz, para obtener un recurso
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World" });
});

//Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send("Algo salió mal");
}); 

// Se levanta el servidor y escucha en el puerto 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});