import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext.jsx'; 
import toast from 'react-hot-toast';

const Login = () => {

  const { axios, setToken, navigate } = useAppContext();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/admin/login', { email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);

        // ✅ FIXED (no duplicate assignment)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        navigate('/admin'); // optional redirect

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>

        <div className='text-center py-6'>
          <h1 className='text-3xl font-bold'>
            <span className='text-primary'>Login</span>
          </h1>
          <p className='font-light'>
            Enter your credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className='mt-6 text-gray-600'>

          <div className='flex flex-col'>
            <label>Email</label>
            <input
              type="email"
              required
              placeholder='your email id'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border-b-2 border-gray-300 p-2 outline-none mb-6'
            />
          </div>

          <div className='flex flex-col'>
            <label>Password</label>
            <input
              type="password"
              required
              placeholder='your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border-b-2 border-gray-300 p-2 outline-none mb-6'
            />
          </div>

          <button
            type="submit"
            className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'
          >
            Login
          </button>

        </form>

        {/* ✅ Signup link */}
        <p className='text-center mt-4 text-sm'>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className='text-primary cursor-pointer'
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login