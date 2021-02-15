import { Select, Divider, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';

const SizeSelect = ({ dispatch, styleSizeList, value, onChange }) => {
    console.log(value, 'value');
    const [newSize, setNewSize] = useState('');
    useEffect(() => {
        dispatch({
            type: 'global/fetchStyleSizeList',
        });
    }, []);
    const handleAddSize = () => {
        dispatch({
            type: 'global/addStyleSize',
            payload: { name: newSize },
        });
    };
    return (
        <Select
            value={value}
            onChange={onChange}
            options={styleSizeList.map(s => ({ label: s.name, value: s.name }))}
            dropdownRender={menu => (
                <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <Input
                            style={{ flex: 'auto' }}
                            value={newSize}
                            onChange={e => {
                                setNewSize(e.target.value);
                            }}
                        />
                        <a
                            style={{
                                flex: 'none',
                                padding: '8px',
                                display: 'block',
                                cursor: 'pointer',
                            }}
                            onClick={handleAddSize}
                        >
                            <PlusOutlined /> Add item
                        </a>
                    </div>
                </div>
            )}
        />
    );
};

export default connect(({ global }) => ({
    styleSizeList: global.styleSizeList,
}))(SizeSelect);
