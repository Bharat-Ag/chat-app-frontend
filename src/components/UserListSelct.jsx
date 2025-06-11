
import { Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';

export const UserListSelct = ({ className = '' }) => {

    const { getUsers, users, setSelectedUser, triggerSearch, setTriggerSearch } = useContext(ChatContext)
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        getUsers();
    }, [])


    const options = users?.map(user => ({
        value: user._id,
        label: user.fullName,
    })) || [];


    const onChange = (value) => {
        const selected = users.find(u => u._id === value);
        setSelectedUser(selected);
        setSelectedValue(null);
        setTriggerSearch(false);
    };

    return (
        <Select
            suffixIcon={null}
            showSearch
            placeholder="Search person"
            optionFilterProp="label"
            onChange={onChange}
            onFocus={() => setTriggerSearch(true)}
            onSearch={() => setTriggerSearch(true)}
            onBlur={() => setTriggerSearch(false)}
            className={`placeholder:font-light h-full w-full themeSearch ${className}`}
            options={options}
            value={selectedValue}
            open={triggerSearch} // controlled by context
        />
    )
};
