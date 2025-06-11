import React, { memo, useContext, useState } from 'react';
import { Modal } from 'antd';
import { UserActionContext } from '../context/UserActionContext';
import { ChatContext } from '../context/ChatContext';
import { formateDate } from '../libs/utils';
import UserImage from './UserImage';

const ShowUserProfileMdl = () => {
    const { showUserDtMdl, setShowUserDtMdl } = useContext(UserActionContext);
    const { selectedUser } = useContext(ChatContext);
    const [copied, setCopied] = useState(false)

    const handleCancel = () => {
        setShowUserDtMdl(false);
    };

    return selectedUser && (
        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={showUserDtMdl}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <div className='bg-[#191919] rounded-2xl p-6  text-white'>
                <div className='flex items-center'>
                    <UserImage user={selectedUser} bulletSize={5} bubbleSize={'88'} fontSz='30' />
                    <div className='ml-3 '>
                        <h2 className='text-2xl font-bold capitalize'>{(selectedUser?.fullName)}</h2>
                        <div>
                            <span onClick={() => {
                                setShowUserDtMdl(false)
                            }} className='text-gray-400 hover:text-blue-400 text-xl cursor-pointer' title='Show Chat'><i className="fa-solid fa-message"></i></span>
                        </div>
                    </div>
                </div>
                <hr className='my-6 opacity-[10%]' />
                {
                    selectedUser?.isOnlineVisible && (
                        <>
                            <div className='border border-white/15 rounded-lg p-2'>
                                <i className="fa-solid fa-circle-check text-green-500 mr-3"></i>
                                Available
                            </div>
                            <div className='mb-6 opacity-[10%]' />
                        </>
                    )
                }

                <div>
                    <span className='text-sm font-bold mb-3 block'>Contact information</span>
                    <div>
                        <ul>
                            <li className='relative w-fit overflow-hidden hover:bg-[#2a2a2a] rounded-sm group'>
                                <a href={`mailto:${selectedUser?.email}`} className='flex items-center gap-3 p-2 '>
                                    <div className="inx">
                                        <i className="fa-solid fa-envelope text-gray-400"></i>
                                    </div>
                                    <div>
                                        <span className='text-[11px] text-gray-400 block leading-3'>Email</span>
                                        <p className='text-[13px] text-blue-400 leading-4'>{selectedUser?.email}</p>
                                    </div>
                                    <div className='absolute right-0 h-full flex items-center justify-center px-1.5 bg-[#2a2a2a] opacity-0 group-hover:opacity-100'>
                                        <i
                                            className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} px-1 ${copied ? 'text-blue-400' : 'text-gray-400 '} cursor-pointer hover:text-blue-400`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigator.clipboard.writeText(selectedUser?.email);
                                                setCopied(true);
                                                setTimeout(() => {
                                                    setCopied(false);
                                                }, 2000);
                                            }}
                                        ></i>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr className='my-6 opacity-[10%]' />
                <div>
                    <span className='text-sm font-bold mb-3 block'>Details</span>
                    <div className=' text-gray-400'>
                        <div className=''>
                            <span className='text-sm mb-1 block'>Bio</span>
                            <p className='border border-white/15 rounded-lg p-2'>
                                {selectedUser?.bio}
                            </p>
                        </div>
                        <div className='mt-3'>
                            <span className='text-sm mb-1 block'>Joined on</span>
                            <p className='border border-white/15 rounded-lg p-2'>
                                {formateDate(selectedUser?.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default memo(ShowUserProfileMdl);