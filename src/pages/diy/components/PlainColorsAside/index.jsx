import { Tabs } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { map } from 'lodash';

import { ColorItem } from '@/components/ColorItem'
import ColorList from './components/ColorList'

const onChange = (key) => {
  console.log(key);
};



const PlainColorsAside = ({ plainColors }) => {
    const PlainColorsItems = [ 
        { 
            label: "颜色选择",
            key: 1,
            children: <ColorList />,
        },
        { 
            label: "自主上传",
            key: 2,
            children: <div>{map(plainColors, item => <ColorItem item={item} size={30} />)}</div>,
        },
    ]
    return (
        <Tabs
            onChange={onChange}
            type="card"
            items={PlainColorsItems}
        />)
};

// export default PlainColorsAside;

export default connect(({ diy }) => ({
    plainColors: diy.plainColors
}))(PlainColorsAside);