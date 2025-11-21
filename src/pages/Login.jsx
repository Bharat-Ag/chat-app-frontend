import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserActionContext } from '../context/UserActionContext';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function Login() {
    // const { changeOnlineStatus } = useContext(UserActionContext);
    const [currSt, setCurrSt] = useState('Sign Up');
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const { login } = useContext(AuthContext);
    const toggleState = (resetForm) => {
        setCurrSt((prev) => (prev === 'Sign Up' ? 'Login' : 'Sign Up'));
        setFormData({ fullName: '', email: '', password: '', bio: '' });
        setIsDataSubmitted(false);
        resetForm(); // <-- resets values and errors
    };

    const initialValues = {
        fullName: '',
        email: '',
        password: '',
        bio: '',
    };

    const validationSchem = (values, currSt, isDataSubmitted) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // LOGIN validation
        if (currSt === 'Login') {
            if (!values.email) {
                errors.email = "Enter Email";
            } else if (!emailRegex.test(values.email)) {
                errors.email = "Email is incorrect";
            }

            if (!values.password) {
                errors.password = "Enter Password";
            } else if (values.password.length < 6) {
                errors.password = "Min Length 6";
            }
        }

        // SIGNUP step 1 (before bio)
        if (currSt === 'Sign Up' && !isDataSubmitted) {
            if (!values.fullName) {
                errors.fullName = "Enter Full Name";
            }

            if (!values.email) {
                errors.email = "Enter Email";
            } else if (!emailRegex.test(values.email)) {
                errors.email = "Email is incorrect";
            }

            if (!values.password) {
                errors.password = "Enter Password";
            } else if (values.password.length < 6) {
                errors.password = "Min Length 6";
            }
        }

        // SIGNUP step 2 (bio step)
        if (currSt === 'Sign Up' && isDataSubmitted) {
            if (!values.bio || values.bio.trim() === "") {
                errors.bio = "Bio is required";
            }
        }

        return errors;
    };


    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            if (currSt === 'Sign Up' && !isDataSubmitted) {
                setIsDataSubmitted(true);
                setSubmitting(false);
                return;
            }

            const { fullName, email, password, bio } = values;
            await login(currSt === "Sign Up" ? "signup" : "login", {
                fullName,
                email,
                password,
                bio,
            });
        } catch (error) {
            toast.error('Issue in updating the online status');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-main bg-cover bg-center flex justify-center items-center p-4">
            <div className="bg-white/10 backdrop-blur-[1px] p-4 rounded-2xl w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-2xl">
                {/* Left Panel */}
                <Formik
                    initialValues={initialValues}
                    validate={(values) => validationSchem(values, currSt, isDataSubmitted)}
                    onSubmit={handleFormSubmit}
                >
                    {({ isSubmitting, resetForm }) => (
                        <>
                            {/* Left Panel */}
                            <div className="hidden sm:flex flex-col justify-center items-center text-white text-center p-3">
                                <h2 className="text-2xl font-bold">
                                    {currSt === 'Login'
                                        ? 'use => test@test.com | 123456'
                                        : "Please login first"}
                                </h2>
                                <p className="text-md my-4">
                                    {currSt === 'Sign Up'
                                        ? 'use => test@test.com | 123456'
                                        : "Create Account First"}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setIsDataSubmitted(false);
                                        setCurrSt((prev) => prev === 'Sign Up' ? 'Login' : 'Sign Up');
                                    }}
                                    className="cursor-pointer px-10 py-2 bg-white mt-6 text-blue-600 rounded-full font-semibold hover:-translate-y-1 transition-transform duration-300 text-lg"
                                >
                                    {currSt === 'Sign Up' ? 'Login' : 'Sign Up'}
                                </button>
                            </div>

                            {/* Form Section (as you already have it) */}
                            <Form className="flex flex-col justify-center rounded-xl p-4">
                                <h2 className="text-4xl font-bold text-center text-white mb-6">
                                    {currSt === 'Sign Up'
                                        ? isDataSubmitted ? 'Add Bio' : 'Sign Up'
                                        : 'Login'}
                                </h2>

                                {/* Full Name */}
                                {currSt !== 'Login' && !isDataSubmitted && (
                                    <div className="mb-4">
                                        <label className="text-white block text-sm mb-0.5">Full Name</label>
                                        <Field
                                            name="fullName"
                                            type="text"
                                            autoComplete="off"
                                            className="p-2 border-2 border-white/35 w-full rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        />
                                        <ErrorMessage name="fullName" component="div" className="text-white text-[12px] mt-1" />
                                    </div>
                                )}

                                {/* Email & Password */}
                                {!isDataSubmitted && (
                                    <>
                                        <div className="mb-4">
                                            <label className="text-white block text-sm mb-0.5">Email</label>
                                            <Field
                                                name="email"
                                                type="email"
                                                autoComplete="off"
                                                className="p-2 border-2 border-white/35 w-full text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-white text-[12px] mt-1" />
                                        </div>

                                        <div className="mb-4">
                                            <label className="text-white block text-sm mb-0.5">Password</label>
                                            <Field
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                className="p-2 border-2 border-white/35 w-full text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            />
                                            <ErrorMessage name="password" component="div" className="text-white text-[12px] mt-1" />
                                        </div>
                                    </>
                                )}

                                {/* Bio */}
                                {isDataSubmitted && (
                                    <div className="mb-4">
                                        <label className="text-white block text-sm mb-0.5">Bio</label>
                                        <Field
                                            name="bio"
                                            as="textarea"
                                            rows={5}
                                            className="p-2 border-2 border-white/35 w-full text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                                        />
                                        <ErrorMessage name="bio" component="div" className="text-white text-[12px] mt-1" />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-md cursor-pointer p-2 mt-3 text-blue-600 bg-white hover:bg-white/90 transition-colors duration-200"
                                >
                                    {currSt === 'Sign Up'
                                        ? isDataSubmitted ? 'Submit' : 'Next'
                                        : 'Login'}
                                </button>
                                <div className='block sm:hidden'>
                                    <p className='text-center pt-8 '>Switch krle krna h toh <button type='button' className='ml-2 cursor-pointer px-5 py-1 bg-white text-blue-600 rounded-full font-semibold text-sm hover:text-black transition-colors duration-200' onClick={() => {
                                        resetForm();
                                        setIsDataSubmitted(false);
                                        setCurrSt((prev) => prev === 'Sign Up' ? 'Login' : 'Sign Up');
                                    }}>{currSt === 'Sign Up' ? 'Login' : 'Sign Up'}</button></p>
                                </div>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
        </div>
    );
}
