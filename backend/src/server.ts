import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Pehle database connect karo
  await connectDB();

  // Phir server start karo
  app.listen(Number(PORT),'0.0.0.0', () => {
    console.log(`🚀 API Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer();