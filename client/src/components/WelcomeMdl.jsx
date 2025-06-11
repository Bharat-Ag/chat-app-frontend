import { useEffect, useState } from 'react';
import { Modal } from 'antd';

const WelcomeMdl = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsModalOpen(true);
        }, 2000);
    }, [])

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Modal
                open={isModalOpen}
                closeIcon={null}
                onCancel={handleCancel}
                okText="Firse mat bolna ye"
                mask={false}
                cancelButtonProps={{ style: { display: 'none' } }}
                className='wleMdl'
            >
                <p className=' text-sm'>
                    Mazee karo sab kuch 1 din baad delete ho jayega
                </p>
            </Modal>
        </>
    );
};

export default WelcomeMdl;
