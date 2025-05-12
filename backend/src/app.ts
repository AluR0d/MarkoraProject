import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import placeRoutes from './routes/placeRoutes';
import ownerRoutes from './routes/ownerRoutes';
import roleRouter from './routes/roleRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

const allowedOrigins = ['https://frontend-markora.onrender.com'];

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

export default app;
