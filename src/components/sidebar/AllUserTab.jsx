import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { stripHtml } from '../../libs/utils';
import { OnlineBullet } from '../../assets/Icons/CustomIcon';
import assets from '../../assets/assets';
import { UserActionContext } from '../../context/UserActionContext';
import UserImage from '../UserImage';

export default function AllUserTab() {
    const { getUsers, users, setSelectedUser, unseenMessages, setUnseenMessages, setUsers, selectedUser, lastMessages } = useContext(ChatContext)
    const { onlineUser, onlineVisibilityMap, socket, isLoading, setLoading, } = useContext(AuthContext);
    const { pinnedUser, pinUser } = useContext(UserActionContext);

    const handlePinned = (e, userId) => {
        e.stopPropagation()
        if (!pinnedUser.includes(userId)) {
            pinUser(userId);
        }
    }

    useEffect(() => {
        getUsers();
    }, [onlineUser])

    useEffect(() => {
        if (!socket) return;
        const handleVisibilityUpdate = ({ userId, isOnlineVisible }) => {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, isOnlineVisible } : user
                )
            );
        };
        socket.on("receiveOnlineVisibilityUpdate", handleVisibilityUpdate);
        return () => {
            socket.off("receiveOnlineVisibilityUpdate", handleVisibilityUpdate);
        };
    }, [socket]);

    useEffect(() => {
        if (!isLoading) return;
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1050);

        return () => clearTimeout(timer);
    }, [isLoading]);

    return (
        <>
            {users?.map((user) => {
                const isVisible = onlineVisibilityMap[user._id] ?? onlineUser.includes(user._id);
                const plainText = stripHtml(lastMessages[user._id]?.text || "No message yet");
                return (
                    <div onClick={() => {
                        if (selectedUser?._id == user?._id) {
                            return null
                        } else { setSelectedUser(user); }
                        setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                        setLoading(true)
                    }} key={user._id} className={`rounded-lg flex items-center group relative text-white gap-2 p-2 pl-4 cursor-pointer max-sm:text-sm  ${selectedUser && user._id === selectedUser._id ? 'bg-[#222] rounded-lg ' : 'hover:bg-[#1f2d3a]'}`}>
                        <UserImage fontSz='15' user={user} bubbleSize={'40'} />
                        <div className='flex flex-col leading-5 flex-grow-1 select-none relative'>
                            <p className='text-gray-200 sidebar-lastext-show'>{user.fullName}</p>
                            <p className="text-gray-300 text-sm sidebar-lastext-show" >{plainText}</p>
                            <div className='absolute right-0 top-0 text-gray-500 rotate-45 opacity-0 group-hover:opacity-100' onClick={(e) => handlePinned(e, user._id)}>
                                <i className="fa-solid fa-thumbtack"></i>
                            </div>
                        </div>
                        {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-7 text-xs w-5 aspect-square flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                    </div>
                )
            })}
        </>
    )
}
