import React from 'react'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx';  

const Navbar = () => {

  const { navigate, token, user, logout } = useAppContext();

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="logo" 
        className='w-32 sm:w-44 cursor-pointer' 
      />

      <div className='flex items-center gap-3 sm:gap-4'>

        {token ? (
          <div className='flex items-center gap-3'>
            {user?.name && (
              <span className='hidden sm:inline text-sm font-medium text-gray-600'>
                Hi, {user.name}
              </span>
            )}
            <button 
              onClick={() => navigate('/admin')} 
              className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 sm:px-8 py-2'
            >
              Dashboard
              <img src={assets.arrow} className='w-3' alt="arrow" />
            </button>
            <button 
              onClick={logout} 
              className='text-sm cursor-pointer px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50'
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => navigate('/login')} 
              className='text-sm cursor-pointer px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50'
            >
              Login
            </button>

            <button 
              onClick={() => navigate('/signup')} 
              className='text-sm cursor-pointer bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90'
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