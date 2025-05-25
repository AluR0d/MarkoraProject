import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import placeRoutes from './routes/placeRoutes';
import ownerRoutes from './routes/ownerRoutes';
import roleRouter from './routes/roleRoutes';
import authRoutes from './routes/authRoutes';
import { ApiError } from './utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import campaignRoutes from './routes/campaignRoutes';

const app = express();

const allowedOrigins = [
  'https://markora-frontend.onrender.com',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/places', placeRoutes);
app.use('/owners', ownerRoutes);
app.use('/roles', roleRouter);
app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message, code: err.code });
    return;
  }

  console.error('Unexpected error:', err);

  res.status(500).json({ message: 'Internal server error' });
  return;
});

export default app;
