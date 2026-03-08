import { Request, Response } from 'express';
import { pool } from '../../config/database';
import multer from 'multer';
import path from 'path';
import { addRenderJob } from '../../services/queue.service'; // Yahan import kiya

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/app/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRes = await pool.query(
      `INSERT INTO users (name, email) VALUES ('Test User', 'teacher@test.com') 
       ON CONFLICT (email) DO UPDATE SET email=EXCLUDED.email RETURNING id`
    );
    const userId = userRes.rows[0].id;

    const { title } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'Please upload a video file' });
      return;
    }

    const projectRes = await pool.query(
      `INSERT INTO projects (user_id, title) VALUES ($1, $2) RETURNING id`,
      [userId, title || 'My First Teaching Video']
    );
    const projectId = projectRes.rows[0].id;

    await pool.query(
      `INSERT INTO assets (project_id, file_path, asset_type) VALUES ($1, $2, 'video')`,
      [projectId, file.filename]
    );

    // 🔴 NAYA CODE: Redis Queue me Job push karna
    await addRenderJob({
      projectId: projectId,
      videoPath: file.filename,
      action: 'add_watermark'
    });

    res.status(201).json({
      message: '✅ Project created and video queued for processing!',
      projectId: projectId,
      videoPath: file.filename
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// GET All Projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    // Database se saare projects uthao (Latest wale sabse upar)
    // Note: Yahan 'pool' tumhara db connection hai, jaisa tumne createProject me use kiya tha
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    
    // Frontend ko data bhej do (res.data ke format me)
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ error: 'Projects lane me gadbad ho gayi' });
  }
};