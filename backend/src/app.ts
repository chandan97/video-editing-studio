import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import projectRoutes from './modules/projects/project.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/projects', projectRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Video Studio API is running!' });
});

export default app;