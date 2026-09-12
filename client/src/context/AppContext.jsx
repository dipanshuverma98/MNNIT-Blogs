import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  
import toast from "react-hot-toast";
import { blog_data } from "../assets/assets.js";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const savedToken = localStorage.getItem('token');
const savedUser = JSON.parse(localStorage.getItem('user')); 

if (savedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();

  
    const [token, setToken] = useState(savedToken || null);
    const [user, setUser] = useState(savedUser || null); 
    
    const [blogs, setBlogs] = useState(blog_data || []);
    const [input, setInput] = useState("");

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all');
            if (data.success && data.blogs && data.blogs.length > 0) {
                setBlogs(data.blogs);
            } else if (!blogs || blogs.length === 0) {
                setBlogs(blog_data);
            }
        } catch (error) {
            // Keep the static sample blogs on API error
            if (!blogs || blogs.length === 0) {
                setBlogs(blog_data);
            }
        }   
    };

    useEffect(() => {
        fetchBlogs();
    }, []); 

  
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        toast.success("Logged out successfully");
        navigate('/');
    };

    const value = {
        axios,
        token,
        setToken,   
        blogs,
        setBlogs,
        fetchBlogs,
        input,
        setInput,
        navigate,
        user,     
        setUser,
        logout,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => {
    return useContext(AppContext);      
};