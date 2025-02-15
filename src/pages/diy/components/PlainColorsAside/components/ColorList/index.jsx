import { Input } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import { map, filter, includes } from 'lodash';
import {
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';

import { ColorItem } from '@/components/ColorItem'

import styles from './index.less'

const { Search } = Input
const ColorTypeToPlaceholder = {
    0: "颜色",
    1: "花布"
}
const onChange = (key) => {
  console.log(key);
};



const ColorList = ({ colors, colorType = 0 }) => {

    const [searchText, setSearchText] = useState('')

    const filteredColors = filter(colors, c => includes(c?.code, searchText))

    const onSearch = (input) => {
        setSearchText(input)
    }


    return (<div className={styles['color-list-wrapper']}>
        <div className={styles['color-list-header']}>
            <Search 
                prefix={<SearchOutlined />}  
                bordered={false} 
                addonAfter={null} 
                placeholder={ColorTypeToPlaceholder[colorType]} 
                allowClear 
                onSearch={onSearch} 
                style={{ width: 200 }} 
            />
            <PlusOutlined />
        </div>
        <div className={styles['color-list-body']}>
        {map(filteredColors, item => <ColorItem item={item} size={30} />)}
        </div>
        
    </div>)
};

export default ColorList;
