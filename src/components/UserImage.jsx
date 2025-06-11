import { OnlineBullet } from '../assets/Icons/CustomIcon'
import { getInitialsFromName } from '../libs/utils'
export default function UserImage({ user, bulletSize = 3, clickFunc, bubbleSize = '36', fontSz = '16', className = '' }) {
    return (
        <div className='w-fit relative cursor-pointer'>
            {user?.profilePic ? (
                <img
                    src={user?.profilePic}
                    alt=""
                    className={`rounded-full ${className}`}
                    style={{ width: `${bubbleSize}px`, height: `${bubbleSize}px` , minWidth: `${bubbleSize}px` }}
                    onClick={clickFunc}
                />
            ) : (
                <span
                    onClick={clickFunc}
                    style={{
                        width: `${bubbleSize}px`,
                        minWidth: `${bubbleSize}px`,
                        height: `${bubbleSize}px`,
                        fontSize: `${fontSz}px`,
                    }}
                    className={`rounded-full bg-[#444] flex items-center justify-center font-medium ${className}`}
                >
                    {getInitialsFromName(user?.fullName)}
                </span>
            )}
            <OnlineBullet size={bulletSize} state={user?.isOnlineVisible ? 'online' : 'offline'} />
        </div>
    );
}