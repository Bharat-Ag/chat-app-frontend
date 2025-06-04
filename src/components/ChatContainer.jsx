import { useContext, useEffect, useRef, useState } from 'react'
import assets from "../assets/assets";
import { formateTime } from '../libs/utils';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import toast from 'react-hot-toast';
import { OnlineBullet } from '../assets/Icons/CustomIcon';
import { Select } from 'antd';
import { UserActionContext } from '../context/UserActionContext';

export default function ChatContainer() {
    const { authUser, isLoading } = useContext(AuthContext);
    const { fetchDeleteRule, deleteRule, setDeleteRule, changeDeleteRule, deleteMessages, } = useContext(UserActionContext)
    const { messages, selectedUser, sendMessages, getMessages, setSelectedUser, setTriggerSearch } = useContext(ChatContext)
    const [currTab, setCurrTab] = useState('Chat')
    const [msgImages, setMsgImage] = useState([])
    const scrollEnd = useRef();
    const [input, setInput] = useState('')

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return null;
        await sendMessages({ text: input.trim() });
        setInput('')
    }

    const hanldeSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Select an image file')
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            await sendMessages({ image: reader.result })
            e.target.value = '';
        }

        reader.readAsDataURL(file)
    }

    const handleChange = async (value, userId) => {
        try {
            if (!userId) {
                toast.error("Invalid user.");
                return;
            }

            const updatedRule = await changeDeleteRule(value, userId);
            if (updatedRule) {
                if (value === "After logout") {
                    await deleteMessages("After logout", selectedUser._id);
                } else if (value === "After 24 hours") {
                    await deleteMessages("After 24 hours", selectedUser._id);
                }
                setDeleteRule(updatedRule);
            }
        } catch (error) {
            console.error("Update rule error:", error);
            toast.error("Something went wrong");
        }
    };


    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
            fetchDeleteRule(selectedUser?._id)
        }
        setCurrTab('Chat')

    }, [selectedUser])


    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({
                behavior: "smooth"
            });
        }

        setMsgImage(
            messages.filter(msg => msg.image).map(msg => msg.image)
        )

    }, [messages]);


    useEffect(() => {
        document.title = selectedUser
            ? `${selectedUser.fullName} | Chit-Chat`
            : 'Chit-Chat';
    }, [selectedUser]);


    if (isLoading) {
        return (
            <div className="h-full pb-3">
                <div className='bg-[#191919] md:h-[calc(100dvh-58px-10px)] rounded-lg flex justify-center items-center'>
                    <div className="loader">Loading...</div>
                </div>
            </div>
        );
    }

    return selectedUser ? (
        <>
            <div className='h-full pb-3'>
                <div className='bg-[#191919] md:h-[calc(100dvh-58px-10px)] rounded-lg flex flex-col'>
                    <div className='p-3 px-5 border-b-1 border-white/15'>
                        {/* ---header--- */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center justify-start gap-3'>
                                <button onClick={() => setSelectedUser(null)} className='bg-[#0a0a0a] w-10 aspect-square rounded-full group'><i className="fa-solid fa-arrow-left group-hover:-translate-x-0.5 transition-transform duration-200"></i></button>
                                <div className='w-fit relative cursor-pointer'>
                                    <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className={`w-9 h-9 rounded-full`} />
                                    <OnlineBullet size={2.5} state={`${selectedUser?.isOnlineVisible ? 'online' : 'offline'}`} />
                                </div>
                                <span className='font-bold text-xl'>{selectedUser?.fullName || selectedUser._id}</span>
                                <div>
                                    <Select
                                        className='themeSelect'
                                        value={deleteRule}
                                        placeholder="Delete Chat"
                                        style={{ width: 135 }}
                                        onChange={(val) => {
                                            if (selectedUser?._id) {
                                                handleChange(val, selectedUser._id);
                                            } else {
                                                toast.error("No selected user.");
                                            }
                                        }}
                                        options={[
                                            { value: 'After logout', label: 'After logout (default)' },
                                            { value: 'After 24 hours', label: 'After 24 hours' },
                                        ]}
                                    />
                                </div>
                                <button onClick={async () => {
                                    if (!messages.length < 1) {
                                        deleteMessages("After logout", selectedUser._id);
                                        await getMessages(selectedUser._id);
                                        location.reload();
                                    }
                                }} className='rounded-full hover:bg-blue-600 px-3 py-1 flex items-center justify-center bg-blue-500 text-[12px]'>Clear Chat</button>
                            </div>
                            <div className=''>
                                <button
                                    type='button'
                                    className={`font-bold text-md mr-6  ${currTab === 'Chat' ? 'text-blue-400 ' : 'text-white hover:text-white/85'}`}
                                    onClick={() => setCurrTab('Chat')}
                                >
                                    Chat
                                </button>
                                <button
                                    type='button'
                                    className={`font-bold text-md  ${currTab === 'Media' ? 'text-blue-400 ' : 'text-white hover:text-white/85'}`}
                                    onClick={() => setCurrTab('Media')}
                                >
                                    Media
                                </button>
                            </div>
                        </div>
                    </div>

                    {currTab === 'Chat' ? (<>
                        {/* ---Chat--- */}
                        <div className='p-3 px-5 flex flex-col h-[calc(100%-120px)] overflow-y-auto chatScorll flex-grow-1'>
                            {messages?.map((msg, index) => {
                                return (
                                    <div key={index}  >
                                        <div>
                                            <div className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                                                {msg.image ? (
                                                    <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg outline-hidden mb-8' />
                                                ) : (
                                                    <>
                                                        <p className={`p-2 md:max-w-[550px] xl:max-w-[700px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                                                    </>
                                                )}
                                                <div className={`text-center text-xs `}>
                                                    <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className={`aspect-square rounded-full w-7 overflow-hidden ${msg.senderId !== authUser._id && 'ml-auto'}`} />
                                                    <p className='text-gray-500 mt-2'>{formateTime(msg.createdAt)}</p>
                                                </div>
                                            </div>
                                            {/* <span><i class="fa-solid fa-ellipsis-vertical"></i></span> */}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={scrollEnd}></div>
                        </div>
                        {/* ---Field--- */}
                        <div className='flex-grow-1 p-2 px-5 max-h-[58px]'>
                            <div className='h-full flex items-center justify-center  border border-white/15 rounded-sm px-3'>
                                <input type="text"
                                    placeholder='Type message'
                                    className='h-full w-full outline-none text-sm pr-3'
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                    name='input'
                                    autoComplete='off'
                                    onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} />
                                <input
                                    type="file"
                                    onChange={hanldeSendImage}
                                    id='image'
                                    accept='image/png, image/jpeg' hidden />
                                <label htmlFor="image">
                                    <img src={assets.gallery_icon} alt="" className='w-6 cursor-pointer' />
                                </label>
                                <span className='h-[35px] mb-[3px] self-end  w-[1px] bg-white/15 mx-2'></span>
                                <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-6 cursor-pointer' />
                            </div>
                        </div>
                    </>) : (<div className='p-2 px-5 flex flex-col'>
                        <span className='text-3xl font-semibold block text-center mt-2'>Media</span>
                        <div className='grid mediaContainer gap-5 mt-4 max-h-[calc(100dvh-195px)] overflow-y-auto'>
                            {msgImages.map((img, index) => (
                                <div key={index} className='max-h-[250px]' >
                                    <img src={img} alt="" className='w-full h-full rounded-lg' />
                                </div>
                            ))}
                        </div>
                    </div>)}
                </div>
            </div >
        </>
    ) : (
        <>
            <div className='h-full pb-3'>
                <div className='bg-[#191919] md:h-[calc(100dvh-58px-10px)] rounded-lg'>
                    <div className='flex items-center justify-center h-full'>
                        <button onClick={() => setTriggerSearch(true)} className=' bg-blue-400 w-fit rounded-full py-3 px-8 text-lg hover:bg-blue-500 transition-colors duration-150 font-semibold tracking-wide'>Start Chat</button>
                    </div>
                </div>
            </div >
        </>
    )
}