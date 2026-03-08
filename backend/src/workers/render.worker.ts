import { Worker, Job } from 'bullmq';
import { redisOptions } from '../config/redis';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

console.log('👷 Worker process started. Waiting for jobs...');

const renderWorker = new Worker(
  'render-queue',
  async (job: Job) => {
    console.log(`\n🚀 Picked up Job ID: ${job.id}`);
    console.log(`📋 Job Data:`, job.data);

    const { videoPath } = job.data;
    
    // Paths setup
    const inputFilePath = path.join('/app/uploads', videoPath);
    const outputFileName = `rendered_${Date.now()}.mp4`;
    const outputFilePath = path.join('/app/uploads', outputFileName);

    console.log(`🎬 Starting FFmpeg process for: ${videoPath}`);

    // Real FFmpeg processing wrapped in a Promise
    return new Promise((resolve, reject) => {
      ffmpeg(inputFilePath)
        // Ek simple Black and White filter laga rahe hain first test ke liye
        .videoFilters('format=gray')
        // 🔴 FIX: Force output to YUV420p for maximum compatibility (No Green Glitch)
        .outputOptions('-pix_fmt yuv420p')
        .output(outputFilePath)
        .on('start', (commandLine) => {
          console.log('🏃 FFmpeg running...');
        })
        .on('progress', (progress) => {
          // Progress bar terminal me dikhegi
          console.log(`⏳ Processing: ${Math.round(progress.percent || 0)}% done`);
        })
        .on('end', () => {
          console.log(`✅ FFmpeg processing finished! Saved as: ${outputFileName}`);
          resolve({ status: 'success', outputFile: outputFileName });
        })
        .on('error', (err) => {
          console.error(`❌ FFmpeg Error:`, err.message);
          reject(err);
        })
        .run(); // Command execute karna shuru karo
    });
  },
  { connection: redisOptions }
);

renderWorker.on('failed', (job, err) => {
  console.error(`❌ Job ID: ${job?.id} has failed with error: ${err.message}`);
});