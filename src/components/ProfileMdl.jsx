import React, { useContext, useState } from 'react';
import { Modal, Spin } from 'antd';
import { AuthContext } from '../context/AuthContext';
import assets from '../assets/assets';
import { UserActionContext } from '../context/UserActionContext';
import toast from 'react-hot-toast';

export default function ProfileMdl() {
    const { profileMdl, setProfileMdl, setChangePassMdl } = useContext(UserActionContext);
    const { authUser, updateProfile } = useContext(AuthContext);
    const originalData = {
        fullName: authUser?.fullName,
        bio: authUser?.bio,
        profilePic: authUser?.profilePic
    };

    const [formData, setFormData] = useState({
        fullName: originalData.fullName,
        email: authUser?.email,
        password: authUser?.password,
        bio: originalData.bio,
    });

    const [selectImage, setSelectImage] = useState(null);
    const handleCancel = () => {
        setProfileMdl(false);
    };
    const handleChange = async (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, bio } = formData;
        const isNameChanged = fullName !== originalData.fullName;
        const isBioChanged = bio !== originalData.bio;
        const isImageChanged = !!selectImage;

        if (!isNameChanged && !isBioChanged && !isImageChanged) {
            toast("Looks like you changed nothing", { duration: 3000, });
            setProfileMdl(false);
            return;
        }

        if (!isImageChanged) {
            await updateProfile({ fullName, bio });
            setProfileMdl(false);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectImage);
        reader.onload = async () => {
            const base64Image = reader.result;
            await updateProfile({ profilePic: base64Image, fullName, bio });
            setProfileMdl(false);
        };
    };

    return (
        <>
            <Modal
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={profileMdl}
                onCancel={handleCancel}
                footer={null}
                centered
            >
                <div>
                    <div className='bg-[#191919] rounded-2xl p-6  text-white'>
                        <form className="mx-auto space-y-4" onSubmit={handleSubmit}>
                            <h2 className="text-2xl font-bold text-center">Update Profile</h2>
                            <div className="">
                                <label className="cursor-pointer font-medium  flex items-center gap-4 w-fit" htmlFor='avatar'>
                                    <img
                                        src={selectImage ? URL.createObjectURL(selectImage) : assets.avatar_icon}
                                        alt="Profile Preview"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    Change Photo
                                    <input onChange={(e) => setSelectImage(e.target.files[0])} type="file" id='avatar' hidden accept=".png, .jpg, .jpeg" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-1">Name</label>
                                <input
                                    type="text"
                                    autoComplete='off'
                                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Your Name"
                                    onChange={handleChange}
                                    name='fullName'
                                    value={formData.fullName}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium  mb-1">Bio</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                    placeholder="Tell us something about yourself..."
                                    onChange={handleChange}
                                    name='bio'
                                    value={formData.bio}
                                ></textarea>
                            </div>
                            <div className=''>
                                <label className="block text-sm font-medium mb-1">Email <small className='text-[10px]'>  (Can't be change)</small></label>
                                <p
                                    className="w-full px-4 py-2 border text-white/65 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"

                                >{formData.email}</p>
                            </div>
                            <div className='flex'>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Save
                                </button>
                                <span className='w-fit flex items-center justify-center md:px-4'>or</span>
                                <button
                                    onClick={() => {
                                        handleCancel();
                                        setChangePassMdl(true);
                                    }}
                                    type="button"
                                    className="w-full py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
}
