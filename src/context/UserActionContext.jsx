import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const UserActionContext = createContext();

export const UserActionProvider = ({ children }) => {
  const { authUser, token, axios, socket } = useContext(AuthContext);
  const [deleteRule, setDeleteRule] = useState('');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
    }
    return "dark";
  });

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(theme);
    }
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const [changePassMdl, setChangePassMdl] = useState(false);
  const [profileMdl, setProfileMdl] = useState(false);
  const [showOnline, setShowOnline] = useState(true);
  const [showRptMdl, setShowRptMdl] = useState(true);


  const changeOnlineStatus = async (bool) => {
    try {
      const authToken = token;
      if (!authToken || !socket?.connected) {
        console.warn("Token or socket not ready yet, aborting online status change.");
        return;
      }
      socket.emit("updateOnlineVisibility", { userId: authUser._id, isOnlineVisible: bool });

      const { data } = await axios.put(
        "/api/auth/online-visibility",
        { isOnlineVisible: bool },
        { headers: { token: authToken } }
      );
      if (data.success) {
        setShowOnline(data.status);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };




  const fetchDeleteRule = async (withUserId) => {
    try {
      if (!token || !withUserId) return;

      const { data } = await axios.get(`/api/messages/chat-rule/${withUserId}`, {
        headers: { token }
      });

      if (data.success) {
        setDeleteRule(data.data.deleteChatRule || "After logout");
        return data.data.deleteChatRule;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const changeDeleteRule = async (val, withUserId) => {
    try {
      if (!token || !withUserId) return;

      const { data } = await axios.post(
        `/api/messages/chat-rule/${withUserId}`,
        { deleteChatRule: val },
        { headers: { token } }
      );

      if (data.success) {
        setDeleteRule(data.data.deleteChatRule);
        toast.success("Delete chat rule updated");
        return data.data.deleteChatRule;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  const deleteMessages = async (type = "After logout", withUserId, ccToken) => {
    try {

      const authToken = ccToken || token;
      const url = type === "After logout"
        ? '/api/messages/clear-immediate'
        : '/api/messages/clear-24hours';

      const { data } = await axios.delete(url, {
        headers: {
          token: authToken
        },
        data: {
          withUserId
        }
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  const deleteAllMessage = async (ccToken) => {
    try {

      const authToken = token || ccToken
      await axios.delete('/api/messages/clear-all-on-logout', {
        headers: {
          token: authToken
        },
      })

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;
    setIsSocketConnected(socket.connected);
    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (token && authUser?._id && isSocketConnected) {
      changeOnlineStatus(true);
    }
  }, [token, authUser, isSocketConnected]);


  const value = {
    changePassMdl,
    setChangePassMdl,
    profileMdl,
    setProfileMdl,
    theme,
    toggleTheme, setShowOnline,
    showOnline, changeOnlineStatus,
    deleteRule,
    setDeleteRule,
    fetchDeleteRule,
    changeDeleteRule, deleteMessages, showRptMdl, setShowRptMdl, deleteAllMessage
  };

  return (
    <UserActionContext.Provider value={value}>
      {children}
    </UserActionContext.Provider>
  );
};
