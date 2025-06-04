import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [triggerSearch, setTriggerSearch] = useState(false)
    const { socket, axios, token } = useContext(AuthContext);
    const [lastMessages, setLastMessages] = useState([]);

    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendMessages = async (msgData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser?._id}`, msgData);
            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage])
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getLastMessages = async () => {
        try {
            const { data } = await axios.get("/api/messages/last-messages", {
                headers: { token }
            });
            if (data.success) {
                const messageMap = {};
                data.data.forEach(msg => {
                    messageMap[msg.otherUser._id] = msg;
                });
                setLastMessages(messageMap);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Fetch failed");
        }
    };

    const subscribeToMessage = async () => {
        if (!socket) return;

        socket.on('newMessage', (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prev) => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else {
                setUnseenMessages((prev) => ({
                    ...prev, [newMessage.senderId]:
                        prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }




    const unSubscribeToMessage = async () => {
        if (socket) socket.off("newMessage");
    }


    useEffect(() => {
        subscribeToMessage();
        return () => unSubscribeToMessage();

    }, [socket, selectedUser])


    useEffect(() => {
        if (socket) {
            getLastMessages();
        }
    }, [messages, socket])


    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessages, setSelectedUser, unseenMessages, setUnseenMessages,
        triggerSearch, setTriggerSearch, setUsers, getLastMessages, lastMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}