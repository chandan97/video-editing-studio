import { Router } from 'express';
import { createProject, upload ,getProjects} from './project.controller';

const router = Router();

// Route: POST /api/projects/create
// 'video' wo field name hai jisme hum frontend se file bhejenge
router.post('/create', upload.single('video'), createProject);
router.get('/', getProjects);

export default router;