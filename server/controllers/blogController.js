import fs from 'fs';
import imagekit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !subTitle || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const fileBase64 = imageFile.buffer.toString("base64");

    const response = await imagekit.upload({
      file: fileBase64, 
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" }
      ]
    });

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
      writer: req.user.id 
    });

    res.status(201).json({ success: true, message: "Blog added successfully" });

  } catch (error) {
    console.error("Add Blog Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).populate('writer', 'name');
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params; 

    const blog = await Blog.findById(id).populate('writer', 'name');

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    await Blog.findByIdAndDelete(id);

  
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export const togglePublush = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);

    blog.isPublished = !blog.isPublished;

    await blog.save();

    res.json({ success: true, message: "Blog publish status toggled successfully" });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, content } = req.body;

    if (!blog || !content) {
      return res.status(400).json({
        success: false,
        message: "Blog ID and comment content are required"
      });
    }

    // req.user is set by auth middleware
    let commentAuthorName = req.body.name;
    let userId = req.user?.id;

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        commentAuthorName = user.name;
      }
    }

    if (!commentAuthorName) {
      return res.status(401).json({
        success: false,
        message: "User must be logged in to comment"
      });
    }

    await Comment.create({
      blog,
      name: commentAuthorName,
      user: userId,
      content
    });

    res.json({ success: true, message: "Comment added for review" });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.json({ success: true, comments });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(prompt+"Generate a blog content for this topic in simple text format.");
    res.json({ success: true, content });
  } catch (error) {
    res.json({
      success: false, 
      message: error.message
    });
  }
};