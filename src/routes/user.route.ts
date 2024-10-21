import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller';
import { validateRegister, validateLogin } from '../validators/user.validator';

const router = Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;
