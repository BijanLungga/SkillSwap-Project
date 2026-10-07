import express from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';
import skillRoutes from './routes/SkillRoutes';
import swapRequestRoutes from './routes/SwapRequestRoutes';
import chatRoutes from './routes/ChatRoutes';
import exploreRoutes from './routes/ExploreRoutes';
import dashboardRoutes from './routes/DashboardRoutes';

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

export default app;
