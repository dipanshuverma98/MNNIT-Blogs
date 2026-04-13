import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext.jsx'; 
import toast from 'react-hot-toast'
import {parse} from 'marked'

const AddBlog = () => {

  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)

  const blogCategories = ['Startup', 'Technology', 'Lifestyle']

const generateContent = async () => {
  if (!title) return toast.error("Please enter the title first");

  try {
    setLoading(true);

    const { data } = await axios.post('/api/blog/generate', 
      { prompt: title },
    );
    if (data.success) {
      quillRef.current.root.innerHTML = parse(data.content);
      toast.success("Content generated successfully");
    }
    else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.messageage);
  } finally {
    setLoading(false);
  }
};

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // ✅ safety checks
    if (!quillRef.current) {
      toast.error("Editor not ready");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setIsAdding(true);

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished
      };

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', image);

      const { data } = await axios.post('/api/blog/add', formData);

      if (data.success) {
        toast.success(data.message);

        // ✅ reset form
        setImage(false);
        setTitle('');
        setSubTitle('');
        setCategory('Startup');
        setIsPublished(false);

        if (quillRef.current) {
          quillRef.current.root.innerHTML = '';
        }

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className='mt-2 h-16 rounded cursor-pointer'
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id='image'
            hidden
            required
          />
        </label>

        <p className='mt-4'>Blog title</p>
        <input
          type="text"
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className='mt-4'>Sub title</p>
        <input
          type="text"
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-72 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && (
            <div className='absolute inset-0 bg-white/70 flex items-center justify-center'>
              <p className='text-sm text-gray-500'>Generating content...</p>
            </div>
          )}
          <button
            type='button'
            disabled={loading}
            onClick={generateContent}
            className='absolute bottom-1 right-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'
          >
            Generate with AI
          </button>
        </div>

        <p className='mt-4'>Blog category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          value={category}
          className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'
        >
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        <div className='flex gap-2 mt-4 items-center'>
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className='scale-125 cursor-pointer'
            onChange={e => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'
        >
          {isAdding ? 'Adding...' : 'Add Blog'}
        </button>

      </div>
    </form>
  )
}

export default AddBlog