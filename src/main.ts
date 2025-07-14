import express, { type Application, type Request, type Response } from 'express';
import 'express-async-errors';
import apiRoutes from './api/routes.ts';
import { errorHandler } from './middleware/errorHandler.middleware.ts';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1', apiRoutes);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});