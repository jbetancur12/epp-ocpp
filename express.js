import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import chargerPointsRoutes from './routes/chargerPoint.routes.js';

import sse from './sse.js';





const app = express();
/*... configure express ... */



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(compress());
app.use(helmet());
app.use(cors());
app.use(sse);


app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', chargerPointsRoutes);



app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

export default app;
