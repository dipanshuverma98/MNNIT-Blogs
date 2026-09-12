import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext.jsx';  
import toast from 'react-hot-toast'

const Blog = () => {
  const { id } = useParams()

  const { axios, token, user, navigate } = useAppContext();

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success && data.blog) {
        setData(data.blog);
      } else {
        const fallback = blog_data.find((b) => b._id === id);
        if (fallback) setData(fallback);
      }
    } catch (error) {
      const fallback = blog_data.find((b) => b._id === id);
      if (fallback) {
        setData(fallback);
      } else {
        toast.error(error.message);
      }
    }
  }

  const fetchComments = async () => {
    try {
      const { data } = await axios.post(`/api/blog/comments`, { blogId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        const fallbackComments = comments_data.filter((c) => c.blog?._id === id || c.blog === id);
        setComments(fallbackComments);
      }
    } catch (error) {
      const fallbackComments = comments_data.filter((c) => c.blog?._id === id || c.blog === id);
      setComments(fallbackComments);
    }
  }

  const addComment = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to comment");
      navigate('/login');
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/blog/addcomment`, { 
        blog: id, 
        content,
        name: user?.name 
      });   
      if (data.success) {
        toast.success(data.message);
        setContent('');
        fetchComments(); 
      } else {      
        toast.error(data.message);
      } 
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  },[id]) 

  return data ? (
    <div className='relative'>
      <img src={assets.gradientBackground} alt="" className='absolute -top-40 -z-10 opacity-50' />

      <Navbar />

      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>

        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
          {data.title}
        </h1>

        <h2 className='my-5 max-w-lg truncate mx-auto'>
          {data.subTitle}
        </h2>

       
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>
          {data.writer?.name || "Unknown Author"}
        </p>
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt="" className='rounded-3xl mb-5' />

        <div
          className='rich-text max-w-3xl mx-auto'
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>
            Comments ({comments.length})
          </p>

          <div className='flex flex-col gap-4'>
            {comments.map((item, index) => (
              <div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt="" className='w-6' />
                  <p className='font-medium'>{item.name}</p>
                </div>

                <p className='text-sm max-w-md ml-8'>
                  {item.content}
                </p>

                <div className='absolute right-4 bottom-3 text-xs'>
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='max-w-3xl mx-auto'>
          {token ? (
            <form onSubmit={addComment} className='flex flex-col gap-4 max-w-lg'>
              <div className='flex items-center gap-2 text-sm text-gray-600 mb-1'>
                <span>Commenting as:</span>
                <span className='font-semibold text-gray-800'>{user?.name || "Registered User"}</span>
              </div>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder='Share your thoughts on this blog...' 
                required 
                className='p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:border-primary text-gray-700'
              ></textarea>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className='bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50'
              >
                {isSubmitting ? "Submitting..." : "Submit Comment"}
              </button>
            </form>
          ) : (
            <div className='p-6 border border-primary/20 bg-primary/5 rounded-xl text-center max-w-lg'>
              <h3 className='font-semibold text-gray-800 text-lg mb-2'>
                Join the conversation
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                Only registered users can comment on blogs. Please login or register an account to leave a comment.
              </p>
              <div className='flex justify-center gap-3'>
                <button
                  onClick={() => navigate('/login')}
                  className='text-sm font-medium px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all'
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className='text-sm font-medium px-5 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-all'
                >
                  Create Account
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <Footer/>
    </div>
  ) : <Loader/>
}

export default Blog