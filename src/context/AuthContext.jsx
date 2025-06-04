import { createContext, useContext, useEffect } from "react";
import axios from "axios"
import { useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

export const AuthContext = createContext();


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineVisibilityMap, setOnlineVisibilityMap] = useState({});
    const [isLoading, setLoading] = useState(false)

    const checkAuth = async () => {
        try {

            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const login = async (state, credentials) => {
        try {

            const { data } = await axios.post(`/api/auth/${state}`, credentials)
            if (data.success) {
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common['token'] = data.token
                setToken(data.token)
                localStorage.setItem('token', data.token)
                toast.success(data.message)
                return data;
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null)
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common['token'] = null;
        toast.success('Logout successfully')
        socket.disconnect();
    }

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put(`/api/auth/update-profile`, body)
            if (data.success) {
                setAuthUser(data.user)
                toast.success('Profile Updated')
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    const changePass = async (body) => {
        try {
            const { data } = await axios.put(`/api/auth/reset-password`, body)
            if (data.success) {
                toast.success('Password Updated')
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: { userId: userData._id },
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUser(userIds);
        });

        newSocket.on("receiveOnlineVisibilityUpdate", ({ userId, isOnlineVisible }) => {
            setOnlineVisibilityMap((prev) => ({
                ...prev,
                [userId]: isOnlineVisible,
            }));
        });
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    }, [])

    const value = {
        axios, authUser, onlineUser, socket, token, isLoading, setLoading,
        login, logout, updateProfile, changePass, onlineVisibilityMap
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}