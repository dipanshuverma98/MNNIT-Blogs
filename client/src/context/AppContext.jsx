import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  
import toast from "react-hot-toast";


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
    
    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all');
            data.success ? setBlogs(data.blogs) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }   
    };

   
    useEffect(() => {
        if (blogs.length === 0) {
            fetchBlogs();
        }
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