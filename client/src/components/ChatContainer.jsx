import { useContext, useEffect, useRef, useState } from 'react'
import assets from "../assets/assets";
import { extractLinks, formateTime } from '../libs/utils';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import toast from 'react-hot-toast';
import { OnlineBullet } from '../assets/Icons/CustomIcon';
import { Select, Tooltip } from 'antd';
import { UserActionContext } from '../context/UserActionContext';
import Tiptap from './Tiptap';
import useTypingStatus from '../hook/useTypingStatus';

export default function ChatContainer() {
    const { authUser, isLoading } = useContext(AuthContext);
    const { fetchDeleteRule, deleteRule, setDeleteRule, changeDeleteRule, deleteMessages, } = useContext(UserActionContext)
    const { messages, selectedUser, sendMessages, getMessages, setSelectedUser, setTriggerSearch, unseenMessages } = useContext(ChatContext)
    const { socket } = useContext(AuthContext)
    const [currTab, setCurrTab] = useState('Chat')
    const [msgImages, setMsgImage] = useState([])
    const scrollEnd = useRef();
    const [editorInstance, setEditorInstance] = useState(null);
    let typingTimeout;
    const typingUserId = useTypingStatus(socket, selectedUser?._id);
    const isTyping = typingUserId === selectedUser?._id;
    const [sharedLinks, setSharedLinks] = useState([]);

    const handleSendMessage = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        if (!editorInstance) return;

        const html = editorInstance.getHTML().trim();
        if (html === '' || html === '<p></p>') return;

        const imgMatch = html.match(/<img.*?src="(.*?)".*?>/);
        const imgSrc = imgMatch ? imgMatch[1] : null;

        const payload = {};

        if (imgSrc) payload.image = imgSrc;
        if (html) payload.text = html;

        await sendMessages(payload);
        editorInstance.commands.clearContent();
    };

    const hanldeSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            try {
                const base64String = reader.result;
                await sendMessages({ image: base64String });
                e.target.value = '';
            } catch (error) {
                toast.error('Failed to send image');
            }
        };

        reader.readAsDataURL(file);
    };


    const handleTyping = () => {
        if (socket && selectedUser) {
            socket.emit("typing", { senderId: authUser._id, receiverId: selectedUser._id });

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit("stopTyping", { senderId: authUser._id, receiverId: selectedUser._id });
            }, 1500);
        }
    };

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
            toast.error("Something went wrong");
        }
    };
    const handleEditorReady = (editor) => {
        setEditorInstance(editor);
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

        setMsgImage(messages.filter(msg => msg.image).map(msg => msg.image))
        const links = messages
            .map(msg => extractLinks(msg.text || '')) // extractLinks returns array of { text, href }
            .flat();

        setSharedLinks(links);
    }, [messages]);

    useEffect(() => {
        document.title = selectedUser
            ? `${unseenMessages && unseenMessages.length > 1 ? 'N' : ""} ${selectedUser.fullName} | Chit-Chat`
            : 'Chit-Chat';
    }, [selectedUser, unseenMessages]);

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
                                {['Chat', 'Links', 'Media'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setCurrTab(tab)}
                                        className={`font-bold text-md mr-6 ${currTab === tab ? 'text-blue-400' : 'text-white hover:text-white/85'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {currTab === 'Chat' && (<>
                        {/* ---Chat--- */}
                        <div className='p-3 px-5 flex flex-col h-[calc(100%-120px)] overflow-y-auto chatScorll flex-grow-1'>
                            {messages?.map((msg, index) => {
                                return (
                                    <div key={index}>
                                        <div>
                                            <div className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                                                <div className={`msg-show-box p-2 md:max-w-[550px] xl:max-w-[700px] md:text-sm font-light rounded-lg mb-8 break-all  text-white word ${msg.senderId === authUser._id ? 'rounded-br-none bg-[#7d44f8]' : 'rounded-bl-none bg-[#2a2a2a]'}`}>
                                                    {msg.image && (
                                                        <img
                                                            src={msg.image}
                                                            alt=""
                                                            className="max-w-[230px] mb-2 border border-gray-700 rounded-lg outline-hidden"
                                                        />
                                                    )}

                                                    {msg.text && (
                                                        <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                                                    )}
                                                </div>
                                                <div className="text-center text-xs">
                                                    <img
                                                        src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                                                        alt=""
                                                        className={`aspect-square rounded-full w-7 overflow-hidden ${msg.senderId !== authUser._id && 'ml-auto'}`}
                                                    />
                                                    <p className="text-gray-500 mt-2">{formateTime(msg.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                            <div ref={scrollEnd}></div>
                        </div>
                        {/* ---Field--- */}
                        <div className='flex-grow-1 p-2 px-5 flex relative flex-col'>
                            <div className='block'>
                                {/* <div className="text-[11px] -mt-2 text-gray-300 pl-1 py-[4px] -mb-0.5 bg-[#191919]">{selectedUser.fullName} is typing...</div> */}
                                {isTyping && (
                                    <div className="text-[11px] -mt-2 text-gray-300 pl-1 py-[4px] -mb-0.5 bg-[#191919]">{selectedUser.fullName} is typing...</div>
                                )}
                            </div>
                            <div className='flex-grow-1 flex relative'>
                                <div className='h-full flex items-start overflow-y-auto max-h-[200px] justify-center  border border-white/15 rounded-sm px-3 flex-grow-1'>
                                    <Tiptap onEditorReady={handleEditorReady} onCtrlEnter={handleSendMessage} onUpdate={handleTyping} />
                                </div>
                                <img onClick={handleSendMessage} src={assets.send_button} alt="" className='ml-3 w-8 cursor-pointer self-baseline-last' />
                                <div className='w-8 aspect-square self-baseline-last ml-3 bg-[#2a2a2a] rounded-full relative overflow-hidden'>
                                    <input
                                        type="file"
                                        id="files"
                                        accept="image/*"
                                        onChange={hanldeSendImage}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <img
                                        src={assets.gallery_icon}
                                        alt="Select Image"
                                        className="p-2 hover:-translate-y-0.5 cursor-pointer transition-transform duration-150"
                                    />
                                </div>

                            </div>
                        </div>
                    </>)}
                    {currTab === 'Links' && (<div className='p-2 px-5 flex flex-col'>
                        <span className='text-3xl font-semibold block text-center mt-2'>Links</span>
                        <div className='grid mediaContainer gap-5 mt-4 max-h-[calc(100dvh-195px)] overflow-y-auto'>
                            {sharedLinks.length === 0 ? (
                                <p className="text-sm text-gray-400 mt-5">No links shared yet.</p>
                            ) : (
                                <>
                                    {sharedLinks.map((link, idx) => (
                                        <div key={idx}>
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:underline break-all flex bg-[#121212] rounded-lg p-1"
                                            >
                                                <div className='p-2'>
                                                    <i className="fa-solid fa-link"></i>
                                                </div>
                                                <span className='p-2'>
                                                    {link.text}
                                                </span>
                                            </a>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>)}
                    {currTab === 'Media' && (<div className='p-2 px-5 flex flex-col'>
                        <span className='text-3xl font-semibold block text-center mt-2'>Media</span>
                        <div className='grid mediaContainer gap-5 mt-4 max-h-[calc(100dvh-195px)] overflow-y-auto'>
                            {msgImages.map((img, index) => (
                                <div key={index} className='max-h-[250px]' >
                                    <img src={img} alt="" className='w-full h-full rounded-lg' />
                                </div>
                            ))}
                        </div>
                    </div>)}
                </div >
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