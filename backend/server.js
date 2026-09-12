import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// ==========================================
// 1. ENVIRONMENT VARIABLES CONFIGURATION
// ==========================================
dotenv.config();

// ==========================================
// 2. IMPORT API ROUTES
// ==========================================
import authRoutes from './routes/authRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// ==========================================
// 3. PATH CONFIGURATION
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '../');
const frontendRoot = path.join(projectRoot, 'frontend');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 4. CLOUDINARY CONFIG CHECK
// ==========================================
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY ? 'Loaded ✅' : 'Missing ❌');
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Loaded ✅' : 'Missing ❌');
console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded ✅' : 'Missing ❌');

// ==========================================
// 5. GLOBAL MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==========================================
// 6. API ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/conversations', chatRoutes);

// ==========================================
// 7. SERVER INITIALIZATION & MODES
// ==========================================
async function startServer() {
  
  // Database Connection
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully 🚀');

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  // Development Mode (Vite Middleware Integration)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running in DEVELOPMENT mode 🛠️');

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: frontendRoot
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(frontendRoot, 'index.html'), 'utf-8');
        
        template = await vite.transformIndexHtml(url, template);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

  } 
  // Production Mode (Serving Built Frontend Static Files)
  else {
    console.log('Running in PRODUCTION mode 📦');

    const distPath = path.join(frontendRoot, 'dist');

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start Listening
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT} 🌐`);
  });
}

// Run the server setup
startServer();
