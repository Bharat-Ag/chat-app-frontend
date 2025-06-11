import { useEffect, useState } from "react";

const useTypingStatus = (socket, selectedUserId) => {
    const [typingUserId, setTypingUserId] = useState(null);

    useEffect(() => {
        if (!socket || !selectedUserId) return;

        const handleTyping = ({ senderId }) => {
            if (senderId === selectedUserId) {
                setTypingUserId(senderId);
            }
        };

        const handleStopTyping = ({ senderId }) => {
            if (senderId === selectedUserId) {
                setTypingUserId(null);
            }
        };

        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
        };
    }, [socket, selectedUserId]);

    return typingUserId;
};

export default useTypingStatus;