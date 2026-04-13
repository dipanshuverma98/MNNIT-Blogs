import express from 'express';
import {verifyOtp, registerUser,adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/adminController.js'; 
import auth from '../middlewares/auth.js';

const adminRouter = express.Router();

adminRouter.post('/register', registerUser);
adminRouter.post('/verifyotp', verifyOtp);
adminRouter.post('/login', adminLogin);
adminRouter.get('/comments', auth, getAllComments);
adminRouter.get('/blogs', auth, getAllBlogsAdmin);
adminRouter.post('/deletecomment', auth, deleteCommentById);
adminRouter.post('/approvecomment', auth, approveCommentById);
adminRouter.get('/dashboard', auth, getDashboard);

export default adminRouter;