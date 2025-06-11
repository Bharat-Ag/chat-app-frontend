import React, { useContext, useState } from 'react'
import { UserActionContext } from '../context/UserActionContext';

export default function ReportMdl() {
    const { showRptMdl, setShowRptMdl } = useContext(UserActionContext);
    const [issueT, setIssueT] = useState([])
    const handleSubmit = async () => {

    }

    const handleCancel = () => {
        setShowRptMdl(false);
    }

    return (
        <>
            <Modal
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showRptMdl}
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
    )
}
