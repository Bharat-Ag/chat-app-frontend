import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ShowUserProfileMdl from '../components/ShowUserProfileMdl';
import UserImage from '../components/UserImage';
import { ChatContext } from '../context/ChatContext';
import { useIsMobile } from '../hook/useIsMobile';
import ChatWithUserBtn from '../components/ChatWithUserBtn';

export default function HomePage() {
    const [profileMenu, setProfileMenu] = useState(false)
    const [modlOpen, setModlOpen] = useState(false);
    const { unseenMessages } = useContext(ChatContext);
    const { setChangePassMdl, setProfileMdl, setShowOnline, showOnline, changeOnlineStatus, deleteAllMessage } = useContext(UserActionContext);
    const { authUser, socket, token } = useContext(AuthContext);
    const timeoutRef = useRef(null);
    const originalTitle = useRef(document.title);
    const isMobile = useIsMobile();
    const handleLogout = () => {
        setModlOpen(true)
    }
    const handleSwitchChange = (val, e) => {
        e?.domEvent?.stopPropagation();
        setShowOnline(val);
        changeOnlineStatus(val);
        socket?.emit("updateOnlineVisibility", {
            userId: authUser._id,
            isOnlineVisible: val,
        });
        toast(val ? "Online hai tu ab chal" : "Ban gya cool offline hoke", { duration: 2000 });
    };
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
            label: (
                <div className=' flex lg:hidden items-center gap-1'>
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
            ),
            key: '2',
            onClick: () => setChangePassMdl(true),
            className: 'head-dd-margin-remove',
        },
        {
            type: 'divider',
        },
        {
            label: (<span className="cursor-pointer text-sm block">Logout</span>),
            key: '3',
            onClick: handleLogout,
        },
        {
            type: 'divider',
            className: 'last-divider'
        },
        {
            label: (<span className='flex lg:hidden  text-[14px]  hover:text-blue-400 cursor-pointer'>Report an issue</span>),
            key: '4',
            onClick: handleLogout,
            className: 'head-dd-margin-remove',
        },
    ];


    useEffect(() => {
        const handleUnload = () => {
            deleteAllMessage(token)
            changeOnlineStatus(false);
        }

        window.addEventListener('unload', handleUnload);
        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, []);


    return (
        <>
            <ChangePassMdl />
            <ProfileMdl />
            <ShowUserProfileMdl />
            {isMobile && (
                <ChatWithUserBtn />
            )}
            <LogoutMdl setOpen={setModlOpen} open={modlOpen} />
            <div className='w-full h-screen' onContextMenu={(e) => e.preventDefault()}>
                <div className="h-full flex flex-col">
                    <div className='p-2 flex items-center gap-3 sm:gap-0'>
                        <div className="flex-grow-1">
                            <span className='hidden lg:flex text-[14px] pl-5 hover:text-blue-400 cursor-pointer'>Report an issue</span>
                        </div>
                        <div className="max-w-[550px] w-full">
                            <UserListSelct />
                        </div>
                        <div className="flex-grow-1">
                            <div className='flex justify-end gap-4 items-center'>
                                <div className='hidden lg:flex flex-col items-end'>
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
                                            <UserImage fontSz='15' user={authUser} bubbleSize='32' className=" cursor-pointer hover:ring-4 hover:ring-gray-500 transition duration-200" clickFunc={() => setProfileMenu(!profileMenu)} />
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className={`flex-grow-1 overflow-hidden grid relative md:grid-cols-[1fr_3fr]`}>
                        <Sidebar />
                        <ChatContainer />
                    </div> */}
                    <PanelGroup autoSaveId="example" direction="horizontal">
                        {!isMobile && (
                            <>
                                <Panel collapsible={true} defaultSize={20} maxSize={23}>
                                    <Sidebar />
                                </Panel>
                                <PanelResizeHandle className="w-1.5 rounded hover:bg-blue-500 data-[resize-handle-state=drag]:bg-blue-500" />
                            </>
                        )}
                        <Panel defaultSize={isMobile ? 100 : 80}>
                            <ChatContainer />
                        </Panel>
                    </PanelGroup>
                </div>
            </div>
        </>
    )
}