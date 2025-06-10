import { useContext, useEffect } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { Collapse } from 'antd'
import AllUserTab from './sidebar/AllUserTab'
import { CarrotIcon } from '../assets/Icons/CustomIcon'
import PinnedUserTab from './sidebar/PinnedUserTab'

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


    const items = [
        {
            key: '0',
            label: 'Pinned',
            children: <PinnedUserTab key={'All Users'} />
        },
        {
            key: '1',
            label: 'All User',
            children: <AllUserTab key={'Pinned Users'} />
        },
    ];


    return (
        <div className='h-full'>
            <div className="p-5 flex flex-col h-full max-w-[480px]">
                <div className='flex items-center'>
                    {/*                     <img src={assets.mainLogo} alt="" className='max-w-10' /> */}
                    <span className='font-bold ml-4 text-xl'>Chat</span>
                </div>
                <hr className='my-5 text-white/15' />
                <div className='flex flex-col flex-grow-1 overflow-y-auto max-h[calc(100dvh-248px)]'>
                    <Collapse
                        expandIcon={({ isActive }) => <CarrotIcon rotate={isActive ? 90 : 0} />}
                        bordered={false}
                        items={items}
                        className='colbs-user'
                        defaultActiveKey={['1']}
                    />
                </div>
                <hr className='my-5 text-white/15' />
                <div>
                    <p className='text-[13px] text-red-400 leading-4'>** all chats will be cleared after logout so change the settings rona nai baad me</p>
                </div>
            </div>
        </div>
    )
}