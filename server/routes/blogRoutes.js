import express from 'express';
import { addBlog, addComment, deleteBlogById, getAllBlogs, getBlogById, getBlogComments, togglePublush, generateContent } from '../controllers/blogController.js';
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';

const blogRouter = express.Router();


blogRouter.post('/add', auth, upload.single('image'), addBlog);

blogRouter.get('/all', getAllBlogs);

blogRouter.post('/generate', auth, generateContent);
blogRouter.get('/:id', getBlogById);

blogRouter.post('/delete', auth, deleteBlogById);

blogRouter.post('/togglePublish', auth, togglePublush);

blogRouter.post('/addcomment', addComment);

blogRouter.post('/comments', getBlogComments);


export default blogRouter;