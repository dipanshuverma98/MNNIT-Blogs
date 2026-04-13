import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import Layout from './pages/admin/Layout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Addblog from './pages/admin/Addblog.jsx'
import Listblog from './pages/admin/Listblog.jsx'
import Comments from './pages/admin/Comments.jsx'
import Login from './components/admin/Login.jsx'
import Signup from './components/admin/Signup.jsx' // ✅ ADD THIS
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext.jsx'; 

const App = () => {

  const { token } = useAppContext();

  return (
    <div>
      <Toaster/>

      <Routes>

        {/* Public Routes */}
        <Route path='/' element={<Home/>} />
        <Route path='/blog/:id' element={<Blog/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />

        {/* Protected Admin Routes */}
        <Route path='/admin' element={token ? <Layout/> : <Login/>}>
          <Route index element={<Dashboard/>} />
          <Route path='addblog' element={<Addblog/>} />
          <Route path='listblog' element={<Listblog/>} />
          <Route path='comments' element={<Comments/>} />
        </Route>

      </Routes>
    </div>
  )
}

export default App