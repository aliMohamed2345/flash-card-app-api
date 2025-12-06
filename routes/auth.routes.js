import express from 'express'
import AuthController from '../controllers/auth.controller.js';
import Middlewares from '../lib/middlewares.js';

const router = express.Router();

const { verifyToken } = new Middlewares()
const { login, signup, logout, profile } = new AuthController()

router.post('/login', login)
router.post('/signup', signup)
router.get('/profile', verifyToken, profile)
router.post('/logout', verifyToken, logout)


export default router