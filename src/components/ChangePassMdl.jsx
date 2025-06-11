import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Modal } from 'antd';
import toast from 'react-hot-toast';
import { UserActionContext } from '../context/UserActionContext';

export default function ChangePassMdl() {
    const { authUser, changePass } = useContext(AuthContext);
    const { changePassMdl, setChangePassMdl } = useContext(UserActionContext);
    const [formData, setFormData] = useState({
        newPass: '',
        confPass: ""
    });

    const handleChange = async (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleCancel = () => {
        setChangePassMdl(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { newPass, confPass } = formData;
        if (confPass === "" & newPass === "") return;
        if (confPass !== newPass) {
            toast.error('Confirm password not matched with new password')
            return;
        }
        await changePass({ password: newPass });
        handleCancel();
    }

    return (
        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={changePassMdl}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <div>
                <div className='bg-[#191919] rounded-2xl p-6  text-white'>
                    <form className="mx-auto space-y-4" onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
                        <div className=''>
                            <label className="block text-sm font-medium mb-1">Email <small className='text-[10px]'>  (Can't be change)</small></label>
                            <p
                                className="w-full px-4 py-2 border text-white/65 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"

                            >{authUser.email}</p>
                        </div>
                        <div className=''>
                            <label className="block text-sm font-medium mb-1">New password</label>
                            <input type='password' className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Password"
                                onChange={handleChange}
                                name='newPass'
                                value={formData.newPass} />
                        </div>
                        <div className=''>
                            <label className="block text-sm font-medium mb-1">Confirm password</label>
                            <input type='password' className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Confirm password"
                                onChange={handleChange}
                                name='confPass'
                                value={formData.confPass} />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
