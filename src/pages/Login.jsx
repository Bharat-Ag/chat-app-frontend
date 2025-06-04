import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserActionContext } from '../context/UserActionContext';
import toast from 'react-hot-toast';

export default function Login() {
    const { changeOnlineStatus } = useContext(UserActionContext)
    const [currSt, setCurrSt] = useState('Sign Up');
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        bio: '',
    });

    const { login } = useContext(AuthContext);
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const toggleState = () => {
        setCurrSt((prev) => (prev === 'Sign Up' ? 'Login' : 'Sign Up'));
        setFormData({ fullName: '', email: '', password: '', bio: '' });
        setIsDataSubmitted(false);
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currSt === 'Sign Up' && !isDataSubmitted) {
                setIsDataSubmitted(true);
                return;
            }

            const { fullName, email, password, bio } = formData;
            await login(currSt === "Sign Up" ? "signup" : "login", { fullName, email, password, bio });

            toast.success("Welcome!");

        } catch (error) {
            toast.error('Issue in updating the online status');
        }
    };


    return (
        <div className="w-full min-h-screen bg-main bg-cover bg-center flex justify-center items-center p-4">
            <div className="bg-white/10 backdrop-blur-[1px] p-4 rounded-2xl w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-2xl">
                {/* Left Panel */}
                <div className="hidden sm:flex flex-col justify-center items-center text-white text-center p-3">
                    <h2 className="text-2xl font-bold">{currSt === 'Login' ? 'Bina login k chat hi nai kr skta ( lol )' : "Tujhe login krna hi padega dost kuch bhi krle"}</h2>
                    <p className="text-md my-4">
                        {currSt === 'Sign Up'
                            ? 'Login kar suar ab'
                            : "Account nahi hai toh bana na bkl"}
                    </p>
                    <button
                        onClick={toggleState}
                        className="cursor-pointer px-10 py-2 bg-white mt-6 text-blue-600 rounded-full font-semibold hover:-translate-y-1 transition-transform duration-300 text-lg"
                    >
                        {currSt === 'Sign Up' ? 'Login' : 'Sign Up'}
                    </button>
                </div>
                <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col justify-center  rounded-xl p-4"
                >
                    <h2 className="text-4xl font-bold text-center text-white mb-6">
                        {currSt === 'Sign Up' ? (isDataSubmitted ? 'Add Bio' : 'Sign Up') : 'Login'}
                    </h2>

                    {
                        currSt !== "Login" && !isDataSubmitted && (
                            <div className='mb-4'>
                                <label htmlFor="" className='text-white block text-sm mb-0.5'>Full Name</label>
                                <input
                                    value={formData.fullName}
                                    name='fullName'
                                    onChange={handleChange}
                                    type='text'
                                    autoComplete='off'
                                    className="p-2 border-2 border-white/35 w-full rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                        )
                    }

                    {!isDataSubmitted && (
                        <>
                            <div className='mb-4'>
                                <label htmlFor="" className='text-white block text-sm mb-0.5'>Email</label>
                                <input
                                    value={formData.email}
                                    name='email'
                                    onChange={handleChange}
                                    type='email' className="p-2 border-2 border-white/35 w-full text-white  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" autoComplete='off' />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="" className='text-white block text-sm mb-0.5'>Password</label>
                                <input
                                    value={formData.password}
                                    name='password'
                                    onChange={handleChange}
                                    type='password' className="p-2 border-2 border-white/35 w-full  text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" autoComplete='new-password' />
                            </div>
                        </>
                    )}

                    {isDataSubmitted && (<div className='mb-4'>
                        <label htmlFor="" className='text-white block text-sm mb-0.5'>Bio</label>
                        <textarea value={formData.bio} name='bio' onChange={handleChange} className="p-2 border-2 border-white/35 w-full  text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none " rows={5} />
                    </div>)}

                    <button type='submit' className='w-full rounded-md cursor-pointer p-2 mt-3 text-blue-600 bg-white hover:bg-white/90 transition-colors duration-200'>
                        {currSt === 'Sign Up'
                            ? isDataSubmitted
                                ? 'Submit'
                                : 'Next'
                            : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}