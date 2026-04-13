import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

// ✅ REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      token
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ✅ LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ success: true, token });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ✅ USER-SPECIFIC BLOGS
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({ writer: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, blogs });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ✅ USER-SPECIFIC COMMENTS
export const getAllComments = async (req, res) => {
  try {

    const userBlogs = await Blog.find({ writer: req.user.id }).distinct('_id');

    const comments = await Comment.find({
      blog: { $in: userBlogs }
    })
      .populate('blog')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ✅ USER DASHBOARD
export const getDashboard = async (req, res) => {
  try {

    const userBlogs = await Blog.find({ writer: req.user.id });

    const blogIds = userBlogs.map(blog => blog._id);

    const recentBlogs = await Blog.find({ writer: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    const blogs = await Blog.countDocuments({ writer: req.user.id });

    const drafts = await Blog.countDocuments({
      writer: req.user.id,
      isPublished: false
    });

    const comments = await Comment.countDocuments({
      blog: { $in: blogIds }
    });

    res.json({
      success: true,
      dashboardData: {
        blogs,
        comments,
        drafts,
        recentBlogs
      }
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ✅ DELETE COMMENT (only if belongs to user blog)
export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    const blog = await Blog.findById(comment.blog);

    if (blog.writer.toString() !== req.user.id) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Comment deleted successfully"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ✅ APPROVE COMMENT (only if belongs to user blog)
export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    const blog = await Blog.findById(comment.blog);

    if (blog.writer.toString() !== req.user.id) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Comment.findByIdAndUpdate(id, { isApproved: true });

    res.json({
      success: true,
      message: "Comment approved successfully"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};