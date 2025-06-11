import React, { useContext, useState } from 'react';
import { Modal, Spin } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { UserActionContext } from '../context/UserActionContext';

const LogoutMdl = ({ open, setOpen }) => {
    const { logout, token, axios } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const { changeOnlineStatus } = useContext(UserActionContext);

    const handleOk = async () => {
        setIsLoading(true);
        setTimeout(async () => {
            await logout();
            setOpen(false);
            setIsLoading(false);
        }, 1050);
        changeOnlineStatus(false);
    };

    const handleCancel = () => {
        if (!isLoading) {
            setOpen(false);
        }
    };

    return (
        <Modal
            open={open}
            centered
            footer={null}
            closeIcon={null}
            width="100%"
            modalRender={(node) => (
                <div className="w-full max-w-[350px] mx-auto p-0">{node}</div>
            )}
        >
            <div className="grid grid-cols-2 gap-3">
                <button
                    className="text-lg font-semibold bg-slate-500 rounded-md text-white p-2 disabled:opacity-50"
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    className="text-lg font-semibold bg-red-600 rounded-md text-white p-2 flex items-center justify-center"
                    onClick={handleOk}
                    disabled={isLoading}
                >
                    {isLoading ? <Spin className="custom-white-spinner" /> : 'Logout'}
                </button>
            </div>
        </Modal>
    );
};

export default LogoutMdl;
