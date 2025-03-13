import express from 'express';
import {registerUser} from '../controllers/authentication';
const router = express.Router();


router.post('/register' , registerUser);

router.post('/login' , )

export default router;