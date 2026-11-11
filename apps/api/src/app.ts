import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/UserRoutes';
import skillRoutes from './routes/SkillRoutes';
import swapRequestRoutes from './routes/SwapRequestRoutes';
import chatRoutes from './routes/ChatRoutes';
import exploreRoutes from './routes/ExploreRoutes';
import dashboardRoutes from './routes/DashboardRoutes';
import notificationRoutes from './routes/NotificationRoutes';
import reviewRoutes from './routes/ReviewRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkillSwap API', timestamp: new Date().toISOString() });
});

app.use('/api', userRoutes);
app.use('/api', skillRoutes);
app.use('/api', swapRequestRoutes);
app.use('/api', chatRoutes);
app.use('/api', exploreRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', notificationRoutes);
app.use('/api', reviewRoutes);

// Production: serve frontend static files dari hasil build Vite
const frontendDistPath = path.resolve(__dirname, '../../web/dist');
app.use(express.static(frontendDistPath));

// SPA fallback: semua route non-API diarahkan ke index.html agar React Router berfungsi
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

export default app;
