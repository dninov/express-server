import express from 'express';
import auth from '../middleware/auth.js';
import { signin, signup, update, deleteUser } from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/update/:id', auth, update);
router.delete('/:id', auth, deleteUser);

export default router;
