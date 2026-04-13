import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import nodemailer from 'nodemailer';


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    let user = await User.findOne({ email });


    if (user && user.isVerified) {
      return res.json({ success: false, message: "User already exists" });
    }

 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
   
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    const hashedPassword = await bcrypt.hash(password, 10);

    if (user && !user.isVerified) {
  
      user.password = hashedPassword;
      user.name = name;
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
    
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpires
      });
    }

   
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

  
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Registration OTP',
      html: `
        <h2>Hello ${user.name},</h2>
        <p>Your One-Time Password (OTP) for registration is:</p>
        <h1 style="color: blue; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      `
    });

    res.json({
      success: true,
      message: "OTP sent to email. Please verify."
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Account is already verified" });
    }


    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }


    if (user.otpExpires < Date.now()) {
      return res.json({ success: false, message: "OTP has expired. Please register again." });
    }

    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

  
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: "Account created and verified successfully",
      token,user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

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

    res.json({ success: true, token , user: {
        name: user.name,
        email: user.email
      }
      });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

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