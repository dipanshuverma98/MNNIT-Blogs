import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx'; 
import toast from 'react-hot-toast';

const Signup = () => {
  const { axios, setToken } = useAppContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [step, setStep] = useState(1); 

  const handleRegisterInit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/admin/register', {
        name,
        email,
        password
      });

      if (data.success) {
        toast.success(data.message || "OTP sent to your email!");
        setStep(2); 
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
     
      const { data } = await axios.post('/api/admin/verifyotp', {
        email,
        otp
      });

      if (data.success) {
        toast.success("Account created successfully!");

        setToken(data.token);
        localStorage.setItem('token', data.token);

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>

        <div className='text-center py-6'>
          <h1 className='text-3xl font-bold'>
            <span className='text-primary'>Signup</span>
          </h1>
          <p className='font-light'>
            {step === 1 ? "Create your account" : "Verify your email"}
          </p>
        </div>

        {step === 1 ? (
  
          <form onSubmit={handleRegisterInit} className='mt-6 text-gray-600'>
            <div className='flex flex-col'>
              <label>Name</label>
              <input
                type="text"
                required
                placeholder='your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>

            <div className='flex flex-col'>
              <label>Email</label>
              <input
                type="email"
                required
                placeholder='your email'
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
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className='mt-6 text-gray-600'>
            <div className='flex flex-col text-center mb-4'>
              <p className='text-sm text-gray-500'>
                We sent a 6-digit code to <br/> <span className='font-semibold text-gray-700'>{email}</span>
              </p>
            </div>

            <div className='flex flex-col'>
              <label>Enter OTP</label>
              <input
                type="text"
                required
                maxLength="6"
                placeholder='123456'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='border-b-2 border-gray-300 p-2 outline-none mb-6 text-center text-xl tracking-widest'
              />
            </div>

            <button
              type="submit"
              className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'
            >
              Verify & Signup
            </button>

            <button 
              type="button" 
              onClick={() => setStep(1)}
              className='w-full mt-4 text-sm text-gray-400 hover:text-primary transition-colors'
            >
              Change Email / Go Back
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Signup;