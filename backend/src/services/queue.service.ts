import { Queue } from 'bullmq';
import { redisOptions } from '../config/redis'; // Yahan change kiya

export const renderQueue = new Queue('render-queue', {
  connection: redisOptions, // Yahan change kiya
});

export const addRenderJob = async (jobData: any) => {
  const job = await renderQueue.add('render-video', jobData);
  console.log(`📥 Job Added to Queue: ${job.id}`);
  return job;
};