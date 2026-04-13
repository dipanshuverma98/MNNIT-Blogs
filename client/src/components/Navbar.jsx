import React from 'react'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx';  

const Navbar = () => {

  const { navigate, token } = useAppContext();

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="logo" 
        className='w-32 sm:w-44 cursor-pointer' 
      />

      {/* ✅ Right Section */}
      <div className='flex items-center gap-4'>

        {token ? (
          // ✅ Logged in → Dashboard
          <button 
            onClick={() => navigate('/admin')} 
            className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'
          >
            Dashboard
            <img src={assets.arrow} className='w-3' alt="arrow" />
          </button>
        ) : (
          // ❌ Not logged in → Login + Signup
          <>
            <button 
              onClick={() => navigate('/admin')} 
              className='text-sm cursor-pointer px-6 py-2 border border-gray-300 rounded-full'
            >
              Login
            </button>

            <button 
              onClick={() => navigate('/signup')} 
              className='text-sm cursor-pointer bg-primary text-white px-6 py-2 rounded-full'
            >
              Signup
            </button>
          </>
        )}

      </div>

    </div>
  )
}

export default Navbar