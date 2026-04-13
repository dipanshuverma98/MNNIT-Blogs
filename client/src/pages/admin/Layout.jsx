import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import { useAppContext } from '../../context/AppContext.jsx';

const Layout = () => {

  const { axios, setToken, navigate, user, setUser } = useAppContext();
  

  console.log("Current user data:", user);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 

    delete axios.defaults.headers.common['Authorization'];

    setToken(null);
    if(setUser) setUser(null); // Reset user state
    navigate('/');
  }

  return (
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
        <img
          src={assets.logo}
          alt=""
          className='w-32 sm:w-40 cursor-pointer'
          onClick={() => navigate('/')}
        />

    
        <div className='flex items-center gap-4'>
        
          {user && user.name && (
             <p className='text-gray-600 font-medium hidden sm:block'>
               Hello, <span className='text-primary'>{user.name}</span>
             </p>
          )}

          <button
            onClick={logout}
            className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-all'
          >
            Logout
          </button>
        </div>
      </div>

      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout