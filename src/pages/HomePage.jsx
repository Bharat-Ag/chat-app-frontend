import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import assets from '../assets/assets'
import ChatContainer from '../components/ChatContainer';
import LogoutMdl from '../components/LogoutMdl';
import ProfileMdl from '../components/ProfileMdl';
import { AuthContext } from '../context/AuthContext';
import { UserListSelct } from '../components/UserListSelct';
import ChangePassMdl from '../components/ChangePassMdl';
import { Dropdown, ConfigProvider, Switch } from 'antd';
import { UserActionContext } from '../context/UserActionContext';
import { OnlineBullet } from '../assets/Icons/CustomIcon';
import toast from 'react-hot-toast';

export default function HomePage() {
    const [profileMenu, setProfileMenu] = useState(false)
    const [modlOpen, setModlOpen] = useState(false);
    const { setChangePassMdl, setProfileMdl, setShowOnline, showOnline, changeOnlineStatus } = useContext(UserActionContext);
    const { authUser, socket } = useContext(AuthContext);

    const handleLogout = () => {
        setModlOpen(true)
    }

    const items = [
        {
            label: (<span className="cursor-pointer text-sm block">View Profile</span>),
            key: '0',
            onClick: () => setProfileMdl(true),
        },
        {
            label: (<span className="cursor-pointer text-sm block">Change Password</span>),
            key: '1',
            onClick: () => setChangePassMdl(true),
        },
        {
            type: 'divider',
        },
        {
            label: (<span className="cursor-pointer text-sm block">Logout</span>),
            key: '3',
            onClick: handleLogout,
        },
    ];
    const handleSwitchChange = (val, e) => {
        e?.domEvent?.stopPropagation();
        setShowOnline(val);
        changeOnlineStatus(val);
        socket?.emit("updateOnlineVisibility", {
            userId: authUser._id,
            isOnlineVisible: val,
        });
        toast(val ? "Online hai tu jh**tu" : "Ban gya cool offline hoke", { duration: 2000 });
    };


    return (
        <>
            <ChangePassMdl />
            <ProfileMdl />
            <LogoutMdl setOpen={setModlOpen} open={modlOpen} />
            <div className='w-full h-screen'>
                <div className="h-full flex flex-col">
                    <div className='p-2 flex items-center'>
                        <div className="flex-grow-1"></div>
                        <div className="max-w-[550px] w-full">
                            <UserListSelct />
                        </div>
                        <div className="flex-grow-1">
                            <div className='flex justify-end gap-4 items-center'>
                                <div className='flex flex-col items-end'>
                                    <span className='text-[12px]'>Onilne Status</span>
                                    <ConfigProvider wave={{ disabled: true }}>
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                        >
                                            <Switch
                                                className='onlineSwitch'
                                                value={showOnline}
                                                onChange={handleSwitchChange}
                                            />
                                        </div>
                                    </ConfigProvider>
                                </div>
                                <div className="relative w-fit h-fit">
                                    <Dropdown className='theme-dd' menu={{ items }} overlayClassName="theme-dd-ovr" trigger={['click']}>
                                        <div>
                                            <img src={authUser.profilePic || assets.avatar_icon} alt="" className={`w-8 h-8 rounded-full cursor-pointer hover:ring-4 hover:ring-gray-700 transition duration-200 `} onClick={() => setProfileMenu(!profileMenu)} />
                                            <OnlineBullet state={`${showOnline ? 'online' : 'offline'}`} />
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`flex-grow-1 overflow-hidden grid relative md:grid-cols-[1fr_3fr]`}>
                        <Sidebar />
                        <ChatContainer />
                    </div>
                </div>
            </div>
        </>
    )
}
