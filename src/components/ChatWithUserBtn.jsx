import React, { useContext, useEffect, useState } from 'react';
import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { FaRegUser } from "react-icons/fa";
import { FloatButton, Switch } from 'antd';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import UserImage from './UserImage';

export default function ChatWithUserBtn() {
    const [open, setOpen] = useState(true);
    const { getUsers, users, setSelectedUser, unseenMessages, setUnseenMessages, setUsers, selectedUser, lastMessages } = useContext(ChatContext)
    const { onlineUser, onlineVisibilityMap, socket, isLoading, setLoading, } = useContext(AuthContext);
    useEffect(() => {
        getUsers();

    }, [onlineUser])

    const userJsx = (
        <div className='bg-[#444] rounded-md'>
            <ul>
                {users?.map((user) => {
                    const isVisible = onlineVisibilityMap[user._id] ?? onlineUser.includes(user._id); 
                    return (
                        <div onClick={() => {
                            if (selectedUser?._id == user?._id) {
                                return null
                            } else { setSelectedUser(user); }
                            setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                            setLoading(true)
                        }} key={user._id} className={`rounded-lg flex items-center group relative text-white gap-2 p-2 cursor-pointer max-sm:text-sm  ${selectedUser && user._id === selectedUser._id ? 'bg-[#222] rounded-lg ' : 'hover:bg-[#1f2d3a]'}`}>
                            <UserImage fontSz='15' user={user} bubbleSize={'40'} />
                            <div className='flex flex-col leading-5 flex-grow-1 select-none relative'>
                                <p className='text-gray-200 sidebar-lastext-show'>{user.fullName}</p>
                            </div>
                            {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-7 text-xs w-5 aspect-square flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                        </div>
                    )
                })}

            </ul>
        </div>
    )

    return (
        <>
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ insetInlineEnd: 15 }}
                icon={<CustomerServiceOutlined />}
            >
                {userJsx}
            </FloatButton.Group>
        </>
    )
}
