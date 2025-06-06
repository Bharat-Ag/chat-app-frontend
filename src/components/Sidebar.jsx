import { useContext, useEffect } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { OnlineBullet } from '../assets/Icons/CustomIcon'
import DOMPurify from 'dompurify';
import { stripHtml } from '../libs/utils'

export default function Sidebar() {
    const { getUsers, users, setSelectedUser, unseenMessages, setUnseenMessages, setUsers, selectedUser, lastMessages } = useContext(ChatContext)
    const { onlineUser, onlineVisibilityMap, socket, isLoading, setLoading, } = useContext(AuthContext);
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
        <div>
            <div className="p-5 flex flex-col h-full max-w-[480px]">
                <div className='flex items-center'>
                    {/*                     <img src={assets.mainLogo} alt="" className='max-w-10' /> */}
                    <span className='font-bold ml-4 text-xl'>Chat</span>
                </div>
                <hr className='my-5 text-white/15' />
                <div className='flex flex-col flex-grow-1 overflow-y-auto max-h[calc(100dvh-248px)]'>
                    {users?.map((user) => {
                        const isVisible = onlineVisibilityMap[user._id] ?? onlineUser.includes(user._id);
                        const plainText = stripHtml(lastMessages[user._id]?.text || "No message yet");
                        return (
                            <div onClick={() => {
                                setSelectedUser(user);
                                setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                                setLoading(true)
                            }} key={user._id} className={`rounded-lg flex items-center relative gap-2 p-2 pl-4 cursor-pointer max-sm:text-sm  ${selectedUser && user._id === selectedUser._id ? 'bg-[#222] rounded-lg ' : 'hover:bg-[#1f2d3a]'}`}>
                                <div className='relative'>
                                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='rounded-full w-[40px] aspect-square min-w-[40px]' />
                                    <OnlineBullet state={isVisible ? "online" : "offline"} />

                                </div>
                                <div className='flex flex-col leading-5 flex-grow-1'>
                                    <p>{user.fullName}</p>
                                    <p className="text-gray-300 text-sm sidebar-lastext-show" >{plainText}</p>
                                </div>
                                {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs w-5 aspect-square flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                            </div>
                        )
                    })}
                </div>
                <hr className='my-5 text-white/15' />
                <div>
                    <p className='text-[13px] text-red-400 leading-4'>** all chats will be cleared after logout so change the settings rona nai baad me</p>
                </div>
            </div>
        </div>
    )
}
