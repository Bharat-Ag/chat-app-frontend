export const OnlineBullet = ({ size = 3, state = 'online' }) => {
    return (
        <span style={{
            height: `${size * 4}px`,
            width: `${size * 4}px`
        }} className={`absolute ${state === 'online' ? 'bg-green-500' : 'bg-gray-400'} rounded-full bottom-0 right-0 border-2 border-[#191919]`}></span >
    )
}