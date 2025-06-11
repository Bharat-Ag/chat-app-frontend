import { useContext, useEffect } from "react";
import { UserActionContext } from "../../context/UserActionContext";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { OnlineBullet } from "../../assets/Icons/CustomIcon";
import { stripHtml } from "../../libs/utils";
import assets from "../../assets/assets";

export default function PinnedUserTab() {
    const { pinnedUser, unpinUser } = useContext(UserActionContext);
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
    const handleUnPinned = (e, userId) => {
        e.stopPropagation()
        if (pinnedUser.includes(userId)) {
            unpinUser(userId);
        }
    }
    useEffect(() => {
        if (!isLoading) return;

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1050);

        return () => clearTimeout(timer);
    }, [isLoading]);

    const pinnerUser = users.filter(u => pinnedUser.includes(u._id));

    return (
        <>
            {pinnerUser?.map((user) => {
                const isVisible = onlineVisibilityMap[user._id] ?? onlineUser.includes(user._id);
                const plainText = stripHtml(lastMessages[user._id]?.text || "No message yet");
                return (
                    <div onClick={() => {
                        setSelectedUser(user);
                        setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                        setLoading(true)
                    }} key={user._id} className={`rounded-lg flex items-center group relative gap-2 p-2 pl-4 cursor-pointer max-sm:text-sm hover:bg-[#1f2d3a] ${selectedUser && user._id === selectedUser._id ? ' rounded-lg ' : ''}`}>
                        <div className='relative'>
                            <img src={user?.profilePic || assets.avatar_icon} alt="" className='rounded-full w-[40px] aspect-square min-w-[40px]' />
                            <OnlineBullet state={isVisible ? "online" : "offline"} />

                        </div>
                        <div className='flex flex-col leading-5 flex-grow-1 select-none relative'>
                            <p className='text-gray-200'>{user.fullName}</p>
                            <p className="text-gray-300 text-sm sidebar-lastext-show" >{plainText}</p>
                            <div className='absolute right-0 top-0 text-gray-200 rotate-45 opacity-100' onClick={(e) => handleUnPinned(e, user._id)}>
                                <i class="fa-solid fa-thumbtack"></i>
                            </div>
                        </div>
                        {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs w-5 aspect-square flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                    </div>
                )
            })}
        </>
    )
}