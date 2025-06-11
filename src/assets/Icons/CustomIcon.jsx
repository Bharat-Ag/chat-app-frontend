export const OnlineBullet = ({ size = 3, state = 'online' }) => {
    return (
        <span style={{
            height: `${size * 4}px`,
            width: `${size * 4}px`
        }} className={`absolute ${state === 'online' ? 'bg-green-500' : 'bg-gray-400'} rounded-full bottom-0 right-0 border-2 border-[#191919]`}></span >
    )
}

export const CarrotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" style={{width:'7px'}} viewBox="0 0 256 512"> <path fill="#ffffff" d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" /></svg>
)