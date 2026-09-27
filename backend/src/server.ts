import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CryptoTrace AI Forensics Core',
    timestamp: new Date().toISOString(),
    mode: 'DEMO / SIMULATION ENVIRONMENT',
    version: '2.4.1-law-enforcement-edition'
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Serve static frontend build if present (for unified single-URL deployment on Render/Railway)
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[CryptoTrace Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Forensic Server Error',
    reference: `ERR-${Date.now()}`
  });
});

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡  CryptoTrace AI - Cybercrime Forensics Backend`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🟢 Mode: DEMO / LAW ENFORCEMENT SIMULATION ENVIRONMENT`);
  console.log(`=======================================================`);
});

export default app;
